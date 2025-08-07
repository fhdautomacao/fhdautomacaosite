-- Adicionar coluna para comprovante de pagamento na tabela de parcelas
ALTER TABLE public.bill_installments 
ADD COLUMN payment_receipt_url text,
ADD COLUMN payment_receipt_filename text,
ADD COLUMN payment_receipt_uploaded_at timestamp with time zone,
ADD COLUMN payment_receipt_uploaded_by uuid REFERENCES auth.users(id);

-- Criar índice para melhor performance na busca por comprovantes
CREATE INDEX idx_bill_installments_receipt ON public.bill_installments(payment_receipt_url) 
WHERE payment_receipt_url IS NOT NULL;

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_bill_installments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_bill_installments_updated_at
  BEFORE UPDATE ON public.bill_installments
  FOR EACH ROW
  EXECUTE FUNCTION update_bill_installments_updated_at();

-- Função para validar se o comprovante é um PDF
CREATE OR REPLACE FUNCTION validate_payment_receipt()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o arquivo é um PDF (baseado na extensão)
  IF NEW.payment_receipt_url IS NOT NULL AND 
     NOT (NEW.payment_receipt_url ILIKE '%.pdf' OR NEW.payment_receipt_url ILIKE '%.PDF') THEN
    RAISE EXCEPTION 'Comprovante deve ser um arquivo PDF';
  END IF;
  
  -- Se há comprovante, deve ter data de upload
  IF NEW.payment_receipt_url IS NOT NULL AND NEW.payment_receipt_uploaded_at IS NULL THEN
    NEW.payment_receipt_uploaded_at = now();
  END IF;
  
  -- Se há comprovante, deve ter usuário que fez upload
  IF NEW.payment_receipt_url IS NOT NULL AND NEW.payment_receipt_uploaded_by IS NULL THEN
    NEW.payment_receipt_uploaded_by = auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar comprovante
CREATE TRIGGER validate_payment_receipt_trigger
  BEFORE INSERT OR UPDATE ON public.bill_installments
  FOR EACH ROW
  EXECUTE FUNCTION validate_payment_receipt();

-- Política RLS para permitir upload de comprovantes
CREATE POLICY "Authenticated users can upload payment receipts" ON public.bill_installments
    FOR UPDATE USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
