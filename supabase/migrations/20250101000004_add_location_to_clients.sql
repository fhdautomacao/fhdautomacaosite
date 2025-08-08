-- Add location fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS state VARCHAR(2);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS zip_code VARCHAR(15);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create indexes for location fields
CREATE INDEX IF NOT EXISTS idx_clients_city ON clients(city);
CREATE INDEX IF NOT EXISTS idx_clients_state ON clients(state);
CREATE INDEX IF NOT EXISTS idx_clients_industry ON clients(industry);
CREATE INDEX IF NOT EXISTS idx_clients_display_order ON clients(display_order);

-- Create spatial index for coordinates (if using PostGIS)
-- CREATE INDEX IF NOT EXISTS idx_clients_location ON clients USING GIST (ST_Point(longitude, latitude));
