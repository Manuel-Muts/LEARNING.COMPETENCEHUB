from pathlib import Path

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL


class Settings(BaseSettings):
    bb_connection: str
    db_host: str
    db_port: int
    db_database: str
    db_username: str
    db_password: SecretStr
    auth_secret_key: SecretStr
    auth_session_cookie: str = "competencehub_session"
    auth_session_ttl_hours: int = 24
    auth_cookie_secure: bool = False
    auth_cookie_samesite: str = "lax"
    auth_cookie_domain: str | None = None
    cors_origins: str = "http://localhost:3000"
    sms_provider: str = "disabled"
    talksasa_api_key: SecretStr | None = None
    talksasa_sender_id: str | None = None
    talksasa_base_url: str = "https://bulksms.talksasa.com"
    gemini_api_key: SecretStr | None = None
    gemini_model: str = "gemini-2.5-flash"

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("bb_connection")
    @classmethod
    def normalize_database_driver(cls, value: str) -> str:
        driver = value.strip().lower()
        if driver in {"pgsql", "postgres", "postgresql", "postgresql+psycopg"}:
            return "postgresql+psycopg"
        raise ValueError("BB_CONNECTION must identify a PostgreSQL connection.")

    @property
    def database_url(self) -> URL:
        return URL.create(
            drivername=self.bb_connection,
            username=self.db_username,
            password=self.db_password.get_secret_value(),
            host=self.db_host,
            port=self.db_port,
            database=self.db_database,
        )

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
