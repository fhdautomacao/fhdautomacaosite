-- Criar tabela de boletos
CREATE TABLE public.bills (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  type character varying NOT NULL CHECK (type IN ('payable', 'receivable')),
  company_name character varying NOT NULL,
  description text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  installments integer NOT NULL DEFAULT 1,
  installment_interval integer NOT NULL DEFAULT 30, -- dias entre parcelas
  first_due_date date NOT NULL,
  status character varying DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT bills_pkey PRIMARY KEY (id)
);

-- Criar tabela de parcelas
CREATE TABLE public.bill_installments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  bill_id uuid NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  installment_number integer NOT NULL,
  due_date date NOT NULL,
  amount decimal(10,2) NOT NULL,
  status character varying DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  paid_date date,
  payment_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bill_installments_pkey PRIMARY KEY (id),
  CONSTRAINT unique_bill_installment UNIQUE (bill_id, installment_number)
);

-- Criar índices para melhor performance
CREATE INDEX idx_bills_type ON public.bills(type);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_bills_company ON public.bills(company_name);
CREATE INDEX idx_bills_due_date ON public.bills(first_due_date);
CREATE INDEX idx_bill_installments_bill_id ON public.bill_installments(bill_id);
CREATE INDEX idx_bill_installments_status ON public.bill_installments(status);
CREATE INDEX idx_bill_installments_due_date ON public.bill_installments(due_date);

-- Política RLS para permitir inserção apenas para usuários autenticados
CREATE POLICY "Authenticated users can insert bills" ON public.bills
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política RLS para permitir leitura apenas para usuários autenticados
CREATE POLICY "Authenticated users can read bills" ON public.bills
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política RLS para permitir atualização apenas para usuários autenticados
CREATE POLICY "Authenticated users can update bills" ON public.bills
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política RLS para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete bills" ON public.bills
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas RLS para parcelas
CREATE POLICY "Authenticated users can insert installments" ON public.bill_installments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read installments" ON public.bill_installments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update installments" ON public.bill_installments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete installments" ON public.bill_installments
    FOR DELETE USING (auth.role() = 'authenticated'); 