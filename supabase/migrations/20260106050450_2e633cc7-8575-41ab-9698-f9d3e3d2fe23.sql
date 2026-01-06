-- =============================================================================
-- SECURITY HARDENING MIGRATION v2 - Cleanup & Finalization
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Drop legacy function now that triggers are removed
-- -----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.generate_license_id();
DROP FUNCTION IF EXISTS public.generate_individual_license_id();

-- -----------------------------------------------------------------------------
-- STEP 2: Update handle_new_user to also insert into user_roles
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert into profiles
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
  
  -- Also insert default role into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- STEP 3: Create helper function to get user's primary role from user_roles
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role_v2(_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Return highest privilege role (super_admin > admin_view > user)
  SELECT role FROM public.user_roles 
  WHERE user_id = _user_id
  ORDER BY 
    CASE role 
      WHEN 'super_admin' THEN 1 
      WHEN 'admin_view' THEN 2 
      WHEN 'user' THEN 3 
    END
  LIMIT 1
$$;

-- -----------------------------------------------------------------------------
-- STEP 4: Create function to check if user is active (from profiles)
-- This stays the same since account_status is still in profiles
-- -----------------------------------------------------------------------------
-- is_active_user already exists and is correct

-- -----------------------------------------------------------------------------
-- STEP 5: Update profiles RLS to allow reading role from user_roles
-- Add RLS for admins to view user_roles
-- -----------------------------------------------------------------------------
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (is_admin_v2(auth.uid()));