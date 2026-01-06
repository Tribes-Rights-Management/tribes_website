-- ============================================================
-- COMPREHENSIVE LICENSING SYSTEM HARDENING
-- Acceptance Criteria A-G Implementation
-- ============================================================

-- ============================================================
-- PART A: ACCESS CONTROL & RLS (Criteria A1-A4)
-- ============================================================

-- Drop ALL existing RLS policies to start fresh with restrictive-only
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT schemaname, tablename, policyname 
            FROM pg_policies 
            WHERE schemaname = 'public') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                   r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Ensure RLS enabled on ALL tables
ALTER TABLE public.license_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS: license_packages (A2, A3, A4)
-- ============================================================

-- Users: SELECT own only
CREATE POLICY "rls_lp_user_select" ON public.license_packages
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() 
    AND public.is_active_user(auth.uid())
    AND NOT public.is_admin_v2(auth.uid())
  );

-- Users: INSERT own only (for drafts via RPC)
CREATE POLICY "rls_lp_user_insert" ON public.license_packages
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() 
    AND public.is_active_user(auth.uid())
  );

-- Users: UPDATE own drafts only
CREATE POLICY "rls_lp_user_update" ON public.license_packages
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() 
    AND public.is_active_user(auth.uid())
    AND status IN ('draft', 'needs_info')
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- Admin view: SELECT all only (A3 - no mutations)
CREATE POLICY "rls_lp_admin_select" ON public.license_packages
  FOR SELECT TO authenticated
  USING (
    public.is_admin_v2(auth.uid()) 
    AND NOT public.is_super_admin_v2(auth.uid())
  );

-- Super Admin: ALL operations
CREATE POLICY "rls_lp_superadmin" ON public.license_packages
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: licenses (A2, A3, A4)
-- ============================================================

-- Users: SELECT own only (via package ownership)
CREATE POLICY "rls_lic_user_select" ON public.licenses
  FOR SELECT TO authenticated
  USING (
    public.is_active_user(auth.uid())
    AND NOT public.is_admin_v2(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.license_packages lp
      WHERE lp.id = licenses.request_id
      AND lp.user_id = auth.uid()
    )
  );

-- Admin view: SELECT all only (no mutations)
CREATE POLICY "rls_lic_admin_select" ON public.licenses
  FOR SELECT TO authenticated
  USING (
    public.is_admin_v2(auth.uid())
    AND NOT public.is_super_admin_v2(auth.uid())
  );

-- Super Admin: ALL operations  
CREATE POLICY "rls_lic_superadmin" ON public.licenses
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: audit_log (A3, A4, G2 - append-only)
-- ============================================================

-- Only super admin can SELECT
CREATE POLICY "rls_audit_superadmin_select" ON public.audit_log
  FOR SELECT TO authenticated
  USING (public.is_super_admin_v2(auth.uid()));

-- Admin view can also SELECT
CREATE POLICY "rls_audit_admin_select" ON public.audit_log
  FOR SELECT TO authenticated
  USING (
    public.is_admin_v2(auth.uid())
    AND NOT public.is_super_admin_v2(auth.uid())
  );

-- Only super admin can INSERT (for logging)
CREATE POLICY "rls_audit_superadmin_insert" ON public.audit_log
  FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- NO UPDATE or DELETE policies for anyone (G2)

-- ============================================================
-- RLS: profiles
-- ============================================================

CREATE POLICY "rls_profiles_user_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "rls_profiles_user_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "rls_profiles_admin_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_profiles_superadmin" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: user_roles
-- ============================================================

CREATE POLICY "rls_roles_user_select_own" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "rls_roles_admin_select" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_roles_superadmin" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: license_types (read-only for users)
-- ============================================================

CREATE POLICY "rls_lt_user_select" ON public.license_types
  FOR SELECT TO authenticated
  USING (public.is_active_user(auth.uid()) AND is_active = true);

CREATE POLICY "rls_lt_admin_select" ON public.license_types
  FOR SELECT TO authenticated
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_lt_superadmin" ON public.license_types
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: clauses
-- ============================================================

CREATE POLICY "rls_clauses_user_select" ON public.clauses
  FOR SELECT TO authenticated
  USING (public.is_active_user(auth.uid()));

CREATE POLICY "rls_clauses_superadmin" ON public.clauses
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: generated_documents
-- ============================================================

CREATE POLICY "rls_docs_user_select" ON public.generated_documents
  FOR SELECT TO authenticated
  USING (
    public.is_active_user(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.license_packages lp
      WHERE lp.id = generated_documents.request_id
      AND lp.user_id = auth.uid()
    )
  );

CREATE POLICY "rls_docs_admin_select" ON public.generated_documents
  FOR SELECT TO authenticated
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_docs_superadmin" ON public.generated_documents
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: internal_notes
-- ============================================================

CREATE POLICY "rls_notes_admin_select" ON public.internal_notes
  FOR SELECT TO authenticated
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_notes_superadmin" ON public.internal_notes
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));

-- ============================================================
-- RLS: status_history
-- ============================================================

CREATE POLICY "rls_history_user_select" ON public.status_history
  FOR SELECT TO authenticated
  USING (
    public.is_active_user(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.license_packages lp
      WHERE lp.id = status_history.request_id
      AND lp.user_id = auth.uid()
    )
  );

CREATE POLICY "rls_history_admin_select" ON public.status_history
  FOR SELECT TO authenticated
  USING (public.is_admin_v2(auth.uid()));

CREATE POLICY "rls_history_superadmin" ON public.status_history
  FOR ALL TO authenticated
  USING (public.is_super_admin_v2(auth.uid()))
  WITH CHECK (public.is_super_admin_v2(auth.uid()));