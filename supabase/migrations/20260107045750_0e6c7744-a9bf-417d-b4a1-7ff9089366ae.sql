-- Create status enum for contact submissions
CREATE TYPE public.contact_status AS ENUM ('new', 'in_review', 'responded', 'archived');

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT NOT NULL,
  status contact_status NOT NULL DEFAULT 'new',
  source_page TEXT NOT NULL DEFAULT 'contact',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID,
  ip_hash TEXT
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_ip_hash ON public.contact_submissions(ip_hash, created_at);

-- RLS Policies
-- Public can insert (for contact form submissions)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Users can view their own submissions if logged in
CREATE POLICY "Users can view own submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() AND NOT is_admin_v2(auth.uid()));

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (is_admin_v2(auth.uid()));

-- Super admins can update submissions
CREATE POLICY "Super admins can update submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (is_super_admin_v2(auth.uid()))
WITH CHECK (is_super_admin_v2(auth.uid()));

-- Prevent deletion (audit trail)
CREATE POLICY "No deletion allowed"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (false);

-- Trigger for updated_at
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Rate limiting function
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(p_ip_hash TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.contact_submissions
    WHERE ip_hash = p_ip_hash
      AND created_at > (now() - INTERVAL '1 minute')
  )
$$;