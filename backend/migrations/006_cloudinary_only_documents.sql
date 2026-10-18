BEGIN;

ALTER TABLE past_paper_documents
    ALTER COLUMN cloudinary_public_id SET NOT NULL,
    ALTER COLUMN cloudinary_url SET NOT NULL,
    DROP COLUMN content;

COMMIT;
