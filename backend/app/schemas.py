from datetime import datetime
from uuid import UUID
from typing import Literal
import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, ValidationInfo, field_validator

UPPER_PRIMARY_PRACTICE_SUBJECTS = frozenset(
    {
        "Mathematics",
        "English",
        "Kiswahili",
        "Science and Technology",
        "Integrated Science",
        "Social Studies",
        "Christian Religious Education",
        "Creative Arts and Sports",
    }
)
JUNIOR_PRACTICE_SUBJECTS = frozenset(
    {
        "Mathematics",
        "English",
        "Kiswahili",
        "Integrated Science",
        "Agriculture",
        "Christian Religious Education",
        "Pre-Technical Studies",
        "Creative Arts and Sports",
        "Social Studies",
    }
)


class SignupRequest(BaseModel):
    learner_name: str = Field(min_length=1, max_length=120)
    guardian_phone: str = Field(min_length=9, max_length=24)
    password: str = Field(min_length=8, max_length=128)
    email: EmailStr | None = None

    @field_validator("learner_name")
    @classmethod
    def learner_name_must_not_be_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Learner name cannot be blank.")
        return normalized


class LoginRequest(BaseModel):
    phone: str = Field(min_length=9, max_length=24)
    password: str = Field(min_length=1, max_length=128)


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AdminResponse(BaseModel):
    email: EmailStr


class PastPaperResponse(BaseModel):
    id: UUID
    title: str
    grade_id: str
    subject: str
    year: int
    filename: str
    content_type: str
    created_at: datetime


class PaginatedPastPapersResponse(BaseModel):
    items: list[PastPaperResponse]
    total: int
    page: int
    page_size: int


class PhoneRequest(BaseModel):
    phone: str = Field(min_length=9, max_length=24)


class PasswordResetRequest(PhoneRequest):
    code: str = Field(pattern=r"^\d{6}$")
    new_password: str = Field(min_length=8, max_length=128)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class LearnerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    display_name: str
    grade_id: str | None


class AdminUserResponse(BaseModel):
    id: UUID
    phone: str
    email: str | None
    created_at: datetime
    learners: list[LearnerResponse]


class PaginatedAdminUsersResponse(BaseModel):
    items: list[AdminUserResponse]
    total: int
    page: int
    page_size: int


class AccountResponse(BaseModel):
    id: UUID
    phone: str
    email: str | None
    learners: list[LearnerResponse]


class UpdateLearnerNameRequest(BaseModel):
    display_name: str = Field(min_length=1, max_length=120)

    @field_validator("display_name")
    @classmethod
    def display_name_must_not_be_blank(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Learner name cannot be blank.")
        return normalized


class StatusResponse(BaseModel):
    message: str


class GenerateQuestionsRequest(BaseModel):
    learner_id: UUID
    grade_id: str = Field(pattern=r"^grade-[789]$")
    subject: str = Field(
        pattern=(
            r"^(Mathematics|English|Kiswahili|Integrated Science|Agriculture|"
            r"Christian Religious Education|Pre-Technical Studies|"
            r"Creative Arts and Sports|Social Studies)$"
        )
    )
    recent_questions: list[str] = Field(default_factory=list, max_length=40)

    @field_validator("recent_questions")
    @classmethod
    def recent_questions_must_be_bounded(cls, questions: list[str]) -> list[str]:
        if any(len(prompt) > 500 for prompt in questions):
            raise ValueError("Recent question prompts must be at most 500 characters.")
        return questions


class GeneratedQuestion(BaseModel):
    prompt: str = Field(min_length=8, max_length=1000)
    options: list[str] = Field(min_length=4, max_length=4)
    correct_answer_index: int = Field(ge=0, le=3)
    explanation: str = Field(min_length=8, max_length=1000)


class SavedGeneratedQuestion(GeneratedQuestion):
    id: UUID


class GenerateQuestionsResponse(BaseModel):
    questions: list[SavedGeneratedQuestion] = Field(min_length=1, max_length=5)
    remaining_today: int = Field(ge=0, le=10)


class RecordQuestionAttemptRequest(BaseModel):
    learner_id: UUID
    grade_id: str = Field(pattern=r"^grade-[4-9]$")
    subject: str = Field(
        pattern=(
            r"^(Mathematics|English|Kiswahili|Science and Technology|"
            r"Integrated Science|Agriculture|Christian Religious Education|"
            r"Pre-Technical Studies|Creative Arts and Sports|Social Studies)$"
        )
    )
    source: Literal["bank", "generated"]
    question_key: str = Field(min_length=6, max_length=64)
    is_correct: bool

    @field_validator("subject")
    @classmethod
    def subject_must_be_available_for_grade(cls, value: str, info: ValidationInfo) -> str:
        grade_id = info.data.get("grade_id")
        subjects = (
            UPPER_PRIMARY_PRACTICE_SUBJECTS
            if grade_id in {"grade-4", "grade-5", "grade-6"}
            else JUNIOR_PRACTICE_SUBJECTS
        )
        if value not in subjects:
            raise ValueError("Subject is not available for this grade.")
        return value

    @field_validator("question_key")
    @classmethod
    def question_key_must_match_source(cls, value: str, info: ValidationInfo) -> str:
        source = info.data.get("source")
        grade_id = info.data.get("grade_id")
        if source == "generated" and grade_id in {"grade-4", "grade-5", "grade-6"}:
            raise ValueError("Generated questions are only available for Junior School.")
        if source == "bank" and re.fullmatch(r"bank-[0-9]", value) is None:
            raise ValueError("Bank question identifier is invalid.")
        if source == "generated" and not value.startswith("generated:"):
            raise ValueError("Generated question identifier is invalid.")
        return value


class QuestionAttemptResponse(BaseModel):
    message: str


class QuestionProgressResponse(BaseModel):
    learner_id: UUID
    grade_id: str
    subject: str
    answered_bank_question_keys: list[str]
    bank_completed: bool
    bank_correct_answers: int
    total_correct_answers: int
    total_answered: int
    pending_generated_questions: list[SavedGeneratedQuestion]
    remaining_today: int = Field(ge=0, le=10)


class SubjectProgressSummary(BaseModel):
    grade_id: str
    subject: str
    total_answered: int
    total_correct_answers: int
    accuracy_percentage: int
    bank_questions_answered: int
    bank_completed: bool
    last_activity_at: datetime


class LearnerProgressSummaryResponse(BaseModel):
    learner_id: UUID
    total_answered: int
    total_correct_answers: int
    accuracy_percentage: int
    subjects_practised: int
    last_activity_at: datetime | None
    subjects: list[SubjectProgressSummary]
