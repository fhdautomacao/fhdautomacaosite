-- Criar tabela de orçamentos
CREATE TABLE public.quotations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  email character varying NOT NULL,
  phone character varying,
  company character varying,
  project_type character varying NOT NULL,
  description text NOT NULL,
  budget_range character varying,
  urgency character varying DEFAULT 'normal',
  preferred_contact character varying DEFAULT 'email',
  additional_info text,
  status character varying DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quotations_pkey PRIMARY KEY (id)
);

-- Criar índices para melhor performance
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_quotations_created_at ON public.quotations(created_at);
CREATE INDEX idx_quotations_email ON public.quotations(email);

-- Política RLS para permitir inserção pública
CREATE POLICY "Public can insert quotations" ON public.quotations
    FOR INSERT WITH CHECK (true);

-- Política RLS para permitir leitura apenas para usuários autenticados
CREATE POLICY "Authenticated users can read quotations" ON public.quotations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política RLS para permitir atualização apenas para usuários autenticados
CREATE POLICY "Authenticated users can update quotations" ON public.quotations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política RLS para permitir exclusão apenas para usuários autenticados
CREATE POLICY "Authenticated users can delete quotations" ON public.quotations
    FOR DELETE USING (auth.role() = 'authenticated'); 