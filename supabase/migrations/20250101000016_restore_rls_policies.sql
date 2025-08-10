-- ========================================
-- REVERTER POLÍTICAS RLS - RESTAURAR SEGURANÇA
-- ========================================

-- ========================================
-- 1. QUOTATIONS TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "quotations_select_policy" ON public.quotations;
DROP POLICY IF EXISTS "quotations_update_policy" ON public.quotations;
DROP POLICY IF EXISTS "quotations_delete_policy" ON public.quotations;

-- Restaurar políticas de segurança
CREATE POLICY "Authenticated users can read quotations" ON public.quotations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update quotations" ON public.quotations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete quotations" ON public.quotations
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 2. BILLS TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "bills_insert_policy" ON public.bills;
DROP POLICY IF EXISTS "bills_select_policy" ON public.bills;
DROP POLICY IF EXISTS "bills_update_policy" ON public.bills;
DROP POLICY IF EXISTS "bills_delete_policy" ON public.bills;

-- Restaurar políticas de segurança
CREATE POLICY "Authenticated users can insert bills" ON public.bills
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read bills" ON public.bills
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update bills" ON public.bills
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete bills" ON public.bills
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 3. BILL_INSTALLMENTS TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "bill_installments_insert_policy" ON public.bill_installments;
DROP POLICY IF EXISTS "bill_installments_select_policy" ON public.bill_installments;
DROP POLICY IF EXISTS "bill_installments_update_policy" ON public.bill_installments;
DROP POLICY IF EXISTS "bill_installments_delete_policy" ON public.bill_installments;

-- Restaurar políticas de segurança
CREATE POLICY "Authenticated users can insert installments" ON public.bill_installments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read installments" ON public.bill_installments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update installments" ON public.bill_installments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete installments" ON public.bill_installments
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload payment receipts" ON public.bill_installments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ========================================
-- 4. COMPANIES TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "companies_select_policy" ON public.companies;
DROP POLICY IF EXISTS "companies_insert_policy" ON public.companies;
DROP POLICY IF EXISTS "companies_update_policy" ON public.companies;
DROP POLICY IF EXISTS "companies_delete_policy" ON public.companies;

-- Restaurar políticas de segurança
CREATE POLICY "Companies are viewable by authenticated users" ON public.companies
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Companies are insertable by authenticated users" ON public.companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Companies are updatable by authenticated users" ON public.companies
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Companies are deletable by authenticated users" ON public.companies
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 5. PROFIT_SHARING TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "profit_sharing_select_policy" ON public.profit_sharing;
DROP POLICY IF EXISTS "profit_sharing_insert_policy" ON public.profit_sharing;
DROP POLICY IF EXISTS "profit_sharing_update_policy" ON public.profit_sharing;
DROP POLICY IF EXISTS "profit_sharing_delete_policy" ON public.profit_sharing;

-- Restaurar políticas de segurança
CREATE POLICY "Profit sharing are viewable by authenticated users" ON public.profit_sharing
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing are insertable by authenticated users" ON public.profit_sharing
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing are updatable by authenticated users" ON public.profit_sharing
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing are deletable by authenticated users" ON public.profit_sharing
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 6. PROFIT_SHARING_INSTALLMENTS TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "profit_sharing_installments_select_policy" ON public.profit_sharing_installments;
DROP POLICY IF EXISTS "profit_sharing_installments_insert_policy" ON public.profit_sharing_installments;
DROP POLICY IF EXISTS "profit_sharing_installments_update_policy" ON public.profit_sharing_installments;
DROP POLICY IF EXISTS "profit_sharing_installments_delete_policy" ON public.profit_sharing_installments;

-- Restaurar políticas de segurança
CREATE POLICY "Profit sharing installments are viewable by authenticated users" ON public.profit_sharing_installments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing installments are insertable by authenticated users" ON public.profit_sharing_installments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing installments are updatable by authenticated users" ON public.profit_sharing_installments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Profit sharing installments are deletable by authenticated users" ON public.profit_sharing_installments
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 7. CATEGORIES TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "categories_insert_policy" ON public.categories;
DROP POLICY IF EXISTS "categories_update_policy" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_policy" ON public.categories;

-- Restaurar políticas de segurança
CREATE POLICY "Enable insert for authenticated users only" ON public.categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 8. COSTS TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "costs_insert_policy" ON public.costs;
DROP POLICY IF EXISTS "costs_select_policy" ON public.costs;
DROP POLICY IF EXISTS "costs_update_policy" ON public.costs;
DROP POLICY IF EXISTS "costs_delete_policy" ON public.costs;

-- Restaurar políticas de segurança
CREATE POLICY "costs_insert_policy" ON public.costs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "costs_select_policy" ON public.costs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "costs_update_policy" ON public.costs
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "costs_delete_policy" ON public.costs
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 9. COST_INSTALLMENTS TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "cost_installments_insert_policy" ON public.cost_installments;
DROP POLICY IF EXISTS "cost_installments_select_policy" ON public.cost_installments;
DROP POLICY IF EXISTS "cost_installments_update_policy" ON public.cost_installments;
DROP POLICY IF EXISTS "cost_installments_delete_policy" ON public.cost_installments;

-- Restaurar políticas de segurança
CREATE POLICY "cost_installments_insert_policy" ON public.cost_installments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "cost_installments_select_policy" ON public.cost_installments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "cost_installments_update_policy" ON public.cost_installments
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "cost_installments_delete_policy" ON public.cost_installments
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- 10. USER_MENU_PREFS TABLE
-- ========================================
-- Remover políticas permissivas
DROP POLICY IF EXISTS "menu_prefs_insert_policy" ON public.user_menu_prefs;
DROP POLICY IF EXISTS "menu_prefs_select_policy" ON public.user_menu_prefs;
DROP POLICY IF EXISTS "menu_prefs_update_policy" ON public.user_menu_prefs;
DROP POLICY IF EXISTS "menu_prefs_delete_policy" ON public.user_menu_prefs;

-- Restaurar políticas de segurança
CREATE POLICY "menu_prefs_insert" ON public.user_menu_prefs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "menu_prefs_select" ON public.user_menu_prefs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "menu_prefs_update" ON public.user_menu_prefs
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "menu_prefs_delete" ON public.user_menu_prefs
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- COMENTÁRIOS EXPLICATIVOS
-- ========================================
COMMENT ON TABLE public.quotations IS 'Tabela de cotações com RLS restaurado para segurança';
COMMENT ON TABLE public.bills IS 'Tabela de boletos com RLS restaurado para segurança';
COMMENT ON TABLE public.bill_installments IS 'Tabela de parcelas com RLS restaurado para segurança';
COMMENT ON TABLE public.companies IS 'Tabela de empresas com RLS restaurado para segurança';
COMMENT ON TABLE public.profit_sharing IS 'Tabela de divisão de lucros com RLS restaurado para segurança';
COMMENT ON TABLE public.profit_sharing_installments IS 'Tabela de parcelas de divisão de lucros com RLS restaurado para segurança';
COMMENT ON TABLE public.categories IS 'Tabela de categorias com RLS restaurado para segurança';
COMMENT ON TABLE public.costs IS 'Tabela de custos com RLS restaurado para segurança';
COMMENT ON TABLE public.cost_installments IS 'Tabela de parcelas de custos com RLS restaurado para segurança';
COMMENT ON TABLE public.user_menu_prefs IS 'Tabela de preferências de menu com RLS restaurado para segurança';

-- ========================================
-- VERIFICAÇÃO DE SEGURANÇA
-- ========================================
-- Verificar se as políticas foram restauradas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
    'quotations', 'bills', 'bill_installments', 'companies', 
    'profit_sharing', 'profit_sharing_installments', 'categories', 
    'costs', 'cost_installments', 'user_menu_prefs'
)
ORDER BY tablename, cmd;
