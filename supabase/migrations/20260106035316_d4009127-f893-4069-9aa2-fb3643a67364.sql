-- Add payment and signature tracking columns to license_requests
ALTER TABLE public.license_requests
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
ADD COLUMN IF NOT EXISTS stripe_charge_id text,
ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS signature_status text DEFAULT 'pending' CHECK (signature_status IN ('pending', 'sent', 'completed', 'declined', 'voided')),
ADD COLUMN IF NOT EXISTS executed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS pandadoc_document_id text,
ADD COLUMN IF NOT EXISTS license_fee numeric;

-- Create index on license_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_license_requests_license_id ON public.license_requests(license_id);

-- Create index on stripe_payment_intent_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_license_requests_stripe_payment_intent ON public.license_requests(stripe_payment_intent_id);

-- Create index on pandadoc_document_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_license_requests_pandadoc_document ON public.license_requests(pandadoc_document_id);