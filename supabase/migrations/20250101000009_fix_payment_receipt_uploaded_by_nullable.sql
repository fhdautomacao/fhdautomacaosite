-- Tornar a coluna payment_receipt_uploaded_by nullable e remover foreign key constraint
ALTER TABLE public.bill_installments 
DROP CONSTRAINT IF EXISTS bill_installments_payment_receipt_uploaded_by_fkey;

-- Alterar a coluna para permitir NULL
ALTER TABLE public.bill_installments 
ALTER COLUMN payment_receipt_uploaded_by DROP NOT NULL;
