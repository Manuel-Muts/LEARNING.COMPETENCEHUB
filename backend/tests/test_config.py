import unittest

from pydantic import ValidationError

from app.config import Settings


class SettingsTests(unittest.TestCase):
    def make_settings(self, **overrides: object) -> Settings:
        values: dict[str, object] = {
            "bb_connection": "pgsql",
            "db_host": "db.example.test",
            "db_port": 5432,
            "db_database": "learner",
            "db_username": "user@tenant",
            "db_password": "pass/word",
            "auth_secret_key": "unit-test-secret",
            "_env_file": None,
        }
        values.update(overrides)
        return Settings(**values)

    def test_database_url_uses_separate_postgres_settings(self) -> None:
        url = self.make_settings().database_url
        self.assertEqual(url.drivername, "postgresql+psycopg")
        self.assertEqual(url.host, "db.example.test")
        self.assertEqual(url.port, 5432)
        self.assertEqual(url.database, "learner")
        self.assertEqual(url.username, "user@tenant")
        self.assertEqual(url.password, "pass/word")

    def test_rejects_non_postgres_connection_type(self) -> None:
        with self.assertRaises(ValidationError):
            self.make_settings(bb_connection="mysql")

    def test_gemini_api_key_is_optional_and_secret(self) -> None:
        settings = self.make_settings(gemini_api_key="test-gemini-key")
        self.assertEqual(settings.gemini_api_key.get_secret_value(), "test-gemini-key")
        self.assertEqual(str(settings.gemini_api_key), "**********")
        self.assertIsNone(self.make_settings().gemini_api_key)

    def test_talksasa_base_url_has_a_secure_default(self) -> None:
        self.assertEqual(
            self.make_settings().talksasa_base_url,
            "https://bulksms.talksasa.com",
        )


if __name__ == "__main__":
    unittest.main()
