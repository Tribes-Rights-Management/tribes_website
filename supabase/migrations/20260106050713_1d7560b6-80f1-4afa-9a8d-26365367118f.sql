-- Fix security definer view issue by dropping and recreating without security definer
DROP VIEW IF EXISTS public.license_packages_with_status;

-- Recreate as a regular view (inherits caller's permissions via RLS)
CREATE VIEW public.license_packages_with_status AS
SELECT 
  lp.*,
  public.get_package_derived_status(lp.id) AS derived_status
FROM public.license_packages lp;