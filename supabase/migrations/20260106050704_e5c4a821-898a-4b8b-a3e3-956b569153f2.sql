-- =============================================================================
-- PER-LICENSE STATUS MODEL MIGRATION
-- =============================================================================
-- This migration:
-- 1. Establishes licenses.status as the source of truth
-- 2. Creates a function to derive package status from child licenses
-- 3. Renames license_requests to license_packages for clarity
-- 4. Updates RLS policies for the new model
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Rename license_requests to license_packages for semantic clarity
-- -----------------------------------------------------------------------------
ALTER TABLE public.license_requests RENAME TO license_packages;

-- Update foreign key references in licenses table
-- (The FK constraint name stays the same, just references renamed table)

-- Rename indexes
ALTER INDEX IF EXISTS license_requests_pkey RENAME TO license_packages_pkey;
ALTER INDEX IF EXISTS license_requests_license_id_key RENAME TO license_packages_license_id_key;

-- Rename triggers
ALTER TRIGGER set_license_requests_updated_at ON public.license_packages 
RENAME TO set_license_packages_updated_at;

-- -----------------------------------------------------------------------------
-- STEP 2: Create function to compute derived package status
-- The "lowest-progress" status across all child licenses
-- Status order: submitted < in_review < needs_info < approved < awaiting_signature < awaiting_payment < done
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_package_derived_status(p_package_id uuid)
RETURNS public.request_status
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT status 
      FROM public.licenses 
      WHERE request_id = p_package_id
      ORDER BY 
        CASE status
          WHEN 'draft' THEN 1
          WHEN 'submitted' THEN 2
          WHEN 'in_review' THEN 3
          WHEN 'needs_info' THEN 4
          WHEN 'approved' THEN 5
          WHEN 'awaiting_signature' THEN 6
          WHEN 'awaiting_payment' THEN 7
          WHEN 'executed' THEN 8
          WHEN 'done' THEN 9
          WHEN 'closed' THEN 10
          ELSE 99
        END ASC
      LIMIT 1
    ),
    -- Fallback to package's own status if no licenses exist yet
    (SELECT status FROM public.license_packages WHERE id = p_package_id)
  )
$$;

-- -----------------------------------------------------------------------------
-- STEP 3: Add package_status as a generated column (computed from licenses)
-- PostgreSQL 12+ supports generated columns
-- -----------------------------------------------------------------------------
-- Note: Generated columns can't call functions that access other tables
-- Instead, we'll use a view or compute in application layer

-- Create a view that includes derived status
CREATE OR REPLACE VIEW public.license_packages_with_status AS
SELECT 
  lp.*,
  public.get_package_derived_status(lp.id) AS derived_status
FROM public.license_packages lp;

-- -----------------------------------------------------------------------------
-- STEP 4: Update RLS policies for renamed table
-- Drop old policies and create new ones with correct table name
-- -----------------------------------------------------------------------------

-- First, drop all existing policies on the renamed table (they still exist)
DROP POLICY IF EXISTS "Admin view can read all requests" ON public.license_packages;
DROP POLICY IF EXISTS "Super admin can manage all requests" ON public.license_packages;
DROP POLICY IF EXISTS "Users can create own requests" ON public.license_packages;
DROP POLICY IF EXISTS "Users can update own editable requests" ON public.license_packages;
DROP POLICY IF EXISTS "Users can view own requests" ON public.license_packages;

-- Recreate policies with correct naming
CREATE POLICY "Admin view can read all packages"
ON public.license_packages FOR SELECT
USING (is_admin_v2(auth.uid()));

CREATE POLICY "Super admin can manage all packages"
ON public.license_packages FOR ALL
USING (is_super_admin_v2(auth.uid()));

CREATE POLICY "Users can view own packages"
ON public.license_packages FOR SELECT
USING ((auth.uid() = user_id) AND is_active_user(auth.uid()));

CREATE POLICY "Users can create own packages"
ON public.license_packages FOR INSERT
WITH CHECK ((auth.uid() = user_id) AND is_active_user(auth.uid()));

CREATE POLICY "Users can update own editable packages"
ON public.license_packages FOR UPDATE
USING (
  (auth.uid() = user_id) AND 
  is_active_user(auth.uid()) AND 
  (status = ANY (ARRAY['draft'::request_status, 'needs_info'::request_status]))
);

-- -----------------------------------------------------------------------------
-- STEP 5: Update licenses RLS to reference renamed table
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own licenses" ON public.licenses;

CREATE POLICY "Users can view own licenses"
ON public.licenses FOR SELECT
USING (
  is_active_user(auth.uid()) AND 
  EXISTS (
    SELECT 1 FROM public.license_packages 
    WHERE license_packages.id = licenses.request_id 
    AND license_packages.user_id = auth.uid()
  )
);

-- -----------------------------------------------------------------------------
-- STEP 6: Update generated_documents RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own request documents" ON public.generated_documents;

CREATE POLICY "Users can view own package documents"
ON public.generated_documents FOR SELECT
USING (
  is_active_user(auth.uid()) AND 
  EXISTS (
    SELECT 1 FROM public.license_packages 
    WHERE license_packages.id = generated_documents.request_id 
    AND license_packages.user_id = auth.uid()
  )
);

-- -----------------------------------------------------------------------------
-- STEP 7: Update status_history RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own request history" ON public.status_history;

CREATE POLICY "Users can view own package history"
ON public.status_history FOR SELECT
USING (
  is_active_user(auth.uid()) AND 
  EXISTS (
    SELECT 1 FROM public.license_packages 
    WHERE license_packages.id = status_history.request_id 
    AND license_packages.user_id = auth.uid()
  )
);

-- -----------------------------------------------------------------------------
-- STEP 8: Update internal_notes to reference packages
-- (Foreign key already references license_requests which is now license_packages)
-- -----------------------------------------------------------------------------
-- No changes needed, FK follows the rename automatically

-- -----------------------------------------------------------------------------
-- STEP 9: Add license_id to status_history for per-license tracking
-- -----------------------------------------------------------------------------
ALTER TABLE public.status_history 
ADD COLUMN IF NOT EXISTS license_id uuid REFERENCES public.licenses(id) ON DELETE CASCADE;

-- Create index for license-level history queries
CREATE INDEX IF NOT EXISTS idx_status_history_license_id ON public.status_history(license_id);