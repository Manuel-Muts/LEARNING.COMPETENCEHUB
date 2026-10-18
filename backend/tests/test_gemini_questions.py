import json
import unittest
from unittest.mock import MagicMock, patch

from pydantic import SecretStr

from app import gemini_questions
from app.gemini_questions import GeminiQuestionGenerationError, generate_questions


class GeminiQuestionGenerationTests(unittest.TestCase):
    def test_generates_and_validates_questions_without_putting_key_in_url(self) -> None:
        response_payload = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": json.dumps(
                                    {
                                        "questions": [
                                            {
                                                "prompt": f"Question {index}?",
                                                "options": ["A", "B", "C", "D"],
                                                "correct_answer_index": index % 4,
                                                "explanation": "This is the answer.",
                                            }
                                            for index in range(5)
                                        ]
                                    }
                                )
                            }
                        ]
                    }
                }
            ]
        }
        response = MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps(
            response_payload
        ).encode()
        with (
            patch.object(gemini_questions.settings, "gemini_api_key", SecretStr("test-key")),
            patch("app.gemini_questions.urlopen", return_value=response) as mocked_urlopen,
        ):
            questions = generate_questions("grade-7", "Mathematics", ["Existing question?"])

        self.assertEqual(len(questions), 5)
        request = mocked_urlopen.call_args.args[0]
        self.assertNotIn("test-key", request.full_url)
        self.assertEqual(request.get_header("X-goog-api-key"), "test-key")
        self.assertIn(
            "Existing question?",
            json.loads(request.data)["contents"][0]["parts"][0]["text"],
        )

    def test_rejects_a_response_with_invalid_question_data(self) -> None:
        response = MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps(
            {"candidates": [{"content": {"parts": [{"text": '{"questions": []}'}]}}]}
        ).encode()
        with (
            patch.object(gemini_questions.settings, "gemini_api_key", SecretStr("test-key")),
            patch("app.gemini_questions.urlopen", return_value=response),
            self.assertLogs("app.gemini_questions", level="ERROR"),
            self.assertRaises(GeminiQuestionGenerationError),
        ):
            generate_questions("grade-7", "Mathematics", [])


if __name__ == "__main__":
    unittest.main()
