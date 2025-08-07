-- Adicionar coluna payment_receipt_path que estava faltando
ALTER TABLE public.bill_installments 
ADD COLUMN payment_receipt_path text;

-- Criar índice para melhor performance na busca por comprovantes por caminho
CREATE INDEX idx_bill_installments_receipt_path ON public.bill_installments(payment_receipt_path) 
WHERE payment_receipt_path IS NOT NULL;
