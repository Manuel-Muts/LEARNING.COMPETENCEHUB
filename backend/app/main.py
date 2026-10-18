import secrets
import re
from datetime import UTC, date, datetime, timedelta
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text, update
from sqlalchemy.dialects.postgresql import insert as postgresql_insert
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session, selectinload

from app.config import settings
from app.db import get_db
from app.gemini_questions import (
    GeminiNotConfiguredError,
    GeminiQuestionGenerationError,
    generate_questions,
)
from app.models import (
    AuthSession,
    GeneratedPracticeQuestion,
    GuardianAccount,
    LearnerQuestionAttempt,
    LearnerQuestionGenerationUsage,
    LearnerProfile,
    PasswordResetCode,
)
from app.phone import normalize_kenyan_phone_number
from app.schemas import (
    AccountResponse,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
    LoginRequest,
    PasswordResetRequest,
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
    allow_methods=["GET", "POST", "OPTIONS"],
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
