import io
import logging
import secrets
import re
from datetime import UTC, date, datetime, timedelta
from pathlib import PurePosixPath
from urllib.parse import quote
from uuid import UUID

import cloudinary
from cloudinary.exceptions import Error as CloudinaryError
from cloudinary.uploader import destroy as cloudinary_destroy
from cloudinary.uploader import upload as cloudinary_upload
from fastapi import Depends, FastAPI, File, Form, HTTPException, Query, Request, Response, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy import func, select, text, update
from sqlalchemy.dialects.postgresql import insert as postgresql_insert
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.config import settings
from app.db import get_db
from app.document_uploads import document_filename, validate_document
from app.gemini_questions import (
    GeminiNotConfiguredError,
    GeminiQuestionGenerationError,
    generate_questions,
)
from app.models import (
    AuthSession,
    AdminAccount,
    AdminSession,
    GeneratedPracticeQuestion,
    GuardianAccount,
    LearnerQuestionAttempt,
    LearnerQuestionGenerationUsage,
    LearnerProfile,
    PasswordResetCode,
    PastPaperDocument,
)
from app.phone import normalize_kenyan_phone_number
from app.schemas import (
    AccountResponse,
    AdminLoginRequest,
    AdminResponse,
    AdminUserResponse,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
    LoginRequest,
    PaginatedAdminUsersResponse,
    PaginatedPastPapersResponse,
    PasswordResetRequest,
    PastPaperResponse,
    PhoneRequest,
    QuestionAttemptResponse,
    QuestionProgressResponse,
    RecordQuestionAttemptRequest,
    SavedGeneratedQuestion,
    SignupRequest,
    StatusResponse,
)
from app.security import (
    create_session,
    get_account_for_token,
    hash_password,
    hash_session_token,
    session_code_digest,
    token_hash_matches,
    verify_password,
)
from app.sms import (
    SmsDeliveryError,
    SmsNotConfiguredError,
    ensure_sms_available,
    send_password_reset_code,
)

DUMMY_PASSWORD_HASH = (
    "$argon2id$v=19$m=65536,t=3,p=4$pSsh3SnTGS0NNx85MydG3g"
    "$T5o88aLG7gEIhrzUiwSSnJw18PLdFCE+AgoPBggsQT8"
)
logger = logging.getLogger(__name__)
ADMIN_SESSION_COOKIE = "competencehub_admin_session"
MAX_PAST_PAPER_BYTES = 20 * 1024 * 1024
PAST_PAPERS_PAGE_SIZE = 10
ADMIN_TABLE_PAGE_SIZE = 5
cloudinary_is_configured = all(
    (
        settings.cloudinary_cloud_name,
        settings.cloudinary_api_key
        and settings.cloudinary_api_key.get_secret_value().strip(),
        settings.cloudinary_api_secret
        and settings.cloudinary_api_secret.get_secret_value().strip(),
    )
)
if cloudinary_is_configured:
    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key.get_secret_value(),
        api_secret=settings.cloudinary_api_secret.get_secret_value(),
        secure=True,
    )
QUESTION_GENERATION_BATCH_SIZE = 5
QUESTION_GENERATION_DAILY_LIMIT = 10

app = FastAPI(
    title="CompetenceHub Learner API",
    version="1.0.0",
    description=(
        "Guardian authentication, learner profiles, junior practice progress, "
        "and AI-generated questions."
    ),
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

if settings.auth_cookie_samesite not in {"lax", "strict", "none"}:
    raise ValueError("AUTH_COOKIE_SAMESITE must be lax, strict, or none.")
if settings.auth_cookie_samesite == "none" and not settings.auth_cookie_secure:
    raise ValueError("AUTH_COOKIE_SECURE must be true when AUTH_COOKIE_SAMESITE is none.")
if settings.auth_session_ttl_hours < 1:
    raise ValueError("AUTH_SESSION_TTL_HOURS must be at least 1.")


def account_response(account: GuardianAccount) -> AccountResponse:
    return AccountResponse(
        id=account.id,
        phone=account.phone_e164,
        email=account.email,
        learners=account.learners,
    )


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.auth_session_cookie,
        value=token,
        max_age=settings.auth_session_ttl_hours * 60 * 60,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        domain=settings.auth_cookie_domain,
        path="/",
    )


def get_request_token(request: Request) -> str | None:
    cookie_token = request.cookies.get(settings.auth_session_cookie)
    if cookie_token:
        return cookie_token

    authorization = request.headers.get("Authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() == "bearer" and token:
        return token
    return None


def require_account(
    request: Request,
    db: Session = Depends(get_db),
) -> GuardianAccount:
    token = get_request_token(request)
    account = get_account_for_token(db, token) if token else None
    if account is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in required.")
    return account


def require_admin(request: Request, db: Session = Depends(get_db)) -> AdminAccount:
    token = request.cookies.get(ADMIN_SESSION_COOKIE)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin sign-in required.")
    session = db.scalar(
        select(AdminSession)
        .where(
            AdminSession.token_hash == hash_session_token(token),
            AdminSession.revoked_at.is_(None),
            AdminSession.expires_at > datetime.now(UTC),
        )
        .options(selectinload(AdminSession.admin))
    )
    if session is None or not session.admin.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin sign-in required.")
    return session.admin


def set_admin_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=ADMIN_SESSION_COOKIE,
        value=token,
        max_age=settings.auth_session_ttl_hours * 60 * 60,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        domain=settings.auth_cookie_domain,
        path="/",
    )


def past_paper_response(document: PastPaperDocument) -> PastPaperResponse:
    return PastPaperResponse(
        id=document.id,
        title=document.title,
        grade_id=document.grade_id,
        subject=document.subject,
        year=document.year,
        filename=document.filename,
        content_type=document.content_type,
        created_at=document.created_at,
    )


def reserve_question_generation_quota(
    db: Session,
    learner_profile_id: UUID,
    usage_date: date,
) -> int:
    usage = LearnerQuestionGenerationUsage.__table__
    statement = (
        postgresql_insert(LearnerQuestionGenerationUsage)
        .values(
            learner_profile_id=learner_profile_id,
            usage_date=usage_date,
            questions_generated=QUESTION_GENERATION_BATCH_SIZE,
        )
        .on_conflict_do_update(
            index_elements=[usage.c.learner_profile_id, usage.c.usage_date],
            set_={
                "questions_generated": (
                    usage.c.questions_generated + QUESTION_GENERATION_BATCH_SIZE
                )
            },
            where=(
                usage.c.questions_generated + QUESTION_GENERATION_BATCH_SIZE
                <= QUESTION_GENERATION_DAILY_LIMIT
            ),
        )
        .returning(usage.c.questions_generated)
    )
    questions_generated = db.scalar(statement)
    if questions_generated is None:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You have reached today's limit of 10 generated questions. Try again tomorrow.",
        )
    db.commit()
    return QUESTION_GENERATION_DAILY_LIMIT - questions_generated


def release_question_generation_quota(
    db: Session,
    learner_profile_id: UUID,
    usage_date: date,
) -> None:
    usage = LearnerQuestionGenerationUsage.__table__
    db.execute(
        update(LearnerQuestionGenerationUsage)
        .where(
            usage.c.learner_profile_id == learner_profile_id,
            usage.c.usage_date == usage_date,
        )
        .values(
            questions_generated=(
                usage.c.questions_generated - QUESTION_GENERATION_BATCH_SIZE
            )
        )
    )
    db.commit()


def get_owned_learner(
    db: Session,
    account: GuardianAccount,
    learner_id: UUID,
) -> LearnerProfile:
    learner = db.scalar(
        select(LearnerProfile).where(
            LearnerProfile.id == learner_id,
            LearnerProfile.guardian_account_id == account.id,
        )
    )
    if learner is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learner profile not found.",
        )
    return learner


def saved_generated_question(
    generated_question: GeneratedPracticeQuestion,
) -> SavedGeneratedQuestion:
    return SavedGeneratedQuestion(
        id=generated_question.id,
        prompt=generated_question.prompt,
        options=generated_question.options,
        correct_answer_index=generated_question.correct_answer_index,
        explanation=generated_question.explanation,
    )


@app.get("/api/v1/health", response_model=StatusResponse)
def health(db: Session = Depends(get_db)) -> StatusResponse:
    db.execute(text("SELECT 1"))
    return StatusResponse(message="API and database are available.")


@app.post("/api/v1/admin/login", response_model=AdminResponse)
def admin_login(
    payload: AdminLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AdminResponse:
    email = str(payload.email).strip().lower()
    admin = db.scalar(select(AdminAccount).where(AdminAccount.email == email))
    stored_hash = admin.password_hash if admin else DUMMY_PASSWORD_HASH
    password_matches = verify_password(payload.password, stored_hash)
    if admin is None or not admin.is_active or not password_matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The email or password is incorrect.",
        )

    token = secrets.token_urlsafe(48)
    db.add(
        AdminSession(
            admin_account_id=admin.id,
            token_hash=hash_session_token(token),
            expires_at=datetime.now(UTC) + timedelta(hours=settings.auth_session_ttl_hours),
        )
    )
    db.commit()
    set_admin_session_cookie(response, token)
    return AdminResponse(email=admin.email)


@app.get("/api/v1/admin/me", response_model=AdminResponse)
def admin_me(admin: AdminAccount = Depends(require_admin)) -> AdminResponse:
    return AdminResponse(email=admin.email)


@app.post("/api/v1/admin/logout", response_model=StatusResponse)
def admin_logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> StatusResponse:
    token = request.cookies.get(ADMIN_SESSION_COOKIE)
    if token:
        db.execute(
            update(AdminSession)
            .where(
                AdminSession.token_hash == hash_session_token(token),
                AdminSession.revoked_at.is_(None),
            )
            .values(revoked_at=datetime.now(UTC))
        )
        db.commit()
    response.delete_cookie(
        key=ADMIN_SESSION_COOKIE,
        domain=settings.auth_cookie_domain,
        path="/",
        secure=settings.auth_cookie_secure,
        httponly=True,
        samesite=settings.auth_cookie_samesite,
    )
    return StatusResponse(message="Signed out.")


@app.get("/api/v1/admin/users", response_model=list[AdminUserResponse])
def admin_users(
    _: AdminAccount = Depends(require_admin),
    db: Session = Depends(get_db),
) -> list[AdminUserResponse]:
    accounts = db.scalars(
        select(GuardianAccount)
        .options(selectinload(GuardianAccount.learners))
        .order_by(GuardianAccount.created_at.desc())
    ).all()
    return [
        AdminUserResponse(
            id=account.id,
            phone=account.phone_e164,
            email=account.email,
            created_at=account.created_at,
            learners=account.learners,
        )
        for account in accounts
    ]


@app.get(
    "/api/v1/admin/users/page",
    response_model=PaginatedAdminUsersResponse,
)
def admin_users_page(
    page: int = Query(default=1, ge=1),
    _: AdminAccount = Depends(require_admin),
    db: Session = Depends(get_db),
) -> PaginatedAdminUsersResponse:
    total = db.scalar(select(func.count()).select_from(GuardianAccount)) or 0
    accounts = db.scalars(
        select(GuardianAccount)
        .options(selectinload(GuardianAccount.learners))
        .order_by(GuardianAccount.created_at.desc(), GuardianAccount.id)
        .offset((page - 1) * ADMIN_TABLE_PAGE_SIZE)
        .limit(ADMIN_TABLE_PAGE_SIZE)
    ).all()
    return PaginatedAdminUsersResponse(
        items=[
            AdminUserResponse(
                id=account.id,
                phone=account.phone_e164,
                email=account.email,
                created_at=account.created_at,
                learners=account.learners,
            )
            for account in accounts
        ],
        total=total,
        page=page,
        page_size=ADMIN_TABLE_PAGE_SIZE,
    )


@app.get("/api/v1/past-papers", response_model=list[PastPaperResponse])
def list_past_papers(
    grade_id: str | None = Query(default=None, pattern=r"^(pg|pp[12]|grade-[1-9])$"),
    subject: str | None = Query(default=None, min_length=1, max_length=80),
    db: Session = Depends(get_db),
) -> list[PastPaperResponse]:
    statement = select(PastPaperDocument).order_by(
        PastPaperDocument.year.desc(), PastPaperDocument.title
    )
    if grade_id:
        statement = statement.where(PastPaperDocument.grade_id == grade_id)
    if subject:
        statement = statement.where(PastPaperDocument.subject == subject)
    return [past_paper_response(item) for item in db.scalars(statement).all()]


@app.get(
    "/api/v1/past-papers/page",
    response_model=PaginatedPastPapersResponse,
)
def list_past_papers_page(
    grade_id: str = Query(pattern=r"^(pg|pp[12]|grade-[1-9])$"),
    subject: str = Query(min_length=1, max_length=80),
    page: int = Query(default=1, ge=1),
    db: Session = Depends(get_db),
) -> PaginatedPastPapersResponse:
    filters = (
        PastPaperDocument.grade_id == grade_id,
        PastPaperDocument.subject == subject,
    )
    total = db.scalar(
        select(func.count()).select_from(PastPaperDocument).where(*filters)
    ) or 0
    documents = db.scalars(
        select(PastPaperDocument)
        .where(*filters)
        .order_by(
            PastPaperDocument.year.desc(),
            PastPaperDocument.title,
            PastPaperDocument.created_at.desc(),
            PastPaperDocument.id,
        )
        .offset((page - 1) * PAST_PAPERS_PAGE_SIZE)
        .limit(PAST_PAPERS_PAGE_SIZE)
    ).all()
    return PaginatedPastPapersResponse(
        items=[past_paper_response(item) for item in documents],
        total=total,
        page=page,
        page_size=PAST_PAPERS_PAGE_SIZE,
    )


@app.get(
    "/api/v1/admin/past-papers/page",
    response_model=PaginatedPastPapersResponse,
)
def admin_past_papers_page(
    page: int = Query(default=1, ge=1),
    _: AdminAccount = Depends(require_admin),
    db: Session = Depends(get_db),
) -> PaginatedPastPapersResponse:
    total = db.scalar(select(func.count()).select_from(PastPaperDocument)) or 0
    documents = db.scalars(
        select(PastPaperDocument)
        .order_by(
            PastPaperDocument.year.desc(),
            PastPaperDocument.title,
            PastPaperDocument.created_at.desc(),
            PastPaperDocument.id,
        )
        .offset((page - 1) * ADMIN_TABLE_PAGE_SIZE)
        .limit(ADMIN_TABLE_PAGE_SIZE)
    ).all()
    return PaginatedPastPapersResponse(
        items=[past_paper_response(item) for item in documents],
        total=total,
        page=page,
        page_size=ADMIN_TABLE_PAGE_SIZE,
    )


@app.get("/api/v1/past-papers/{document_id}/file")
def download_past_paper(
    document_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    document = db.get(PastPaperDocument, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Past paper not found.")
    return RedirectResponse(
        document.cloudinary_url,
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{quote(document.filename)}",
            "X-Content-Type-Options": "nosniff",
        },
    )


@app.post(
    "/api/v1/admin/past-papers",
    response_model=PastPaperResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_past_paper(
    title: str = Form(min_length=1, max_length=160),
    grade_id: str = Form(pattern=r"^(pg|pp[12]|grade-[1-9])$"),
    subject: str = Form(min_length=1, max_length=80),
    file: UploadFile = File(),
    _: AdminAccount = Depends(require_admin),
    db: Session = Depends(get_db),
) -> PastPaperResponse:
    filename = document_filename(file.filename)
    extension = PurePosixPath(filename).suffix.lower()
    content = await file.read(MAX_PAST_PAPER_BYTES + 1)
    if len(content) > MAX_PAST_PAPER_BYTES:
        raise HTTPException(status_code=413, detail="Documents must be 20 MB or smaller.")
    try:
        content_type = validate_document(filename, content)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    normalized_title = title.strip()
    normalized_subject = subject.strip()
    if not normalized_title or not normalized_subject:
        raise HTTPException(status_code=422, detail="Title and subject cannot be blank.")

    if not cloudinary_is_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Document storage is not configured. Contact the site administrator.",
        )
    public_id = f"{settings.cloudinary_folder.strip('/')}/{secrets.token_hex(16)}{extension}"
    try:
        cloudinary_result = cloudinary_upload(
            io.BytesIO(content),
            resource_type="raw",
            public_id=public_id,
            use_filename=False,
            unique_filename=False,
            overwrite=False,
        )
    except CloudinaryError as error:
        logger.error("Cloudinary past-paper upload failed: %s", error)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Cloudinary could not store the document. Check the backend log for the "
                "provider error, then verify the Cloudinary credentials, account limits, "
                "and upload permissions."
            ),
        ) from error
    secure_url = cloudinary_result.get("secure_url")
    stored_public_id = cloudinary_result.get("public_id")
    if not isinstance(secure_url, str) or not isinstance(stored_public_id, str):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Document storage returned an invalid response.",
        )

    document = PastPaperDocument(
        title=normalized_title,
        grade_id=grade_id,
        subject=normalized_subject,
        year=datetime.now(UTC).year,
        filename=filename[:255],
        content_type=content_type,
        cloudinary_public_id=stored_public_id,
        cloudinary_url=secure_url,
    )
    db.add(document)
    try:
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        try:
            cloudinary_destroy(stored_public_id, resource_type="raw", invalidate=True)
        except CloudinaryError as cleanup_error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    "The document upload failed to save and its Cloudinary cleanup failed. "
                    "Contact the site administrator."
                ),
            ) from cleanup_error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The document record could not be saved; the uploaded file was removed.",
        ) from error
    db.refresh(document)
    return past_paper_response(document)


@app.delete("/api/v1/admin/past-papers/{document_id}", response_model=StatusResponse)
def delete_past_paper(
    document_id: UUID,
    _: AdminAccount = Depends(require_admin),
    db: Session = Depends(get_db),
) -> StatusResponse:
    document = db.get(PastPaperDocument, document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Past paper not found.")
    if document.cloudinary_public_id:
        try:
            cloudinary_destroy(document.cloudinary_public_id, resource_type="raw", invalidate=True)
        except CloudinaryError as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="The document could not be removed from Cloudinary.",
            ) from error
    db.delete(document)
    try:
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The document record could not be deleted. Contact the site administrator.",
        ) from error
    return StatusResponse(message="Past paper deleted.")


@app.post(
    "/api/v1/questions/generate",
    response_model=GenerateQuestionsResponse,
)
def generate_practice_questions(
    payload: GenerateQuestionsRequest,
    account: GuardianAccount = Depends(require_account),
    db: Session = Depends(get_db),
) -> GenerateQuestionsResponse:
    if settings.gemini_api_key is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI question generation is not configured. Contact the site administrator.",
        )

    learner = get_owned_learner(db, account, payload.learner_id)
    previous_prompts = db.scalars(
        select(GeneratedPracticeQuestion.prompt)
        .where(
            GeneratedPracticeQuestion.learner_profile_id == learner.id,
            GeneratedPracticeQuestion.grade_id == payload.grade_id,
            GeneratedPracticeQuestion.subject == payload.subject,
        )
        .order_by(GeneratedPracticeQuestion.created_at.desc())
        .limit(40)
    ).all()
    usage_date = datetime.now(UTC).date()
    remaining_today = reserve_question_generation_quota(
        db,
        learner.id,
        usage_date,
    )
    try:
        questions = generate_questions(
            payload.grade_id,
            payload.subject,
            list(dict.fromkeys(payload.recent_questions + list(previous_prompts))),
        )
    except GeminiNotConfiguredError as error:
        release_question_generation_quota(db, account.id, usage_date)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI question generation is not configured. Contact the site administrator.",
        ) from error
    except GeminiQuestionGenerationError as error:
        release_question_generation_quota(db, account.id, usage_date)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(error),
        ) from error

    saved_questions = [
        GeneratedPracticeQuestion(
            learner_profile_id=learner.id,
            grade_id=payload.grade_id,
            subject=payload.subject,
            prompt=question.prompt,
            options=question.options,
            correct_answer_index=question.correct_answer_index,
            explanation=question.explanation,
        )
        for question in questions
    ]
    try:
        db.add_all(saved_questions)
        db.commit()
    except SQLAlchemyError as error:
        db.rollback()
        release_question_generation_quota(db, learner.id, usage_date)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Generated questions could not be saved. Please try again.",
        ) from error

    return GenerateQuestionsResponse(
        questions=[saved_generated_question(item) for item in saved_questions],
        remaining_today=remaining_today,
    )


@app.get(
    "/api/v1/questions/progress",
    response_model=QuestionProgressResponse,
)
def get_question_progress(
    grade_id: str = Query(pattern=r"^grade-[789]$"),
    subject: str = Query(
        pattern=(
            r"^(Mathematics|English|Kiswahili|Integrated Science|Agriculture|"
            r"Christian Religious Education|Pre-Technical Studies|"
            r"Creative Arts and Sports|Social Studies)$"
        )
    ),
    learner_id: UUID = Query(),
    account: GuardianAccount = Depends(require_account),
    db: Session = Depends(get_db),
) -> QuestionProgressResponse:
    learner = get_owned_learner(db, account, learner_id)
    attempts = db.execute(
        select(LearnerQuestionAttempt.question_key, LearnerQuestionAttempt.is_correct)
        .where(
            LearnerQuestionAttempt.learner_profile_id == learner.id,
            LearnerQuestionAttempt.grade_id == grade_id,
            LearnerQuestionAttempt.subject == subject,
        )
        .order_by(LearnerQuestionAttempt.created_at.desc())
    ).all()
    latest_attempt_by_question: dict[str, bool] = {}
    for question_key, is_correct in attempts:
        latest_attempt_by_question.setdefault(question_key, is_correct)
    answered_bank_keys = {
        question_key
        for question_key in latest_attempt_by_question
        if re.fullmatch(r"bank-[0-9]", question_key)
    }
    generated_attempt_keys = {
        question_key
        for question_key in latest_attempt_by_question
        if question_key.startswith("generated:")
    }
    pending_generated = db.scalars(
        select(GeneratedPracticeQuestion)
        .where(
            GeneratedPracticeQuestion.learner_profile_id == learner.id,
            GeneratedPracticeQuestion.grade_id == grade_id,
            GeneratedPracticeQuestion.subject == subject,
        )
        .order_by(GeneratedPracticeQuestion.created_at.desc())
        .limit(100)
    ).all()
    pending_questions = [
        item
        for item in pending_generated
        if f"generated:{item.id}" not in generated_attempt_keys
    ]
    usage = db.get(
        LearnerQuestionGenerationUsage,
        (learner.id, datetime.now(UTC).date()),
    )
    bank_correct_answers = sum(
        1
        for question_key, is_correct in latest_attempt_by_question.items()
        if re.fullmatch(r"bank-[0-9]", question_key) and is_correct
    )
    return QuestionProgressResponse(
        learner_id=learner.id,
        grade_id=grade_id,
        subject=subject,
        answered_bank_question_keys=sorted(answered_bank_keys),
        bank_completed=len(answered_bank_keys) == 10,
        bank_correct_answers=bank_correct_answers,
        total_correct_answers=sum(latest_attempt_by_question.values()),
        total_answered=len(latest_attempt_by_question),
        pending_generated_questions=[
            saved_generated_question(item) for item in pending_questions
        ],
        remaining_today=max(
            0,
            QUESTION_GENERATION_DAILY_LIMIT
            - (usage.questions_generated if usage else 0),
        ),
    )


@app.post(
    "/api/v1/questions/attempt",
    response_model=QuestionAttemptResponse,
    status_code=status.HTTP_201_CREATED,
)
def record_question_attempt(
    payload: RecordQuestionAttemptRequest,
    account: GuardianAccount = Depends(require_account),
    db: Session = Depends(get_db),
) -> QuestionAttemptResponse:
    learner = get_owned_learner(db, account, payload.learner_id)
    if payload.source == "bank":
        if re.fullmatch(r"bank-[0-9]", payload.question_key) is None:
            raise HTTPException(status_code=422, detail="Invalid bank question identifier.")
    else:
        if not payload.question_key.startswith("generated:"):
            raise HTTPException(status_code=422, detail="Invalid generated question identifier.")
        try:
            question_id = UUID(payload.question_key.removeprefix("generated:"))
        except ValueError as error:
            raise HTTPException(status_code=422, detail="Invalid generated question identifier.") from error
        generated_question = db.scalar(
            select(GeneratedPracticeQuestion).where(
                GeneratedPracticeQuestion.id == question_id,
                GeneratedPracticeQuestion.learner_profile_id == learner.id,
                GeneratedPracticeQuestion.grade_id == payload.grade_id,
                GeneratedPracticeQuestion.subject == payload.subject,
            )
        )
        if generated_question is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Generated question not found.",
            )

    db.add(
        LearnerQuestionAttempt(
            learner_profile_id=learner.id,
            grade_id=payload.grade_id,
            subject=payload.subject,
            question_key=payload.question_key,
            source=payload.source,
            is_correct=payload.is_correct,
        )
    )
    db.commit()
    return QuestionAttemptResponse(message="Practice activity saved.")


@app.post(
    "/api/v1/auth/signup",
    response_model=AccountResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    payload: SignupRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AccountResponse:
    phone = normalize_kenyan_phone_number(payload.guardian_phone)
    if phone is None:
        raise HTTPException(status_code=422, detail="Enter a valid Kenyan mobile number.")

    email = str(payload.email).strip().lower() if payload.email else None
    account = GuardianAccount(
        phone_e164=phone,
        email=email,
        password_hash=hash_password(payload.password),
    )
    account.learners.append(LearnerProfile(display_name=payload.learner_name.strip()))
    db.add(account)
    try:
        db.flush()
        token, _ = create_session(db, account)
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists for this phone number or email.",
        ) from error
    db.refresh(account)
    account.learners
    set_session_cookie(response, token)
    return account_response(account)


@app.post("/api/v1/auth/login", response_model=AccountResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
) -> AccountResponse:
    phone = normalize_kenyan_phone_number(payload.phone)
    account = (
        db.scalar(
            select(GuardianAccount)
            .where(GuardianAccount.phone_e164 == phone)
            .options(selectinload(GuardianAccount.learners))
        )
        if phone
        else None
    )
    stored_hash = account.password_hash if account else DUMMY_PASSWORD_HASH
    password_matches = verify_password(payload.password, stored_hash)
    if account is None or not account.is_active or not password_matches:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="The contact number or password is incorrect.",
        )

    token, _ = create_session(db, account)
    db.commit()
    set_session_cookie(response, token)
    return account_response(account)


@app.get("/api/v1/auth/me", response_model=AccountResponse)
def me(account: GuardianAccount = Depends(require_account)) -> AccountResponse:
    return account_response(account)


@app.post("/api/v1/auth/logout", response_model=StatusResponse)
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> StatusResponse:
    token = get_request_token(request)
    if token:
        db.execute(
            update(AuthSession)
            .where(
                AuthSession.token_hash == hash_session_token(token),
                AuthSession.revoked_at.is_(None),
            )
            .values(revoked_at=datetime.now(UTC))
        )
        db.commit()
    response.delete_cookie(
        key=settings.auth_session_cookie,
        domain=settings.auth_cookie_domain,
        path="/",
        secure=settings.auth_cookie_secure,
        httponly=True,
        samesite=settings.auth_cookie_samesite,
    )
    return StatusResponse(message="Signed out.")


@app.post("/api/v1/auth/password-reset/request", response_model=StatusResponse)
def request_password_reset(
    payload: PhoneRequest,
    db: Session = Depends(get_db),
) -> StatusResponse:
    try:
        ensure_sms_available()
    except SmsNotConfiguredError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset SMS is not configured. Contact the site administrator.",
        ) from error

    phone = normalize_kenyan_phone_number(payload.phone)
    account = (
        db.scalar(select(GuardianAccount).where(GuardianAccount.phone_e164 == phone))
        if phone
        else None
    )

    if account is None:
        return StatusResponse(message="If an account exists, a reset code will be sent.")

    code = f"{secrets.randbelow(1_000_000):06d}"
    reset = PasswordResetCode(
        guardian_account_id=account.id,
        code_hash="",
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
    )
    db.add(reset)
    db.flush()
    reset.code_hash = session_code_digest(reset.id, code)
    try:
        send_password_reset_code(account.phone_e164, code)
    except SmsNotConfiguredError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Password reset SMS is not configured. Contact the site administrator.",
        ) from error
    except SmsDeliveryError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Could not send the password reset code. Please try again later.",
        ) from error
    db.commit()
    return StatusResponse(message="If an account exists, a reset code will be sent.")


@app.post("/api/v1/auth/password-reset/confirm", response_model=StatusResponse)
def confirm_password_reset(
    payload: PasswordResetRequest,
    db: Session = Depends(get_db),
) -> StatusResponse:
    phone = normalize_kenyan_phone_number(payload.phone)
    if phone is None:
        raise HTTPException(status_code=422, detail="Enter a valid Kenyan mobile number.")
    account = db.scalar(
        select(GuardianAccount).where(GuardianAccount.phone_e164 == phone)
    )
    if account is None:
        raise HTTPException(status_code=400, detail="The reset request is invalid or expired.")

    now = datetime.now(UTC)
    reset = db.scalar(
        select(PasswordResetCode)
        .where(
            PasswordResetCode.guardian_account_id == account.id,
            PasswordResetCode.consumed_at.is_(None),
            PasswordResetCode.expires_at > now,
            PasswordResetCode.attempts < 5,
        )
        .order_by(PasswordResetCode.created_at.desc())
    )
    if reset is None:
        raise HTTPException(status_code=400, detail="The reset request is invalid or expired.")

    expected_digest = session_code_digest(reset.id, payload.code)
    if not token_hash_matches(reset.code_hash, expected_digest):
        reset.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="The reset request is invalid or expired.")

    reset.consumed_at = now
    account.password_hash = hash_password(payload.new_password)
    for auth_session in db.scalars(
        select(AuthSession).where(
            AuthSession.guardian_account_id == account.id,
            AuthSession.revoked_at.is_(None),
        )
    ):
        auth_session.revoked_at = now
    db.commit()
    return StatusResponse(message="Password updated. You can now sign in.")
