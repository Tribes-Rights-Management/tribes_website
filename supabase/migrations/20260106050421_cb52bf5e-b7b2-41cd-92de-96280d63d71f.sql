-- =============================================================================
-- SECURITY HARDENING MIGRATION v1
-- =============================================================================
-- This migration:
-- 1. Creates proper user_roles table (separating roles from profiles)
-- 2. Drops legacy triggers safely by name
-- 3. Adds constraints to licenses table
-- 4. Updates RLS policies for proper access control
-- 5. Cleans up legacy functions
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Create user_roles table for proper RBAC separation
-- -----------------------------------------------------------------------------

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Create security definer function to check roles from user_roles table
CREATE OR REPLACE FUNCTION public.has_role_v2(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin (from user_roles)
CREATE OR REPLACE FUNCTION public.is_admin_v2(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin_view')
  )
$$;

-- Create function to check if user is super admin (from user_roles)
CREATE OR REPLACE FUNCTION public.is_super_admin_v2(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = 'super_admin'
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Super admin can manage all roles"
ON public.user_roles FOR ALL
USING (is_super_admin_v2(auth.uid()));

-- -----------------------------------------------------------------------------
-- STEP 2: Drop legacy triggers on license_requests safely (by name, no CASCADE)
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS generate_license_id_on_insert_trigger ON public.license_requests;
DROP TRIGGER IF EXISTS generate_license_id_trigger ON public.license_requests;

-- -----------------------------------------------------------------------------
-- STEP 3: Add NOT NULL and CHECK constraints to licenses table
-- -----------------------------------------------------------------------------

-- Make license_id NOT NULL (it should always be set)
ALTER TABLE public.licenses 
ALTER COLUMN license_id SET NOT NULL;

-- Make license_type_code NOT NULL
ALTER TABLE public.licenses 
ALTER COLUMN license_type_code SET NOT NULL;

-- Make request_id NOT NULL  
ALTER TABLE public.licenses 
ALTER COLUMN request_id SET NOT NULL;

-- Add status CHECK constraint
ALTER TABLE public.licenses 
ADD CONSTRAINT licenses_status_check 
CHECK (status IN ('submitted', 'in_review', 'needs_info', 'approved', 'awaiting_signature', 'awaiting_payment', 'done', 'closed'));

-- -----------------------------------------------------------------------------
-- STEP 4: Update RLS policies for license_types (users need to read for form)
-- -----------------------------------------------------------------------------

-- Allow active users to read license types (for the wizard form)
CREATE POLICY "Active users can view license types"
ON public.license_types FOR SELECT
USING (is_active_user(auth.uid()));

-- -----------------------------------------------------------------------------
-- STEP 5: Create versioned license ID generation function for licenses table
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_license_id_v2()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today_prefix text;
  seq_num integer;
  new_id text;
BEGIN
  today_prefix := 'TRL-' || to_char(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get next sequence number for today
  SELECT COALESCE(MAX(
    CAST(NULLIF(SUBSTRING(license_id FROM '-([0-9]+)$'), '') AS integer)
  ), 0) + 1
  INTO seq_num
  FROM public.licenses
  WHERE license_id LIKE today_prefix || '-%';
  
  -- Generate ID with 4-digit padding
  new_id := today_prefix || '-' || LPAD(seq_num::text, 4, '0');
  
  RETURN new_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- STEP 6: Add trigger for automatic license_id generation on licenses table
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.trg_licenses_generate_id_v2()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate license_id if not provided
  IF NEW.license_id IS NULL OR NEW.license_id = '' THEN
    NEW.license_id := public.generate_license_id_v2();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trg_licenses_auto_id ON public.licenses;
CREATE TRIGGER trg_licenses_auto_id
BEFORE INSERT ON public.licenses
FOR EACH ROW
EXECUTE FUNCTION public.trg_licenses_generate_id_v2();