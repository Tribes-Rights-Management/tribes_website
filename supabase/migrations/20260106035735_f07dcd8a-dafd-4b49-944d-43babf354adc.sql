-- Create license_types configuration table
CREATE TABLE public.license_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  pandadoc_template_id text,
  base_fee numeric,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.license_types ENABLE ROW LEVEL SECURITY;

-- Policies: admins can read, super_admin can manage
CREATE POLICY "Admins can view license types"
  ON public.license_types FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Super admin can manage license types"
  ON public.license_types FOR ALL
  USING (is_super_admin(auth.uid()));

-- Add license_type to license_requests
ALTER TABLE public.license_requests
ADD COLUMN IF NOT EXISTS license_type text;

-- Create index for filtering by license_type
CREATE INDEX IF NOT EXISTS idx_license_requests_license_type ON public.license_requests(license_type);

-- Seed initial license types
INSERT INTO public.license_types (code, name, description, sort_order) VALUES
  ('mechanical', 'Mechanical License', 'Standard mechanical license for audio-only reproductions', 1),
  ('dpd', 'DPD License', 'Digital phonorecord delivery license', 2),
  ('sync', 'Sync License', 'Synchronization license for audiovisual works', 3);

-- Add trigger for updated_at on license_types
CREATE TRIGGER update_license_types_updated_at
  BEFORE UPDATE ON public.license_types
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();