-- Drop the view that's causing the security linter warning
-- We'll compute derived status in the application instead
DROP VIEW IF EXISTS public.license_packages_with_status;