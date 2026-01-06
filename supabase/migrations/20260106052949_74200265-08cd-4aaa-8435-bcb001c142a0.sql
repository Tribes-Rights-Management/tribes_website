-- ============================================================
-- PART F: Superseding License Workflow RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.rpc_supersede_license_v1(
  p_original_license_id text,
  p_reason text,
  p_new_license_type text DEFAULT NULL  -- Optional: change type in superseding
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_original record;
  v_package record;
  v_new_license_id uuid;
  v_new_license_id_human text;
  v_new_type text;
BEGIN
  -- Validate authentication
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- F3: Only Admin/Super Admin may supersede
  IF NOT public.is_super_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Super admin role required to supersede licenses';
  END IF;
  
  -- Validate reason provided
  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RAISE EXCEPTION 'Supersession reason is required';
  END IF;
  
  -- Get original license
  SELECT * INTO v_original
  FROM public.licenses
  WHERE license_id = p_original_license_id;
  
  IF v_original IS NULL THEN
    RAISE EXCEPTION 'Original license not found: %', p_original_license_id;
  END IF;
  
  -- F1: Only executed (done) licenses can be superseded
  IF v_original.status <> 'done' THEN
    RAISE EXCEPTION 'Only executed licenses can be superseded (current status: %)', v_original.status;
  END IF;
  
  -- Check not already superseded
  IF v_original.is_superseded = true THEN
    RAISE EXCEPTION 'License % has already been superseded', p_original_license_id;
  END IF;
  
  -- Get package for reference
  SELECT * INTO v_package
  FROM public.license_packages
  WHERE id = v_original.request_id;
  
  -- Determine license type for new license
  v_new_type := COALESCE(p_new_license_type, v_original.license_type_code);
  
  -- F2: Create new superseding license
  INSERT INTO public.licenses (
    request_id,
    license_type_code,
    status,
    supersedes_license_id,
    term,
    territory,
    fee,
    grant_of_rights,
    restrictions,
    created_by,
    updated_by
  ) VALUES (
    v_original.request_id,
    v_new_type,
    'submitted',  -- New license starts at submitted
    v_original.id,
    v_original.term,
    v_original.territory,
    v_original.fee,
    v_original.grant_of_rights,
    v_original.restrictions,
    v_user_id,
    v_user_id
  )
  RETURNING id, license_id INTO v_new_license_id, v_new_license_id_human;
  
  -- F2: Mark original as superseded
  UPDATE public.licenses
  SET 
    is_superseded = true,
    superseded_by = v_new_license_id,
    supersession_reason = p_reason,
    superseded_at = now()
  WHERE id = v_original.id;
  
  -- Record in status_history
  INSERT INTO public.status_history (
    request_id,
    license_id,
    from_status,
    to_status,
    actor_user_id,
    notes
  ) VALUES (
    v_original.request_id,
    v_original.id,
    v_original.status,
    v_original.status,  -- Status unchanged
    v_user_id,
    'License superseded by ' || v_new_license_id_human || ': ' || p_reason
  );
  
  -- G1: Audit log
  INSERT INTO public.audit_log (
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    v_user_id,
    'supersede_license',
    'license',
    v_original.id,
    jsonb_build_object(
      'original_license_id', p_original_license_id,
      'new_license_id', v_new_license_id_human,
      'reason', p_reason,
      'package_reference', v_package.package_reference
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'original_license_id', p_original_license_id,
    'new_license_id', v_new_license_id_human,
    'new_license_uuid', v_new_license_id,
    'message', 'New license created. Must complete signature and payment independently.'
  );
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION public.rpc_supersede_license_v1(text, text, text) TO authenticated;

-- ============================================================
-- Enhanced audit logging RPC for all actions (G1)
-- ============================================================

CREATE OR REPLACE FUNCTION public.rpc_log_audit_event_v1(
  p_action text,
  p_target_type text,
  p_target_id uuid,
  p_details jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_audit_id uuid;
BEGIN
  v_user_id := auth.uid();
  
  -- Only super admin can log directly
  IF v_user_id IS NOT NULL AND NOT public.is_super_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Insufficient permissions for audit logging';
  END IF;
  
  INSERT INTO public.audit_log (
    actor_id,
    action,
    target_type,
    target_id,
    details
  ) VALUES (
    COALESCE(v_user_id, '00000000-0000-0000-0000-000000000000'::uuid),
    p_action,
    p_target_type,
    p_target_id,
    p_details
  )
  RETURNING id INTO v_audit_id;
  
  RETURN jsonb_build_object('success', true, 'audit_id', v_audit_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_log_audit_event_v1(text, text, uuid, jsonb) TO authenticated;

-- ============================================================
-- G3: Search audit by License ID or Package ID
-- ============================================================

CREATE OR REPLACE FUNCTION public.rpc_search_audit_log_v1(
  p_license_id text DEFAULT NULL,
  p_package_id text DEFAULT NULL,
  p_limit int DEFAULT 100
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  actor_id uuid,
  action text,
  target_type text,
  target_id uuid,
  details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_package_uuid uuid;
  v_license_uuid uuid;
BEGIN
  v_user_id := auth.uid();
  
  -- Only admins can search audit
  IF NOT public.is_admin_v2(v_user_id) THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;
  
  -- Find package by reference
  IF p_package_id IS NOT NULL THEN
    SELECT lp.id INTO v_package_uuid
    FROM public.license_packages lp
    WHERE lp.package_reference = p_package_id;
  END IF;
  
  -- Find license by ID
  IF p_license_id IS NOT NULL THEN
    SELECT l.id, l.request_id INTO v_license_uuid, v_package_uuid
    FROM public.licenses l
    WHERE l.license_id = p_license_id;
  END IF;
  
  RETURN QUERY
  SELECT 
    a.id,
    a.created_at,
    a.actor_id,
    a.action,
    a.target_type,
    a.target_id,
    a.details
  FROM public.audit_log a
  WHERE 
    (v_package_uuid IS NULL AND v_license_uuid IS NULL)
    OR a.target_id = v_package_uuid
    OR a.target_id = v_license_uuid
    OR (a.details->>'package_reference' = p_package_id)
    OR (a.details->>'license_id' = p_license_id)
    OR (a.details->>'original_license_id' = p_license_id)
    OR (a.details->>'new_license_id' = p_license_id)
  ORDER BY a.created_at DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_search_audit_log_v1(text, text, int) TO authenticated;