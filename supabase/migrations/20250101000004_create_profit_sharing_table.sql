-- Create profit_sharing table for profit division calculations
CREATE TABLE IF NOT EXISTS profit_sharing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    bill_description VARCHAR(500) NOT NULL,
    bill_amount DECIMAL(15,2) NOT NULL,
    expenses DECIMAL(15,2) DEFAULT 0,
    extras DECIMAL(15,2) DEFAULT 0,
    profit DECIMAL(15,2) GENERATED ALWAYS AS (bill_amount - expenses) STORED,
    partner_share DECIMAL(15,2) GENERATED ALWAYS AS ((bill_amount - expenses) / 2) STORED,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    installments INTEGER DEFAULT 1 CHECK (installments > 0),
    installment_interval INTEGER DEFAULT 30 CHECK (installment_interval > 0),
    first_due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profit_sharing_installments table for partner payments
CREATE TABLE IF NOT EXISTS profit_sharing_installments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profit_sharing_id UUID REFERENCES profit_sharing(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
    paid_date DATE,
    payment_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profit_sharing_company_id ON profit_sharing(company_id);
CREATE INDEX IF NOT EXISTS idx_profit_sharing_bill_id ON profit_sharing(bill_id);
CREATE INDEX IF NOT EXISTS idx_profit_sharing_status ON profit_sharing(status);
CREATE INDEX IF NOT EXISTS idx_profit_sharing_created_at ON profit_sharing(created_at);

CREATE INDEX IF NOT EXISTS idx_profit_sharing_installments_profit_sharing_id ON profit_sharing_installments(profit_sharing_id);
CREATE INDEX IF NOT EXISTS idx_profit_sharing_installments_status ON profit_sharing_installments(status);
CREATE INDEX IF NOT EXISTS idx_profit_sharing_installments_due_date ON profit_sharing_installments(due_date);

-- Enable RLS
ALTER TABLE profit_sharing ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_sharing_installments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profit_sharing
CREATE POLICY "Profit sharing are viewable by authenticated users" ON profit_sharing
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing are insertable by authenticated users" ON profit_sharing
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing are updatable by authenticated users" ON profit_sharing
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing are deletable by authenticated users" ON profit_sharing
    FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for profit_sharing_installments
CREATE POLICY "Profit sharing installments are viewable by authenticated users" ON profit_sharing_installments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing installments are insertable by authenticated users" ON profit_sharing_installments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing installments are updatable by authenticated users" ON profit_sharing_installments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing installments are deletable by authenticated users" ON profit_sharing_installments
    FOR DELETE USING (auth.role() = 'authenticated');