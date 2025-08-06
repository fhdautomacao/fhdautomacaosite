-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    contact_person VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_cnpj ON companies(cnpj);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Companies are viewable by authenticated users" ON companies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Companies are insertable by authenticated users" ON companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Companies are updatable by authenticated users" ON companies
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Companies are deletable by authenticated users" ON companies
    FOR DELETE USING (auth.role() = 'authenticated');

-- Add company_id to bills table
ALTER TABLE bills ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- Create index for company_id in bills
CREATE INDEX IF NOT EXISTS idx_bills_company_id ON bills(company_id); 