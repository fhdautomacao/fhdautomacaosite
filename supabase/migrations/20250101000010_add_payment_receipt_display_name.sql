-- Adicionar campo para nome descritivo do comprovante
ALTER TABLE bill_installments 
ADD COLUMN payment_receipt_display_name TEXT;

-- Comentário sobre o campo
COMMENT ON COLUMN bill_installments.payment_receipt_display_name IS 'Nome descritivo do arquivo de comprovante para exibição';
