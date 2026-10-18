BEGIN;

ALTER TABLE past_paper_documents
    ADD COLUMN content_type VARCHAR(127) NOT NULL DEFAULT 'application/pdf',
    ADD COLUMN cloudinary_public_id VARCHAR(255),
    ADD COLUMN cloudinary_url TEXT;

ALTER TABLE past_paper_documents
    ALTER COLUMN content DROP NOT NULL;

UPDATE past_paper_documents
SET content_type = CASE
    WHEN lower(filename) LIKE '%.docx'
        THEN 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    WHEN lower(filename) LIKE '%.doc'
        THEN 'application/msword'
    ELSE 'application/pdf'
END;

COMMIT;
