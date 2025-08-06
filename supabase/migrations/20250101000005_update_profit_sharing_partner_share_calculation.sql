-- Update the partner_share calculation to include extras
-- Drop the existing generated column and recreate it with the new formula

ALTER TABLE profit_sharing DROP COLUMN IF EXISTS partner_share;

-- Add the partner_share column with the corrected calculation
ALTER TABLE profit_sharing ADD COLUMN partner_share DECIMAL(15,2) GENERATED ALWAYS AS (((bill_amount - expenses) / 2) + extras) STORED;