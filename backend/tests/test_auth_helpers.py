import unittest

from app.schemas import ChangePasswordRequest, SignupRequest, UpdateLearnerNameRequest
from app.security import hash_password, verify_password
from app.main import DUMMY_PASSWORD_HASH


class AuthHelperTests(unittest.TestCase):
    def test_signup_strips_learner_name(self) -> None:
        payload = SignupRequest(
            learner_name="  Amina Otieno  ",
            guardian_phone="0712345678",
            password="secure-password",
        )
        self.assertEqual(payload.learner_name, "Amina Otieno")

    def test_signup_rejects_blank_learner_name(self) -> None:
        with self.assertRaises(ValueError):
            SignupRequest(
                learner_name="   ",
                guardian_phone="0712345678",
                password="secure-password",
            )

    def test_update_learner_name_strips_whitespace_and_rejects_blank(self) -> None:
        payload = UpdateLearnerNameRequest(display_name="  Amina Otieno  ")
        self.assertEqual(payload.display_name, "Amina Otieno")
        with self.assertRaises(ValueError):
            UpdateLearnerNameRequest(display_name="   ")

    def test_change_password_requires_a_new_password_of_at_least_eight_characters(self) -> None:
        payload = ChangePasswordRequest(
            current_password="old-password",
            new_password="new-password",
        )
        self.assertEqual(payload.new_password, "new-password")
        with self.assertRaises(ValueError):
            ChangePasswordRequest(
                current_password="old-password",
                new_password="short",
            )

    def test_password_hash_verifies_only_matching_password(self) -> None:
        stored_hash = hash_password("secure-password")
        self.assertTrue(verify_password("secure-password", stored_hash))
        self.assertFalse(verify_password("different-password", stored_hash))

    def test_precomputed_dummy_hash_is_valid(self) -> None:
        self.assertTrue(verify_password("not-a-real-user-password", DUMMY_PASSWORD_HASH))


if __name__ == "__main__":
    unittest.main()
