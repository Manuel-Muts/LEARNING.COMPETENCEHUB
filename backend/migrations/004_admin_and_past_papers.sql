BEGIN;

CREATE TABLE admin_accounts (
    id UUID PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY,
    admin_account_id UUID NOT NULL REFERENCES admin_accounts(id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);
CREATE INDEX ix_admin_sessions_admin_account_id ON admin_sessions (admin_account_id);
CREATE INDEX ix_admin_sessions_expires_at ON admin_sessions (expires_at);

CREATE TABLE past_paper_documents (
    id UUID PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    grade_id VARCHAR(32) NOT NULL,
    subject VARCHAR(80) NOT NULL,
    year INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2100),
    filename VARCHAR(255) NOT NULL,
    content BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_past_paper_documents_grade_id ON past_paper_documents (grade_id);
CREATE INDEX ix_past_paper_documents_subject ON past_paper_documents (subject);

COMMIT;
