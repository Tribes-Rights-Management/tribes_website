-- Create account_status enum
CREATE TYPE public.account_status AS ENUM ('pending', 'active', 'rejected');

-- Add account status columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN account_status public.account_status NOT NULL DEFAULT 'pending',
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by UUID;

-- Update existing profiles to be active (don't lock out existing users)
UPDATE public.profiles SET account_status = 'active' WHERE account_status = 'pending';

-- Update the handle_new_user function to set pending status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, account_status)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user',
    'pending'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name);
  RETURN NEW;
END;
$$;

-- Create function to check if user is active
CREATE OR REPLACE FUNCTION public.is_active_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id AND account_status = 'active'
  )
$$;

-- Drop existing license_requests policies that need updating
DROP POLICY IF EXISTS "Users can view own requests" ON public.license_requests;
DROP POLICY IF EXISTS "Users can create own requests" ON public.license_requests;
DROP POLICY IF EXISTS "Users can update own editable requests" ON public.license_requests;

-- Recreate with active user check
CREATE POLICY "Users can view own requests" 
ON public.license_requests 
FOR SELECT 
USING (auth.uid() = user_id AND is_active_user(auth.uid()));

CREATE POLICY "Users can create own requests" 
ON public.license_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND is_active_user(auth.uid()));

CREATE POLICY "Users can update own editable requests" 
ON public.license_requests 
FOR UPDATE 
USING (
  auth.uid() = user_id 
  AND is_active_user(auth.uid())
  AND status IN ('draft', 'needs_info')
);

-- Update generated_documents policy for active users
DROP POLICY IF EXISTS "Users can view own request documents" ON public.generated_documents;
CREATE POLICY "Users can view own request documents" 
ON public.generated_documents 
FOR SELECT 
USING (
  is_active_user(auth.uid()) AND
  EXISTS (
    SELECT 1 FROM license_requests
    WHERE license_requests.id = generated_documents.request_id 
    AND license_requests.user_id = auth.uid()
  )
);

-- Update status_history policy for active users
DROP POLICY IF EXISTS "Users can view own request history" ON public.status_history;
CREATE POLICY "Users can view own request history" 
ON public.status_history 
FOR SELECT 
USING (
  is_active_user(auth.uid()) AND
  EXISTS (
    SELECT 1 FROM license_requests
    WHERE license_requests.id = status_history.request_id 
    AND license_requests.user_id = auth.uid()
  )
);