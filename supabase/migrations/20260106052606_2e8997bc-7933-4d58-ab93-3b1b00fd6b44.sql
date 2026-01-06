-- ============================================================
-- DATABASE HARDENING MIGRATION
-- Constraints, Triggers, RLS, and RPC Functions
-- ============================================================

-- ============================================================
-- PART A: SCHEMA ADDITIONS
-- ============================================================

-- Add missing columns to license_packages
ALTER TABLE public.license_packages
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

-- Add missing columns to licenses  
ALTER TABLE public.licenses
  ADD COLUMN IF NOT EXISTS signature_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_confirmed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS executed_at timestamptz,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS immutable_lock_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id);

-- ============================================================
-- PART B: CONSTRAINTS
-- ============================================================

-- Unique constraints (may already exist, use IF NOT EXISTS pattern)
DO $$ BEGIN
  ALTER TABLE public.license_packages ADD CONSTRAINT uq_package_reference UNIQUE (package_reference);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE public.licenses ADD CONSTRAINT uq_license_id UNIQUE (license_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- FK constraint with RESTRICT (drop and recreate)
ALTER TABLE public.licenses DROP CONSTRAINT IF EXISTS licenses_request_id_fkey;
ALTER TABLE public.licenses 
  ADD CONSTRAINT licenses_request_id_fkey 
  FOREIGN KEY (request_id) REFERENCES public.license_packages(id) ON DELETE RESTRICT;

-- CHECK: status='Done' requires signature_completed AND payment_confirmed
ALTER TABLE public.licenses DROP CONSTRAINT IF EXISTS chk_done_requires_completion;
ALTER TABLE public.licenses ADD CONSTRAINT chk_done_requires_completion
  CHECK (status <> 'done' OR (signature_completed = true AND payment_confirmed = true));

-- CHECK: executed_at must be set when status='Done'
ALTER TABLE public.licenses DROP CONSTRAINT IF EXISTS chk_done_requires_executed_at;
ALTER TABLE public.licenses ADD CONSTRAINT chk_done_requires_executed_at
  CHECK (status <> 'done' OR executed_at IS NOT NULL);

-- CHECK: paid_at must be set when payment_confirmed=true
ALTER TABLE public.licenses DROP CONSTRAINT IF EXISTS chk_payment_requires_paid_at;
ALTER TABLE public.licenses ADD CONSTRAINT chk_payment_requires_paid_at
  CHECK (payment_confirmed = false OR paid_at IS NOT NULL);

-- NOT NULL on critical fields
ALTER TABLE public.licenses ALTER COLUMN request_id SET NOT NULL;
ALTER TABLE public.licenses ALTER COLUMN license_type_code SET NOT NULL;
ALTER TABLE public.licenses ALTER COLUMN status SET NOT NULL;

-- ============================================================
-- PART C: TRIGGER FUNCTIONS
-- ============================================================

-- 1) Before INSERT on license_packages: set audit fields
CREATE OR REPLACE FUNCTION public.trg_license_packages_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := COALESCE(NEW.created_at, now());
  NEW.updated_at := now();
  NEW.created_by := COALESCE(NEW.created_by, auth.uid());
  NEW.updated_by := auth.uid();
  
  -- Package ID generation handled by existing trigger
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2) Before UPDATE on license_packages: set audit fields
CREATE OR REPLACE FUNCTION public.trg_license_packages_before_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  
  -- Prevent changing package_reference after creation
  IF OLD.package_reference IS NOT NULL AND NEW.package_reference <> OLD.package_reference THEN
    RAISE EXCEPTION 'Package ID is immutable and cannot be changed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3) Before INSERT on licenses: set audit fields and validate
CREATE OR REPLACE FUNCTION public.trg_licenses_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := COALESCE(NEW.created_at, now());
  NEW.updated_at := now();
  NEW.created_by := COALESCE(NEW.created_by, auth.uid());
  NEW.updated_by := auth.uid();
  
  -- license_id generation handled by existing trigger (trg_licenses_auto_id)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4) Before UPDATE on licenses: enforce immutability rules
CREATE OR REPLACE FUNCTION public.trg_licenses_before_update()
RETURNS TRIGGER AS $$
DECLARE
  status_order_old int;
  status_order_new int;
BEGIN
  -- Set audit fields
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  
  -- Prevent ALL changes when immutable_lock_at is set
  IF OLD.immutable_lock_at IS NOT NULL THEN
    RAISE EXCEPTION 'License % is locked and cannot be modified', OLD.license_id;
  END IF;
  
  -- Prevent changing license_id after creation
  IF OLD.license_id IS NOT NULL AND NEW.license_id <> OLD.license_id THEN
    RAISE EXCEPTION 'License ID is immutable and cannot be changed';
  END IF;
  
  -- Prevent changing license_type_code when status >= 'approved'
  IF OLD.license_type_code <> NEW.license_type_code THEN
    SELECT CASE OLD.status
      WHEN 'submitted' THEN 1
      WHEN 'in_review' THEN 2
      WHEN 'needs_info' THEN 3
      WHEN 'approved' THEN 4
      WHEN 'awaiting_signature' THEN 5
      WHEN 'awaiting_payment' THEN 6
      WHEN 'done' THEN 7
      ELSE 0
    END INTO status_order_old;
    
    IF status_order_old >= 4 THEN
      RAISE EXCEPTION 'Cannot change license type after approval';
    END IF;
  END IF;
  
  -- Prevent setting status='done' without required completions (redundant with CHECK but explicit)
  IF NEW.status = 'done' AND (NEW.signature_completed = false OR NEW.payment_confirmed = false) THEN
    RAISE EXCEPTION 'Cannot set status to Done without signature and payment completion';
  END IF;
  
  -- Auto-set executed_at when becoming done
  IF NEW.status = 'done' AND OLD.status <> 'done' AND NEW.executed_at IS NULL THEN
    NEW.executed_at := now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5) After UPDATE on licenses: set immutable_lock_at when done
CREATE OR REPLACE FUNCTION public.trg_licenses_after_update()
RETURNS TRIGGER AS $$
BEGIN
  -- When status transitions to 'done', set immutable_lock_at
  IF NEW.status = 'done' AND OLD.status <> 'done' AND NEW.immutable_lock_at IS NULL THEN
    UPDATE public.licenses 
    SET immutable_lock_at = now()
    WHERE id = NEW.id AND immutable_lock_at IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- PART D: CREATE TRIGGERS
-- ============================================================

-- License packages triggers
DROP TRIGGER IF EXISTS trg_license_packages_audit_insert ON public.license_packages;
CREATE TRIGGER trg_license_packages_audit_insert
  BEFORE INSERT ON public.license_packages
  FOR EACH ROW EXECUTE FUNCTION public.trg_license_packages_before_insert();

DROP TRIGGER IF EXISTS trg_license_packages_audit_update ON public.license_packages;
CREATE TRIGGER trg_license_packages_audit_update
  BEFORE UPDATE ON public.license_packages
  FOR EACH ROW EXECUTE FUNCTION public.trg_license_packages_before_update();

-- Licenses triggers
DROP TRIGGER IF EXISTS trg_licenses_audit_insert ON public.licenses;
CREATE TRIGGER trg_licenses_audit_insert
  BEFORE INSERT ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.trg_licenses_before_insert();

DROP TRIGGER IF EXISTS trg_licenses_immutability ON public.licenses;
CREATE TRIGGER trg_licenses_immutability
  BEFORE UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.trg_licenses_before_update();

DROP TRIGGER IF EXISTS trg_licenses_lock_on_done ON public.licenses;
CREATE TRIGGER trg_licenses_lock_on_done
  AFTER UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.trg_licenses_after_update();

-- ============================================================
-- PART E: RLS POLICIES (Restrictive)
-- ============================================================

-- Drop existing permissive policies on license_packages
DROP POLICY IF EXISTS "Super admin can manage all packages" ON public.license_packages;
DROP POLICY IF EXISTS "Users can view own packages" ON public.license_packages;
DROP POLICY IF EXISTS "Users can create own packages" ON public.license_packages;
DROP POLICY IF EXISTS "Admin view can read all packages" ON public.license_packages;
DROP POLICY IF EXISTS "Users can update own editable packages" ON public.license_packages;

-- New restrictive policies for license_packages
CREATE POLICY "rls_packages_user_select_own"
  ON public.license_packages FOR SELECT
  USING (
    auth.uid() = user_id 
    AND public.is_active_user(auth.uid())
  );

CREATE POLICY "rls_packages_admin_select_all"
  ON public.license_packages FOR SELECT
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_packages_superadmin_all"
  ON public.license_packages FOR ALL
  USING (public.is_super_admin_v2(auth.uid()));

-- Users can insert their own packages (but prefer RPC)
CREATE POLICY "rls_packages_user_insert_own"
  ON public.license_packages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND public.is_active_user(auth.uid())
  );

-- Drop existing policies on licenses
DROP POLICY IF EXISTS "Admins can view all licenses" ON public.licenses;
DROP POLICY IF EXISTS "Super admin can manage all licenses" ON public.licenses;
DROP POLICY IF EXISTS "Users can view own licenses" ON public.licenses;

-- New restrictive policies for licenses
CREATE POLICY "rls_licenses_user_select_own"
  ON public.licenses FOR SELECT
  USING (
    public.is_active_user(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.license_packages lp
      WHERE lp.id = licenses.request_id
      AND lp.user_id = auth.uid()
    )
  );

CREATE POLICY "rls_licenses_admin_select_all"
  ON public.licenses FOR SELECT
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_licenses_superadmin_all"
  ON public.licenses FOR ALL
  USING (public.is_super_admin_v2(auth.uid()));

-- No direct INSERT for users - must use RPC
-- No UPDATE for regular users
-- No DELETE for anyone (except super_admin through ALL policy)

-- ============================================================
-- PART F: RPC FUNCTIONS (Controlled Mutations)
-- ============================================================

-- Helper: Get status order for transition validation
CREATE OR REPLACE FUNCTION public.get_status_order(p_status request_status)
RETURNS int AS $$
BEGIN
  RETURN CASE p_status
    WHEN 'draft' THEN 0
    WHEN 'submitted' THEN 1
    WHEN 'in_review' THEN 2
    WHEN 'needs_info' THEN 3
    WHEN 'approved' THEN 4
    WHEN 'awaiting_signature' THEN 5
    WHEN 'sent_for_signature' THEN 5
    WHEN 'awaiting_payment' THEN 6
    WHEN 'executed' THEN 7
    WHEN 'done' THEN 8
    WHEN 'closed' THEN 9
    ELSE 99
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- RPC: Submit license package (creates package + licenses)
CREATE OR REPLACE FUNCTION public.rpc_submit_license_package_v1(
  p_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_package_id uuid;
  v_package_reference text;
  v_license_ids jsonb := '[]'::jsonb;
  v_license_type text;
  v_license_id uuid;
  v_license_id_human text;
BEGIN
  -- Validate authentication
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Validate user is active
  IF NOT public.is_active_user(v_user_id) THEN
    RAISE EXCEPTION 'Account not active';
  END IF;
  
  -- Create the license package
  INSERT INTO public.license_packages (
    user_id,
    status,
    first_name,
    last_name,
    organization,
    licensee_email,
    address_street,
    address_city,
    address_state,
    address_zip,
    address_country,
    label_master_owner,
    distributor,
    release_date,
    recording_artist,
    release_title,
    product_upc,
    additional_product_info,
    track_title,
    track_artist,
    track_isrc,
    runtime,
    appears_multiple_times,
    times_count,
    additional_track_info,
    selected_license_types,
    agreement_terms,
    agreement_accounting,
    submitted_at,
    created_by
  ) VALUES (
    v_user_id,
    'submitted',
    p_payload->>'first_name',
    p_payload->>'last_name',
    p_payload->>'organization',
    p_payload->>'licensee_email',
    p_payload->>'address_street',
    p_payload->>'address_city',
    p_payload->>'address_state',
    p_payload->>'address_zip',
    COALESCE(p_payload->>'address_country', 'United States'),
    p_payload->>'label_master_owner',
    p_payload->>'distributor',
    (p_payload->>'release_date')::date,
    p_payload->>'recording_artist',
    p_payload->>'release_title',
    p_payload->>'product_upc',
    p_payload->>'additional_product_info',
    p_payload->>'track_title',
    p_payload->>'track_artist',
    p_payload->>'track_isrc',
    p_payload->>'runtime',
    COALESCE((p_payload->>'appears_multiple_times')::boolean, false),
    (p_payload->>'times_count')::int,
    p_payload->>'additional_track_info',
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_payload->'selected_license_types', '[]'::jsonb))),
    COALESCE((p_payload->>'agreement_terms')::boolean, false),
    COALESCE((p_payload->>'agreement_accounting')::boolean, false),
    now(),
    v_user_id
  )
  RETURNING id, package_reference INTO v_package_id, v_package_reference;
  
  -- Create individual licenses for each selected type
  FOR v_license_type IN SELECT jsonb_array_elements_text(COALESCE(p_payload->'selected_license_types', '[]'::jsonb))
  LOOP
    INSERT INTO public.licenses (
      request_id,
      license_type_code,
      status,
      created_by
    ) VALUES (
      v_package_id,
      v_license_type,
      'submitted',
      v_user_id
    )
    RETURNING id, license_id INTO v_license_id, v_license_id_human;
    
    v_license_ids := v_license_ids || jsonb_build_object(
      'id', v_license_id,
      'license_id', v_license_id_human,
      'license_type', v_license_type
    );
  END LOOP;
  
  -- Log to audit
  INSERT INTO public.audit_log (
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    v_user_id,
    'submit_license_package',
    'license_package',
    v_package_id,
    jsonb_build_object(
      'package_reference', v_package_reference,
      'license_count', jsonb_array_length(v_license_ids)
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'package_id', v_package_id,
    'package_reference', v_package_reference,
    'licenses', v_license_ids
  );
END;
$$;

-- RPC: Admin set license status
CREATE OR REPLACE FUNCTION public.rpc_admin_set_license_status_v1(
  p_license_id_human text,
  p_new_status request_status,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_license record;
  v_old_status request_status;
  v_old_order int;
  v_new_order int;
BEGIN
  -- Validate authentication
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Validate admin role
  IF NOT public.is_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;
  
  -- For status changes, require super_admin
  IF NOT public.is_super_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Super admin role required for status changes';
  END IF;
  
  -- Get current license
  SELECT * INTO v_license
  FROM public.licenses
  WHERE license_id = p_license_id_human;
  
  IF v_license IS NULL THEN
    RAISE EXCEPTION 'License not found: %', p_license_id_human;
  END IF;
  
  -- Check immutability
  IF v_license.immutable_lock_at IS NOT NULL THEN
    RAISE EXCEPTION 'License is locked and cannot be modified';
  END IF;
  
  v_old_status := v_license.status;
  v_old_order := public.get_status_order(v_old_status);
  v_new_order := public.get_status_order(p_new_status);
  
  -- Validate status transition (only forward or back to needs_info)
  IF p_new_status = 'needs_info' THEN
    -- Allow going back to needs_info from most states
    IF v_old_order >= public.get_status_order('done') THEN
      RAISE EXCEPTION 'Cannot request info on completed license';
    END IF;
  ELSIF v_new_order <= v_old_order AND p_new_status <> v_old_status THEN
    RAISE EXCEPTION 'Invalid status transition from % to %', v_old_status, p_new_status;
  END IF;
  
  -- Validate done requirements
  IF p_new_status = 'done' THEN
    IF NOT v_license.signature_completed THEN
      RAISE EXCEPTION 'Cannot mark as Done: signature not completed';
    END IF;
    IF NOT v_license.payment_confirmed THEN
      RAISE EXCEPTION 'Cannot mark as Done: payment not confirmed';
    END IF;
  END IF;
  
  -- Update status
  UPDATE public.licenses
  SET 
    status = p_new_status,
    updated_by = v_user_id
  WHERE id = v_license.id;
  
  -- Record in status_history
  INSERT INTO public.status_history (
    request_id,
    license_id,
    from_status,
    to_status,
    actor_user_id,
    notes
  ) VALUES (
    v_license.request_id,
    v_license.id,
    v_old_status,
    p_new_status,
    v_user_id,
    p_notes
  );
  
  -- Audit log
  INSERT INTO public.audit_log (
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    v_user_id,
    'update_license_status',
    'license',
    v_license.id,
    jsonb_build_object(
      'license_id', p_license_id_human,
      'from_status', v_old_status,
      'to_status', p_new_status,
      'notes', p_notes
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'license_id', p_license_id_human,
    'old_status', v_old_status,
    'new_status', p_new_status
  );
END;
$$;

-- RPC: Mark signature complete (system/admin only)
CREATE OR REPLACE FUNCTION public.rpc_mark_signature_complete_v1(
  p_license_id_human text,
  p_signature_event_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_license record;
BEGIN
  v_user_id := auth.uid();
  
  -- Require super_admin for signature marking
  IF v_user_id IS NOT NULL AND NOT public.is_super_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Super admin role required';
  END IF;
  
  -- Get license
  SELECT * INTO v_license
  FROM public.licenses
  WHERE license_id = p_license_id_human;
  
  IF v_license IS NULL THEN
    RAISE EXCEPTION 'License not found: %', p_license_id_human;
  END IF;
  
  IF v_license.immutable_lock_at IS NOT NULL THEN
    RAISE EXCEPTION 'License is locked';
  END IF;
  
  IF v_license.signature_completed THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already marked as signed');
  END IF;
  
  -- Update signature status
  UPDATE public.licenses
  SET 
    signature_completed = true,
    updated_by = v_user_id
  WHERE id = v_license.id;
  
  -- Audit log
  INSERT INTO public.audit_log (
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    COALESCE(v_user_id, '00000000-0000-0000-0000-000000000000'::uuid),
    'mark_signature_complete',
    'license',
    v_license.id,
    jsonb_build_object(
      'license_id', p_license_id_human,
      'signature_event_id', p_signature_event_id
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'license_id', p_license_id_human,
    'signature_completed', true
  );
END;
$$;

-- RPC: Mark payment confirmed (system/admin only)
CREATE OR REPLACE FUNCTION public.rpc_mark_payment_confirmed_v1(
  p_license_id_human text,
  p_payment_intent_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_license record;
BEGIN
  v_user_id := auth.uid();
  
  -- Require super_admin for payment marking
  IF v_user_id IS NOT NULL AND NOT public.is_super_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Super admin role required';
  END IF;
  
  -- Get license
  SELECT * INTO v_license
  FROM public.licenses
  WHERE license_id = p_license_id_human;
  
  IF v_license IS NULL THEN
    RAISE EXCEPTION 'License not found: %', p_license_id_human;
  END IF;
  
  IF v_license.immutable_lock_at IS NOT NULL THEN
    RAISE EXCEPTION 'License is locked';
  END IF;
  
  IF v_license.payment_confirmed THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already marked as paid');
  END IF;
  
  -- Update payment status
  UPDATE public.licenses
  SET 
    payment_confirmed = true,
    paid_at = now(),
    updated_by = v_user_id
  WHERE id = v_license.id;
  
  -- Audit log
  INSERT INTO public.audit_log (
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    COALESCE(v_user_id, '00000000-0000-0000-0000-000000000000'::uuid),
    'mark_payment_confirmed',
    'license',
    v_license.id,
    jsonb_build_object(
      'license_id', p_license_id_human,
      'payment_intent_id', p_payment_intent_id
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'license_id', p_license_id_human,
    'payment_confirmed', true,
    'paid_at', now()
  );
END;
$$;

-- RPC: Complete license (marks as Done after validation)
CREATE OR REPLACE FUNCTION public.rpc_complete_license_v1(
  p_license_id_human text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_license record;
BEGIN
  v_user_id := auth.uid();
  
  IF NOT public.is_super_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Super admin role required';
  END IF;
  
  SELECT * INTO v_license
  FROM public.licenses
  WHERE license_id = p_license_id_human;
  
  IF v_license IS NULL THEN
    RAISE EXCEPTION 'License not found: %', p_license_id_human;
  END IF;
  
  IF v_license.status = 'done' THEN
    RETURN jsonb_build_object('success', true, 'message', 'Already completed');
  END IF;
  
  IF NOT v_license.signature_completed THEN
    RAISE EXCEPTION 'Cannot complete: signature not completed';
  END IF;
  
  IF NOT v_license.payment_confirmed THEN
    RAISE EXCEPTION 'Cannot complete: payment not confirmed';
  END IF;
  
  -- Update to done
  UPDATE public.licenses
  SET 
    status = 'done',
    executed_at = now(),
    updated_by = v_user_id
  WHERE id = v_license.id;
  
  -- Audit log
  INSERT INTO public.audit_log (
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    v_user_id,
    'complete_license',
    'license',
    v_license.id,
    jsonb_build_object('license_id', p_license_id_human)
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'license_id', p_license_id_human,
    'status', 'done',
    'executed_at', now()
  );
END;
$$;

-- Grant execute on RPCs to authenticated users
GRANT EXECUTE ON FUNCTION public.rpc_submit_license_package_v1(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_admin_set_license_status_v1(text, request_status, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_mark_signature_complete_v1(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_mark_payment_confirmed_v1(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_complete_license_v1(text) TO authenticated;