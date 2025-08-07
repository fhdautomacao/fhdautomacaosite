# 🗄️ Banco de Dados

## 📋 Visão Geral

O sistema utiliza **Supabase** como backend, que é baseado em **PostgreSQL** com recursos adicionais como autenticação, storage e real-time.

## 🏗️ Schema do Banco

### **Tabelas Principais**

#### **users** - Usuários do Sistema
```sql
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  role character varying DEFAULT 'user',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
```

#### **bills** - Boletos
```sql
CREATE TABLE public.bills (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id),
  company_id uuid REFERENCES public.companies(id),
  client_id uuid REFERENCES public.clients(id),
  bill_number character varying NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status character varying DEFAULT 'pending',
  due_date date,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bills_pkey PRIMARY KEY (id)
);
```

#### **bill_installments** - Parcelas dos Boletos
```sql
CREATE TABLE public.bill_installments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  bill_id uuid REFERENCES public.bills(id) ON DELETE CASCADE,
  installment_number integer NOT NULL,
  amount decimal(10,2) NOT NULL,
  due_date date NOT NULL,
  status character varying DEFAULT 'pending',
  payment_receipt_url text,
  payment_receipt_filename character varying,
  payment_receipt_path text,
  payment_receipt_uploaded_at timestamp with time zone,
  payment_receipt_uploaded_by uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bill_installments_pkey PRIMARY KEY (id)
);
```

#### **quotations** - Cotações
```sql
CREATE TABLE public.quotations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id),
  client_id uuid REFERENCES public.clients(id),
  quotation_number character varying NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  status character varying DEFAULT 'pending',
  valid_until date,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quotations_pkey PRIMARY KEY (id)
);
```

#### **clients** - Clientes
```sql
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  email character varying,
  phone character varying,
  company_id uuid REFERENCES public.companies(id),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);
```

#### **companies** - Empresas
```sql
CREATE TABLE public.companies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  cnpj character varying,
  address text,
  phone character varying,
  email character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id)
);
```

### **Tabelas de Conteúdo**

#### **products** - Produtos
```sql
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  category_id uuid REFERENCES public.categories(id),
  price decimal(10,2),
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
```

#### **services** - Serviços
```sql
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  category_id uuid REFERENCES public.categories(id),
  price decimal(10,2),
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);
```

#### **categories** - Categorias
```sql
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  icon character varying,
  color character varying,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
```

### **Tabelas de Conteúdo do Site**

#### **hero_content** - Conteúdo da Página Inicial
```sql
CREATE TABLE public.hero_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  subtitle character varying,
  description text,
  cta_text character varying,
  cta_link character varying,
  background_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT hero_content_pkey PRIMARY KEY (id)
);
```

#### **about_content** - Sobre a Empresa
```sql
CREATE TABLE public.about_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  subtitle character varying,
  description text,
  mission text,
  vision text,
  values jsonb,
  team_description text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT about_content_pkey PRIMARY KEY (id)
);
```

#### **contact_info** - Informações de Contato
```sql
CREATE TABLE public.contact_info (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  phone character varying,
  email character varying,
  address text,
  working_hours text,
  emergency_phone character varying,
  whatsapp character varying,
  social_media jsonb,
  map_embed_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_info_pkey PRIMARY KEY (id)
);
```

#### **gallery_items** - Galeria
```sql
CREATE TABLE public.gallery_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  category character varying,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_items_pkey PRIMARY KEY (id)
);
```

#### **testimonials** - Depoimentos
```sql
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  client_name character varying NOT NULL,
  company_name character varying,
  testimonial text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);
```

#### **seo_settings** - Configurações SEO
```sql
CREATE TABLE public.seo_settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  page_name character varying NOT NULL,
  title character varying,
  description text,
  keywords text,
  og_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT seo_settings_pkey PRIMARY KEY (id)
);
```

## 🔗 Relacionamentos

### **Diagrama ER**
```
users (1) ──── (N) bills
users (1) ──── (N) quotations

companies (1) ──── (N) clients
companies (1) ──── (N) bills

clients (1) ──── (N) bills
clients (1) ──── (N) quotations

bills (1) ──── (N) bill_installments

categories (1) ──── (N) products
categories (1) ──── (N) services
```

## 🔐 Row Level Security (RLS)

### **Políticas de Segurança**

#### **users**
```sql
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

#### **bills**
```sql
-- Usuários podem ver boletos de suas empresas
CREATE POLICY "Users can view company bills" ON bills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = bills.user_id 
      AND users.id = auth.uid()
    )
  );
```

#### **bill_installments**
```sql
-- Usuários podem gerenciar parcelas dos seus boletos
CREATE POLICY "Users can manage own bill installments" ON bill_installments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bills 
      WHERE bills.id = bill_installments.bill_id 
      AND bills.user_id = auth.uid()
    )
  );
```

## 📊 Índices

### **Índices de Performance**
```sql
-- Índices para busca rápida
CREATE INDEX idx_bills_user_id ON bills(user_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_due_date ON bills(due_date);

CREATE INDEX idx_bill_installments_bill_id ON bill_installments(bill_id);
CREATE INDEX idx_bill_installments_status ON bill_installments(status);
CREATE INDEX idx_bill_installments_due_date ON bill_installments(due_date);

CREATE INDEX idx_quotations_user_id ON quotations(user_id);
CREATE INDEX idx_quotations_status ON quotations(status);

CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_clients_name ON clients(name);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_services_category_id ON services(category_id);
```

## 🔄 Migrações

### **Estrutura de Migrações**
```
supabase/migrations/
├── 20250101000001_create_quotations_table.sql
├── 20250101000002_create_bills_table.sql
├── 20250101000003_create_companies_table.sql
├── 20250101000004_create_profit_sharing_table.sql
├── 20250101000005_update_profit_sharing_partner_share_calculation.sql
├── 20250101000006_add_payment_receipts_to_bills.sql
├── 20250101000007_add_payment_receipt_path.sql
├── 20250101000008_fix_payment_receipt_trigger.sql
├── 20250101000009_fix_payment_receipt_uploaded_by_nullable.sql
└── 20250805160000_create_categories_table.sql
```

### **Executar Migrações**
```bash
# Desenvolvimento local
supabase db reset

# Produção
supabase db push
```

## 📈 Backup e Recuperação

### **Backup Automático**
- Supabase realiza backup automático diário
- Retenção de 7 dias para backups automáticos
- Backup manual disponível no dashboard

### **Recuperação**
```bash
# Restaurar backup
supabase db restore --backup-id <backup_id>

# Restaurar migrações
supabase db reset
```

## 🔍 Queries Comuns

### **Boletos Vencidos**
```sql
SELECT 
  b.bill_number,
  b.total_amount,
  b.due_date,
  c.name as client_name
FROM bills b
JOIN clients c ON b.client_id = c.id
WHERE b.due_date < CURRENT_DATE
AND b.status = 'pending';
```

### **Relatório de Vendas**
```sql
SELECT 
  DATE_TRUNC('month', b.created_at) as month,
  COUNT(*) as total_bills,
  SUM(b.total_amount) as total_revenue
FROM bills b
WHERE b.status = 'paid'
GROUP BY month
ORDER BY month DESC;
```

### **Clientes Mais Ativos**
```sql
SELECT 
  c.name,
  COUNT(b.id) as total_bills,
  SUM(b.total_amount) as total_spent
FROM clients c
LEFT JOIN bills b ON c.id = b.client_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC
LIMIT 10;
```

## 🛠️ Manutenção

### **Limpeza de Dados**
```sql
-- Remover boletos antigos (mais de 2 anos)
DELETE FROM bills 
WHERE created_at < CURRENT_DATE - INTERVAL '2 years'
AND status = 'cancelled';

-- Limpar arquivos órfãos
DELETE FROM storage.objects 
WHERE bucket_id = 'receipts' 
AND created_at < CURRENT_DATE - INTERVAL '1 year';
```

### **Otimização**
```sql
-- Analisar tabelas
ANALYZE bills;
ANALYZE bill_installments;
ANALYZE quotations;

-- Vacuum (limpeza)
VACUUM bills;
VACUUM bill_installments;
VACUUM quotations;
```

---

**Próximo**: [Autenticação e Segurança](./autenticacao-seguranca.md)
