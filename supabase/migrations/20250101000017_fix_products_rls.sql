-- ========================================
-- CORRIGIR POLÍTICAS RLS DA TABELA PRODUCTS
-- ========================================

-- Verificar políticas atuais da tabela products
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- ========================================
-- REMOVER POLÍTICAS EXISTENTES
-- ========================================
DROP POLICY IF EXISTS "Public products are viewable by everyone." ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products." ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products." ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products." ON public.products;

-- ========================================
-- CRIAR NOVAS POLÍTICAS CORRETAS
-- ========================================

-- Política para SELECT (leitura pública)
CREATE POLICY "Public products are viewable by everyone." ON public.products
    FOR SELECT USING (true);

-- Política para INSERT (apenas usuários autenticados)
CREATE POLICY "Authenticated users can insert products." ON public.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE (apenas usuários autenticados)
CREATE POLICY "Authenticated users can update products." ON public.products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE (apenas usuários autenticados)
CREATE POLICY "Authenticated users can delete products." ON public.products
    FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================
-- Verificar se as políticas foram criadas corretamente
SELECT 
    policyname,
    cmd,
    qual,
    with_check,
    CASE 
        WHEN cmd = 'SELECT' THEN 'Leitura pública'
        WHEN cmd = 'INSERT' THEN 'Inserção autenticada'
        WHEN cmd = 'UPDATE' THEN 'Atualização autenticada'
        WHEN cmd = 'DELETE' THEN 'Exclusão autenticada'
    END as descricao
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
ORDER BY cmd;

-- ========================================
-- COMENTÁRIO EXPLICATIVO
-- ========================================
COMMENT ON TABLE public.products IS 'Tabela de produtos com RLS configurado: leitura pública, modificações apenas para usuários autenticados';
