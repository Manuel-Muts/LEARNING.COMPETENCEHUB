from uuid import UUID
from typing import Literal
import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, ValidationInfo, field_validator


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


class PhoneRequest(BaseModel):
    phone: str = Field(min_length=9, max_length=24)


class PasswordResetRequest(PhoneRequest):
    code: str = Field(pattern=r"^\d{6}$")
    new_password: str = Field(min_length=8, max_length=128)


class LearnerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    display_name: str
    grade_id: str | None


class AccountResponse(BaseModel):
    id: UUID
    phone: str
    email: str | None
    learners: list[LearnerResponse]


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
    grade_id: str = Field(pattern=r"^grade-[789]$")
    subject: str = Field(
        pattern=(
            r"^(Mathematics|English|Kiswahili|Integrated Science|Agriculture|"
            r"Christian Religious Education|Pre-Technical Studies|"
            r"Creative Arts and Sports|Social Studies)$"
        )
    )
    source: Literal["bank", "generated"]
    question_key: str = Field(min_length=6, max_length=64)
    is_correct: bool

    @field_validator("question_key")
    @classmethod
    def question_key_must_match_source(cls, value: str, info: ValidationInfo) -> str:
        source = info.data.get("source")
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
