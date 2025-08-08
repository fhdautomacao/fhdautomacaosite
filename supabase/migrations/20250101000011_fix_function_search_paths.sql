-- Migration para corrigir search_path nas funções do Supabase (VERSÃO CORRIGIDA)
-- Esta migration resolve os avisos de segurança relacionados a funções sem search_path definido

-- 1. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 2. Função para validar recebimentos de pagamento na tabela bill_installments
CREATE OR REPLACE FUNCTION public.validate_payment_receipt()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar formato de arquivo se URL de comprovante for fornecida
    IF NEW.payment_receipt_url IS NOT NULL THEN
        IF NOT (NEW.payment_receipt_url ILIKE '%.pdf' OR NEW.payment_receipt_url ILIKE '%.PDF' OR 
                NEW.payment_receipt_url ILIKE '%.jpg' OR NEW.payment_receipt_url ILIKE '%.JPG' OR
                NEW.payment_receipt_url ILIKE '%.jpeg' OR NEW.payment_receipt_url ILIKE '%.JPEG' OR
                NEW.payment_receipt_url ILIKE '%.png' OR NEW.payment_receipt_url ILIKE '%.PNG') THEN
            RAISE EXCEPTION 'Formato de arquivo não suportado. Use PDF, JPG, JPEG ou PNG';
        END IF;
        
        -- Definir timestamp de upload se não estiver definido
        IF NEW.payment_receipt_uploaded_at IS NULL THEN
            NEW.payment_receipt_uploaded_at = CURRENT_TIMESTAMP;
        END IF;
        
        -- Definir usuário que fez upload se não estiver definido (apenas se autenticado)
        IF NEW.payment_receipt_uploaded_by IS NULL AND auth.uid() IS NOT NULL THEN
            NEW.payment_receipt_uploaded_by = auth.uid();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 3. Função para validar e atualizar parcelas de boletos
CREATE OR REPLACE FUNCTION public.update_bill_installment()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Atualizar campos de auditoria
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- Validar dados obrigatórios
    IF NEW.amount <= 0 THEN
        RAISE EXCEPTION 'Valor deve ser maior que zero';
    END IF;
    
    IF NEW.due_date IS NULL THEN
        RAISE EXCEPTION 'Data de vencimento é obrigatória';
    END IF;
    
    RETURN NEW;
END;
$$;

-- 4. Recriar triggers com as funções atualizadas (apenas se as tabelas existirem)
DO $$ 
BEGIN
    -- Trigger para bills
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bills') THEN
        DROP TRIGGER IF EXISTS update_bills_updated_at ON bills;
        CREATE TRIGGER update_bills_updated_at
            BEFORE UPDATE ON bills
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger para quotations
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quotations') THEN
        DROP TRIGGER IF EXISTS update_quotations_updated_at ON quotations;
        CREATE TRIGGER update_quotations_updated_at
            BEFORE UPDATE ON quotations
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger para companies
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'companies') THEN
        DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
        CREATE TRIGGER update_companies_updated_at
            BEFORE UPDATE ON companies
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger para profit_sharing
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profit_sharing') THEN
        DROP TRIGGER IF EXISTS update_profit_sharing_updated_at ON profit_sharing;
        CREATE TRIGGER update_profit_sharing_updated_at
            BEFORE UPDATE ON profit_sharing
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Trigger para bill_installments (validação e updated_at)
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bill_installments') THEN
        DROP TRIGGER IF EXISTS update_bill_installments_updated_at ON bill_installments;
        CREATE TRIGGER update_bill_installments_updated_at
            BEFORE UPDATE ON bill_installments
            FOR EACH ROW
            EXECUTE FUNCTION update_bill_installment();
            
        -- Trigger para validação de payment receipts
        DROP TRIGGER IF EXISTS validate_payment_receipt_trigger ON bill_installments;
        CREATE TRIGGER validate_payment_receipt_trigger
            BEFORE INSERT OR UPDATE ON bill_installments
            FOR EACH ROW
            WHEN (NEW.payment_receipt_url IS NOT NULL OR NEW.payment_receipt_path IS NOT NULL)
            EXECUTE FUNCTION validate_payment_receipt();
    END IF;
END $$;

-- 5. Função de segurança para verificar permissões de usuário
CREATE OR REPLACE FUNCTION public.check_user_permissions(user_email text, required_permission text)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Verificar se é admin
    IF user_email = 'adminfhd@fhd.com' THEN
        RETURN true;
    END IF;
    
    -- Verificar permissões específicas baseadas no email
    CASE required_permission
        WHEN 'read_bills' THEN
            RETURN user_email IN ('adminfhd@fhd.com');
        WHEN 'write_bills' THEN
            RETURN user_email IN ('adminfhd@fhd.com');
        WHEN 'read_quotations' THEN
            RETURN user_email IN ('adminfhd@fhd.com');
        WHEN 'write_quotations' THEN
            RETURN user_email IN ('adminfhd@fhd.com');
        ELSE
            RETURN false;
    END CASE;
END;
$$;

-- 6. Função para log de atividades de segurança
CREATE OR REPLACE FUNCTION public.log_security_activity(
    user_id uuid,
    activity_type text,
    details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Inserir log de atividade apenas se a tabela existir
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'security_logs') THEN
        INSERT INTO security_logs (
            user_id,
            activity_type,
            details,
            created_at,
            ip_address
        ) VALUES (
            user_id,
            activity_type,
            details,
            CURRENT_TIMESTAMP,
            coalesce(current_setting('request.header.x-forwarded-for', true), 'unknown')
        );
    END IF;
END;
$$;

-- Comentários nas funções para documentação
COMMENT ON FUNCTION update_updated_at_column() IS 'Atualiza automaticamente o campo updated_at em triggers';
COMMENT ON FUNCTION validate_payment_receipt() IS 'Valida uploads de comprovantes de pagamento em bill_installments';
COMMENT ON FUNCTION update_bill_installment() IS 'Valida e atualiza parcelas de boletos';
COMMENT ON FUNCTION check_user_permissions(text, text) IS 'Verifica permissões de usuário baseadas no email';
COMMENT ON FUNCTION log_security_activity(uuid, text, jsonb) IS 'Registra atividades de segurança no sistema';