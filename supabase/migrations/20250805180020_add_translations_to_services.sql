-- Add translations column to services table for multi-language content
-- Safe to run multiple times due to IF NOT EXISTS

BEGIN;

ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS translations jsonb;

-- Optionally, you can uncomment to set a default empty object
-- ALTER TABLE public.services ALTER COLUMN translations SET DEFAULT '{}'::jsonb;

COMMIT;


