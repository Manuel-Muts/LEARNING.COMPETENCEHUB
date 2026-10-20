import unittest
from datetime import date
from uuid import uuid4

from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy.dialects import postgresql

from app.main import reserve_question_generation_quota
from app.schemas import (
    GenerateQuestionsRequest,
    GeneratedQuestion,
    RecordQuestionAttemptRequest,
)


class StubDatabaseSession:
    def __init__(self, result: int | None) -> None:
        self.result = result
        self.statement: object | None = None
        self.committed = False
        self.rolled_back = False

    def scalar(self, statement: object) -> int | None:
        if statement is None:
            raise AssertionError("Expected a quota reservation statement.")
        self.statement = statement
        return self.result

    def commit(self) -> None:
        self.committed = True

    def rollback(self) -> None:
        self.rolled_back = True


class QuestionGenerationSchemaTests(unittest.TestCase):
    def test_generation_request_accepts_junior_grade_and_known_subject(self) -> None:
        payload = GenerateQuestionsRequest(
            learner_id=uuid4(),
            grade_id="grade-7",
            subject="Mathematics",
            recent_questions=["What is 2 + 2?"],
        )
        self.assertEqual(payload.grade_id, "grade-7")
        self.assertEqual(payload.subject, "Mathematics")

    def test_generation_request_rejects_unknown_grade_or_subject(self) -> None:
        for payload in (
            {"grade_id": "grade-6", "subject": "Mathematics"},
            {"grade_id": "grade-7", "subject": "Unlisted subject"},
        ):
            with self.subTest(payload=payload), self.assertRaises(ValidationError):
                GenerateQuestionsRequest(**payload)

    def test_generation_request_bounds_recent_question_prompts(self) -> None:
        with self.assertRaises(ValidationError):
            GenerateQuestionsRequest(
                learner_id=uuid4(),
                grade_id="grade-7",
                subject="Mathematics",
                recent_questions=["x" * 501],
            )

    def test_generated_question_requires_valid_answer_index(self) -> None:
        with self.assertRaises(ValidationError):
            GeneratedQuestion(
                prompt="Which number is even?",
                options=["1", "3", "5", "7"],
                correct_answer_index=4,
                explanation="All of these numbers are odd.",
            )

    def test_daily_quota_reserves_one_five_question_generation_batch(self) -> None:
        db = StubDatabaseSession(result=5)

        remaining = reserve_question_generation_quota(db, uuid4(), date(2026, 10, 17))

        self.assertEqual(remaining, 5)
        self.assertIsNotNone(db.statement)
        compiled = str(db.statement.compile(dialect=postgresql.dialect()))
        self.assertIn("ON CONFLICT (learner_profile_id, usage_date)", compiled)
        self.assertTrue(db.committed)
        self.assertFalse(db.rolled_back)

    def test_daily_quota_rejects_requests_after_ten_questions(self) -> None:
        db = StubDatabaseSession(result=None)

        with self.assertRaises(HTTPException) as raised:
            reserve_question_generation_quota(db, uuid4(), date(2026, 10, 17))

        self.assertEqual(raised.exception.status_code, 429)
        self.assertTrue(db.rolled_back)
        self.assertFalse(db.committed)

    def test_question_attempt_key_matches_source(self) -> None:
        payload = RecordQuestionAttemptRequest(
            learner_id=uuid4(),
            grade_id="grade-8",
            subject="English",
            source="bank",
            question_key="bank-9",
            is_correct=True,
        )
        self.assertEqual(payload.question_key, "bank-9")
        with self.assertRaises(ValidationError):
            RecordQuestionAttemptRequest(
                learner_id=uuid4(),
                grade_id="grade-8",
                subject="English",
                source="bank",
                question_key="generated:invalid",
                is_correct=True,
            )

    def test_question_attempt_accepts_upper_primary_practice(self) -> None:
        payload = RecordQuestionAttemptRequest(
            learner_id=uuid4(),
            grade_id="grade-4",
            subject="Science and Technology",
            source="bank",
            question_key="bank-0",
            is_correct=True,
        )
        self.assertEqual(payload.grade_id, "grade-4")
        self.assertEqual(payload.subject, "Science and Technology")

    def test_question_attempt_rejects_subjects_not_taught_in_grade_band(self) -> None:
        with self.assertRaises(ValidationError):
            RecordQuestionAttemptRequest(
                learner_id=uuid4(),
                grade_id="grade-4",
                subject="Agriculture",
                source="bank",
                question_key="bank-0",
                is_correct=True,
            )

    def test_generated_question_attempts_remain_junior_only(self) -> None:
        with self.assertRaises(ValidationError):
            RecordQuestionAttemptRequest(
                learner_id=uuid4(),
                grade_id="grade-6",
                subject="Mathematics",
                source="generated",
                question_key="generated:00000000-0000-0000-0000-000000000001",
                is_correct=True,
            )


if __name__ == "__main__":
    unittest.main()
