import hashlib
import hmac
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.config import settings
from app.models import AuthSession, GuardianAccount

password_hasher = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_hasher.verify(password, password_hash)


def generate_session_token() -> str:
    return secrets.token_urlsafe(48)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_session(db: Session, account: GuardianAccount) -> tuple[str, AuthSession]:
    token = generate_session_token()
    session = AuthSession(
        guardian_account_id=account.id,
        token_hash=hash_session_token(token),
        expires_at=datetime.now(UTC) + timedelta(hours=settings.auth_session_ttl_hours),
    )
    db.add(session)
    return token, session


def session_code_digest(reset_id: UUID, code: str) -> str:
    secret = settings.auth_secret_key.get_secret_value().encode("utf-8")
    payload = f"{reset_id}:{code}".encode("utf-8")
    return hmac.new(secret, payload, hashlib.sha256).hexdigest()


def get_account_for_token(db: Session, token: str) -> GuardianAccount | None:
    token_hash = hash_session_token(token)
    session = db.scalar(
        select(AuthSession)
        .where(
            AuthSession.token_hash == token_hash,
            AuthSession.revoked_at.is_(None),
            AuthSession.expires_at > datetime.now(UTC),
        )
        .options(selectinload(AuthSession.guardian).selectinload(GuardianAccount.learners))
    )
    if session is None or not session.guardian.is_active:
        return None
    return session.guardian


def token_hash_matches(expected: str, actual: str) -> bool:
    return hmac.compare_digest(expected, actual)
