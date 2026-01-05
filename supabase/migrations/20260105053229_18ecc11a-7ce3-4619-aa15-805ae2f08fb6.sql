-- Add country column for full address requirement
ALTER TABLE public.license_requests
  ADD COLUMN IF NOT EXISTS address_country text DEFAULT 'United States';