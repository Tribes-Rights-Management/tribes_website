-- ============================================================
-- PART B-E: Data Model, Status, Export Gating, No-Delete
-- ============================================================

-- ============================================================
-- PART B2/F: Add superseding columns to licenses
-- ============================================================

ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS is_superseded boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS superseded_by uuid REFERENCES public.licenses(id),
  ADD COLUMN IF NOT EXISTS supersedes_license_id uuid REFERENCES public.licenses(id),
  ADD COLUMN IF NOT EXISTS supersession_reason text,
  ADD COLUMN IF NOT EXISTS superseded_at timestamptz;

-- Index for superseding lookups
CREATE INDEX IF NOT EXISTS idx_licenses_superseded_by ON public.licenses(superseded_by) WHERE superseded_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_licenses_supersedes ON public.licenses(supersedes_license_id) WHERE supersedes_license_id IS NOT NULL;

-- ============================================================
-- PART C1: License Type immutability trigger (enhanced)
-- ============================================================

CREATE OR REPLACE FUNCTION public.trg_licenses_enforce_rules()
RETURNS TRIGGER AS $$
DECLARE
  v_status_order int;
BEGIN
  -- Set audit fields
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  
  -- C4: Prevent ALL changes when immutable_lock_at is set
  IF OLD.immutable_lock_at IS NOT NULL THEN
    RAISE EXCEPTION 'License % is locked (executed) and cannot be modified', OLD.license_id;
  END IF;
  
  -- F2: Prevent changes to superseded licenses
  IF OLD.is_superseded = true THEN
    -- Allow only setting superseded_by link
    IF NEW.is_superseded = OLD.is_superseded 
       AND NEW.superseded_by IS DISTINCT FROM OLD.superseded_by THEN
      -- This is allowed - linking to new license
      NULL;
    ELSE
      RAISE EXCEPTION 'License % has been superseded and cannot be modified', OLD.license_id;
    END IF;
  END IF;
  
  -- B2: Prevent changing license_id after creation
  IF OLD.license_id IS NOT NULL AND NEW.license_id <> OLD.license_id THEN
    RAISE EXCEPTION 'License ID is immutable and cannot be changed';
  END IF;
  
  -- C1: Prevent changing license_type_code when status >= 'approved'
  IF OLD.license_type_code <> NEW.license_type_code THEN
    v_status_order := public.get_status_order(OLD.status);
    IF v_status_order >= 4 THEN -- 4 = approved
      RAISE EXCEPTION 'Cannot change license type after approval (status: %)', OLD.status;
    END IF;
  END IF;
  
  -- C2: Prevent setting status='done' without required completions
  IF NEW.status = 'done' AND (NEW.signature_completed = false OR NEW.payment_confirmed = false) THEN
    RAISE EXCEPTION 'Cannot set status to Done: signature_completed=% payment_confirmed=%', 
      NEW.signature_completed, NEW.payment_confirmed;
  END IF;
  
  -- C3: Auto-set executed_at when becoming done
  IF NEW.status = 'done' AND OLD.status <> 'done' AND NEW.executed_at IS NULL THEN
    NEW.executed_at := now();
  END IF;
  
  -- C3: Auto-set paid_at when payment confirmed
  IF NEW.payment_confirmed = true AND OLD.payment_confirmed = false AND NEW.paid_at IS NULL THEN
    NEW.paid_at := now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Replace the old trigger
DROP TRIGGER IF EXISTS trg_licenses_immutability ON public.licenses;
CREATE TRIGGER trg_licenses_enforce_rules
  BEFORE UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.trg_licenses_enforce_rules();

-- ============================================================
-- PART C4: Lock trigger after Done (enhanced)
-- ============================================================

CREATE OR REPLACE FUNCTION public.trg_licenses_lock_after_done()
RETURNS TRIGGER AS $$
BEGIN
  -- When status transitions to 'done', set immutable_lock_at
  IF NEW.status = 'done' AND OLD.status <> 'done' THEN
    UPDATE public.licenses 
    SET immutable_lock_at = now()
    WHERE id = NEW.id AND immutable_lock_at IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_licenses_lock_on_done ON public.licenses;
CREATE TRIGGER trg_licenses_lock_after_done
  AFTER UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.trg_licenses_lock_after_done();

-- ============================================================
-- PART C5: Package status is DERIVED (function already exists, verify)
-- ============================================================

-- Ensure get_package_derived_status exists and is correct
CREATE OR REPLACE FUNCTION public.get_package_derived_status(p_package_id uuid)
RETURNS request_status
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
        AND is_superseded = false  -- Exclude superseded licenses
      ORDER BY public.get_status_order(status) ASC
      LIMIT 1
    ),
    (SELECT status FROM public.license_packages WHERE id = p_package_id)
  )
$$;

-- ============================================================
-- PART D1: Export gating function
-- ============================================================

CREATE OR REPLACE FUNCTION public.can_export_package(p_package_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.licenses 
    WHERE request_id = p_package_id 
      AND is_superseded = false
      AND status <> 'done'
  )
  AND EXISTS (
    SELECT 1 FROM public.licenses 
    WHERE request_id = p_package_id 
      AND is_superseded = false
  )
$$;

-- ============================================================
-- PART E: No-delete triggers (prevent all deletes)
-- ============================================================

CREATE OR REPLACE FUNCTION public.prevent_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Deletion is not permitted on table %', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply to all critical tables
DROP TRIGGER IF EXISTS trg_prevent_delete ON public.license_packages;
CREATE TRIGGER trg_prevent_delete
  BEFORE DELETE ON public.license_packages
  FOR EACH ROW EXECUTE FUNCTION public.prevent_delete();

DROP TRIGGER IF EXISTS trg_prevent_delete ON public.licenses;
CREATE TRIGGER trg_prevent_delete
  BEFORE DELETE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.prevent_delete();

DROP TRIGGER IF EXISTS trg_prevent_delete ON public.audit_log;
CREATE TRIGGER trg_prevent_delete
  BEFORE DELETE ON public.audit_log
  FOR EACH ROW EXECUTE FUNCTION public.prevent_delete();

DROP TRIGGER IF EXISTS trg_prevent_delete ON public.status_history;
CREATE TRIGGER trg_prevent_delete
  BEFORE DELETE ON public.status_history
  FOR EACH ROW EXECUTE FUNCTION public.prevent_delete();

-- ============================================================
-- PART G2: Prevent UPDATE on audit_log
-- ============================================================

CREATE OR REPLACE FUNCTION public.prevent_audit_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Updates are not permitted on audit_log';
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_prevent_update ON public.audit_log;
CREATE TRIGGER trg_prevent_update
  BEFORE UPDATE ON public.audit_log
  FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_update();