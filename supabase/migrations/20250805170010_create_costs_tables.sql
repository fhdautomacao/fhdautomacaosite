-- Tabelas de Custos (fixos e variáveis)
CREATE TABLE IF NOT EXISTS public.costs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind varchar NOT NULL CHECK (kind IN ('fixed','variable')),
  category varchar NULL,
  description text NOT NULL,
  -- Para variável
  total_amount decimal(10,2) NULL,
  installments integer NULL,
  installment_interval integer NULL, -- em dias
  first_due_date date NULL,
  -- Para fixo
  monthly_amount decimal(10,2) NULL,
  due_day integer NULL CHECK (due_day >= 1 AND due_day <= 31),
  start_month date NULL, -- usar dia 1 do mês
  end_month date NULL,
  status varchar DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled')),
  admin_notes text NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid NULL REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.cost_installments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cost_id uuid NOT NULL REFERENCES public.costs(id) ON DELETE CASCADE,
  installment_number integer NOT NULL,
  due_date date NOT NULL,
  amount decimal(10,2) NOT NULL,
  status varchar DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','cancelled')),
  paid_date date NULL,
  payment_notes text NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_cost_installment UNIQUE (cost_id, installment_number)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_costs_kind ON public.costs(kind);
CREATE INDEX IF NOT EXISTS idx_costs_status ON public.costs(status);
CREATE INDEX IF NOT EXISTS idx_costs_category ON public.costs(category);
CREATE INDEX IF NOT EXISTS idx_cost_installments_cost_id ON public.cost_installments(cost_id);
CREATE INDEX IF NOT EXISTS idx_cost_installments_status ON public.cost_installments(status);

-- RLS policies básicas
CREATE POLICY IF NOT EXISTS "Authenticated users can insert costs" ON public.costs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can read costs" ON public.costs
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can update costs" ON public.costs
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete costs" ON public.costs
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated users can insert cost installments" ON public.cost_installments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can read cost installments" ON public.cost_installments
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can update cost installments" ON public.cost_installments
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete cost installments" ON public.cost_installments
    FOR DELETE USING (auth.role() = 'authenticated');


