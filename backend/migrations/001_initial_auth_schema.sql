BEGIN;

CREATE TABLE guardian_accounts (
    id UUID PRIMARY KEY,
    phone_e164 VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(320) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_guardian_phone_length CHECK (char_length(phone_e164) BETWEEN 12 AND 16)
);
CREATE TABLE learner_profiles (
    id UUID PRIMARY KEY,
    guardian_account_id UUID NOT NULL REFERENCES guardian_accounts(id) ON DELETE CASCADE,
    display_name VARCHAR(120) NOT NULL,
    grade_id VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_learner_display_name CHECK (char_length(display_name) BETWEEN 1 AND 120)
);
CREATE INDEX ix_learner_profiles_guardian_account_id
    ON learner_profiles (guardian_account_id);

CREATE TABLE auth_sessions (
    id UUID PRIMARY KEY,
    guardian_account_id UUID NOT NULL REFERENCES guardian_accounts(id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);
CREATE INDEX ix_auth_sessions_guardian_account_id ON auth_sessions (guardian_account_id);
CREATE INDEX ix_auth_sessions_expires_at ON auth_sessions (expires_at);

CREATE TABLE password_reset_codes (
    id UUID PRIMARY KEY,
    guardian_account_id UUID NOT NULL REFERENCES guardian_accounts(id) ON DELETE CASCADE,
    code_hash CHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consumed_at TIMESTAMPTZ,
    CONSTRAINT ck_password_reset_attempts CHECK (attempts BETWEEN 0 AND 5)
);
CREATE INDEX ix_password_reset_codes_guardian_account_id
    ON password_reset_codes (guardian_account_id);
CREATE INDEX ix_password_reset_codes_expires_at ON password_reset_codes (expires_at);

CREATE TABLE auth_audit_events (
    id UUID PRIMARY KEY,
    guardian_account_id UUID REFERENCES guardian_accounts(id) ON DELETE SET NULL,
    event_type VARCHAR(64) NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_auth_audit_events_guardian_account_id
    ON auth_audit_events (guardian_account_id);

COMMIT;
