import unittest

from app.phone import normalize_kenyan_phone_number


class NormalizeKenyanPhoneNumberTests(unittest.TestCase):
    def test_normalizes_local_number(self) -> None:
        self.assertEqual(normalize_kenyan_phone_number("0712 345 678"), "+254712345678")

    def test_normalizes_country_code_number(self) -> None:
        self.assertEqual(normalize_kenyan_phone_number("+254 712 345 678"), "+254712345678")

    def test_normalizes_nine_digit_number(self) -> None:
        self.assertEqual(normalize_kenyan_phone_number("112345678"), "+254112345678")

    def test_rejects_invalid_length(self) -> None:
        self.assertIsNone(normalize_kenyan_phone_number("071234567"))

    def test_rejects_invalid_mobile_prefix(self) -> None:
        self.assertIsNone(normalize_kenyan_phone_number("212345678"))


if __name__ == "__main__":
    unittest.main()
