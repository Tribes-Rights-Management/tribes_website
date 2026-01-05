-- Drop existing role-related objects and recreate with 3-role system
DROP FUNCTION IF EXISTS public.has_role CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create new 3-role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin_view', 'user');

-- Update profiles table with role column
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role app_role NOT NULL DEFAULT 'user';

-- Drop old user_roles table (moving role to profiles for simplicity)
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Create helper function to get user role (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = _user_id LIMIT 1
$$;

-- Create helper function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id AND role = _role
  )
$$;

-- Create helper to check if user is any admin (super_admin or admin_view)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id AND role IN ('super_admin', 'admin_view')
  )
$$;

-- Create helper to check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = _user_id AND role = 'super_admin'
  )
$$;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name);
  RETURN NEW;
END;
$$;

-- Drop all existing RLS policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new profiles RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile (except role)" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admin can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Drop all existing RLS policies on license_requests
DROP POLICY IF EXISTS "Users can view own requests" ON public.license_requests;
DROP POLICY IF EXISTS "Users can create own requests" ON public.license_requests;
DROP POLICY IF EXISTS "Users can update own draft requests" ON public.license_requests;
DROP POLICY IF EXISTS "Users can update own needs_info requests" ON public.license_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.license_requests;
DROP POLICY IF EXISTS "Admins can update all requests" ON public.license_requests;

-- Create new license_requests RLS policies
-- Users: SELECT own
CREATE POLICY "Users can view own requests" ON public.license_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Users: INSERT own
CREATE POLICY "Users can create own requests" ON public.license_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users: UPDATE own only when draft or needs_info
CREATE POLICY "Users can update own editable requests" ON public.license_requests
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status IN ('draft', 'needs_info')
  );

-- Admin view: SELECT all (read-only)
CREATE POLICY "Admin view can read all requests" ON public.license_requests
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Super admin: full access
CREATE POLICY "Super admin can manage all requests" ON public.license_requests
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Drop all existing RLS policies on generated_documents  
DROP POLICY IF EXISTS "Users can view documents for own requests" ON public.generated_documents;
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.generated_documents;

-- Create new generated_documents RLS policies
CREATE POLICY "Users can view own request documents" ON public.generated_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.license_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all documents" ON public.generated_documents
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admin can manage all documents" ON public.generated_documents
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Drop all existing RLS policies on status_history
DROP POLICY IF EXISTS "Users can view history for own requests" ON public.status_history;
DROP POLICY IF EXISTS "Admins can view all history" ON public.status_history;
DROP POLICY IF EXISTS "Admins can create history" ON public.status_history;

-- Create new status_history RLS policies
CREATE POLICY "Users can view own request history" ON public.status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.license_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all history" ON public.status_history
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admin can manage history" ON public.status_history
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Drop all existing RLS policies on clauses
DROP POLICY IF EXISTS "Authenticated users can read clauses" ON public.clauses;
DROP POLICY IF EXISTS "Admins can manage clauses" ON public.clauses;

-- Create new clauses RLS policies
CREATE POLICY "All authenticated can read clauses" ON public.clauses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Super admin can manage clauses" ON public.clauses
  FOR ALL USING (public.is_super_admin(auth.uid()));

-- Create internal_notes table for admin-only notes
CREATE TABLE IF NOT EXISTS public.internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.license_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;

-- Internal notes are admin-only
CREATE POLICY "Admins can view all internal notes" ON public.internal_notes
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admin can manage internal notes" ON public.internal_notes
  FOR ALL USING (public.is_super_admin(auth.uid()));