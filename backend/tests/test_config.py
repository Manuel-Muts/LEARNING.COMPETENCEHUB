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

    def test_admin_seed_credentials_are_optional_and_password_is_secret(self) -> None:
        self.assertIsNone(self.make_settings().admin_email)
        self.assertIsNone(self.make_settings().admin_password)
        settings = self.make_settings(
            admin_email="admin@example.com",
            admin_password="long-test-password",
        )
        self.assertEqual(settings.admin_email, "admin@example.com")
        self.assertEqual(settings.admin_password.get_secret_value(), "long-test-password")
        self.assertEqual(str(settings.admin_password), "**********")

    def test_cloudinary_credentials_are_optional_and_secret(self) -> None:
        settings = self.make_settings(
            cloudinary_cloud_name="test-cloud",
            cloudinary_api_key="test-key",
            cloudinary_api_secret="test-secret",
        )
        self.assertEqual(settings.cloudinary_cloud_name, "test-cloud")
        self.assertEqual(settings.cloudinary_api_key.get_secret_value(), "test-key")
        self.assertEqual(settings.cloudinary_api_secret.get_secret_value(), "test-secret")
        self.assertEqual(settings.cloudinary_folder, "competencehub/past-papers")

    def test_talksasa_base_url_has_a_secure_default(self) -> None:
        self.assertEqual(
            self.make_settings().talksasa_base_url,
            "https://bulksms.talksasa.com",
        )

    def test_default_cors_origins_allow_localhost_and_loopback(self) -> None:
        self.assertEqual(
            Settings.model_fields["cors_origins"].default,
            "http://localhost:3000,http://127.0.0.1:3000",
        )
        self.assertEqual(
            self.make_settings(cors_origins="").allowed_origins,
            ["http://localhost:3000", "http://127.0.0.1:3000"],
        )

    def test_local_origins_remain_allowed_with_production_cors_override(self) -> None:
        settings = self.make_settings(
            cors_origins="https://learning.competencehub.co.ke"
        )
        self.assertEqual(
            settings.allowed_origins,
            [
                "https://learning.competencehub.co.ke",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
            ],
        )


if __name__ == "__main__":
    unittest.main()
