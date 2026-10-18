from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.exc import ProgrammingError

from app.config import settings
from app.db import SessionLocal
from app.models import AdminAccount, AdminSession
from app.security import hash_password


def main() -> None:
    if settings.admin_email is None or settings.admin_password is None:
        raise SystemExit("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before seeding.")

    email = settings.admin_email.strip().lower()
    password = settings.admin_password.get_secret_value()
    if not email or len(password) < 12:
        raise SystemExit("ADMIN_EMAIL must be set and ADMIN_PASSWORD must be at least 12 characters.")

    try:
        with SessionLocal() as db:
            admin = db.scalar(select(AdminAccount).where(AdminAccount.email == email))
            if admin is None:
                admin = AdminAccount(
                    id=uuid4(),
                    email=email,
                    password_hash=hash_password(password),
                )
                db.add(admin)
            else:
                admin.password_hash = hash_password(password)
                admin.is_active = True
                db.query(AdminSession).filter(
                    AdminSession.admin_account_id == admin.id,
                    AdminSession.revoked_at.is_(None),
                ).update({AdminSession.revoked_at: datetime.now(UTC)})
            db.commit()
    except ProgrammingError as error:
        if getattr(error.orig, "sqlstate", None) == "42P01":
            raise SystemExit(
                "Admin tables are missing. Apply backend/migrations/004_admin_and_past_papers.sql "
                "to this database, then run the seed command again."
            ) from error
        raise
    print(f"Admin account seeded for {email}.")


if __name__ == "__main__":
    main()
