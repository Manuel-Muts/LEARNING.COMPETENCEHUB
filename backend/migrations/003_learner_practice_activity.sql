BEGIN;

CREATE TABLE learner_question_generation_usage (
    learner_profile_id UUID NOT NULL
        REFERENCES learner_profiles(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL,
    questions_generated INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (learner_profile_id, usage_date),
    CONSTRAINT ck_learner_question_generation_usage_nonnegative
        CHECK (questions_generated >= 0)
);

INSERT INTO learner_question_generation_usage (
    learner_profile_id,
    usage_date,
    questions_generated
)
SELECT
    learner_profiles.id,
    question_generation_usage.usage_date,
    question_generation_usage.questions_generated
FROM question_generation_usage
JOIN learner_profiles
    ON learner_profiles.guardian_account_id = question_generation_usage.guardian_account_id
ON CONFLICT (learner_profile_id, usage_date) DO NOTHING;

CREATE TABLE learner_question_attempts (
    id UUID PRIMARY KEY,
    learner_profile_id UUID NOT NULL
        REFERENCES learner_profiles(id) ON DELETE CASCADE,
    grade_id VARCHAR(32) NOT NULL,
    subject VARCHAR(80) NOT NULL,
    question_key VARCHAR(64) NOT NULL,
    source VARCHAR(16) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ix_learner_question_attempts_learner_profile_id
    ON learner_question_attempts (learner_profile_id);
CREATE INDEX ix_learner_question_attempts_created_at
    ON learner_question_attempts (created_at);

CREATE TABLE generated_practice_questions (
    id UUID PRIMARY KEY,
    learner_profile_id UUID NOT NULL
        REFERENCES learner_profiles(id) ON DELETE CASCADE,
    grade_id VARCHAR(32) NOT NULL,
    subject VARCHAR(80) NOT NULL,
    prompt TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer_index INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_generated_practice_answer_index
        CHECK (correct_answer_index BETWEEN 0 AND 3)
);
CREATE INDEX ix_generated_practice_questions_learner_profile_id
    ON generated_practice_questions (learner_profile_id);
CREATE INDEX ix_generated_practice_questions_created_at
    ON generated_practice_questions (created_at);

COMMIT;
