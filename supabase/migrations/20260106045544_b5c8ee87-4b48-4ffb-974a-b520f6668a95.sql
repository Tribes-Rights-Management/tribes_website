-- First create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create licenses table for individual license grants within a package
CREATE TABLE public.licenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id text NOT NULL UNIQUE,
  request_id uuid NOT NULL REFERENCES public.license_requests(id) ON DELETE CASCADE,
  license_type_code text NOT NULL,
  term text,
  territory text,
  fee numeric,
  grant_of_rights text,
  restrictions text,
  status public.request_status NOT NULL DEFAULT 'submitted'::request_status,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX idx_licenses_request_id ON public.licenses(request_id);
CREATE INDEX idx_licenses_license_id ON public.licenses(license_id);
CREATE INDEX idx_licenses_status ON public.licenses(status);

-- Enable RLS
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own licenses"
ON public.licenses FOR SELECT
USING (
  is_active_user(auth.uid()) AND 
  EXISTS (
    SELECT 1 FROM public.license_requests 
    WHERE license_requests.id = licenses.request_id 
    AND license_requests.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all licenses"
ON public.licenses FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Super admin can manage all licenses"
ON public.licenses FOR ALL
USING (is_super_admin(auth.uid()));

-- Add selected_license_types array to license_requests for multi-select
ALTER TABLE public.license_requests 
ADD COLUMN IF NOT EXISTS selected_license_types text[] DEFAULT '{}';

-- Add package_reference for grouping in exports
ALTER TABLE public.license_requests 
ADD COLUMN IF NOT EXISTS package_reference text;

-- Create trigger for updated_at on licenses
CREATE TRIGGER update_licenses_updated_at
BEFORE UPDATE ON public.licenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a new function for generating license IDs for individual licenses
CREATE OR REPLACE FUNCTION public.generate_individual_license_id()
RETURNS text AS $$
DECLARE
  today_prefix text;
  seq_num integer;
  new_id text;
BEGIN
  today_prefix := 'TRL-' || to_char(CURRENT_DATE, 'YYYYMMDD');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(license_id FROM '-([0-9]+)$') AS integer)
  ), 0) + 1
  INTO seq_num
  FROM public.licenses
  WHERE license_id LIKE today_prefix || '-%';
  
  new_id := today_prefix || '-' || LPAD(seq_num::text, 3, '0');
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;