-- Corrigir o trigger para não usar auth.uid() quando payment_receipt_uploaded_by já está definido
DROP TRIGGER IF EXISTS validate_payment_receipt_trigger ON public.bill_installments;

-- Função corrigida para validar se o comprovante é um PDF
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
  
  -- Se há comprovante e não tem usuário definido, tentar usar auth.uid() (apenas se disponível)
  IF NEW.payment_receipt_url IS NOT NULL AND NEW.payment_receipt_uploaded_by IS NULL THEN
    BEGIN
      NEW.payment_receipt_uploaded_by = auth.uid();
    EXCEPTION
      WHEN OTHERS THEN
        -- Se auth.uid() não estiver disponível, deixar como NULL
        NULL;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recriar o trigger
CREATE TRIGGER validate_payment_receipt_trigger
  BEFORE INSERT OR UPDATE ON public.bill_installments
  FOR EACH ROW
  EXECUTE FUNCTION validate_payment_receipt();
