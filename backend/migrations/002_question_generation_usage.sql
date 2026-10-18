BEGIN;

CREATE TABLE question_generation_usage (
    guardian_account_id UUID NOT NULL
        REFERENCES guardian_accounts(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    questions_generated INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (guardian_account_id, usage_date),
    CONSTRAINT ck_question_generation_usage_nonnegative
        CHECK (questions_generated >= 0)
);

COMMIT;
