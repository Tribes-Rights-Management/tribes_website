-- =====================================================
-- ORGANIZATION TABLES FOR ENTERPRISE DATA ISOLATION
-- =====================================================

-- Organizations table
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Organization members junction table
CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role text NOT NULL DEFAULT 'member' CHECK (member_role IN ('member', 'manager')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);

-- Enable RLS
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger for organizations
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- HELPER FUNCTION: Check org membership
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_org_access(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    public.is_admin_v2(_user_id)
    OR EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE user_id = _user_id AND org_id = _org_id
    )
$$;

-- =====================================================
-- HELPER FUNCTION: Get user's org IDs
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_org_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.organization_members WHERE user_id = _user_id
$$;

-- =====================================================
-- RLS POLICIES: organizations
-- =====================================================

-- Members can view their own orgs
CREATE POLICY rls_org_member_select ON public.organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members om
      WHERE om.org_id = organizations.id AND om.user_id = auth.uid()
    )
  );

-- Admins can view all orgs
CREATE POLICY rls_org_admin_select ON public.organizations
  FOR SELECT
  USING (is_admin_v2(auth.uid()));

-- Super admins have full CRUD
CREATE POLICY rls_org_superadmin ON public.organizations
  FOR ALL
  USING (is_super_admin_v2(auth.uid()))
  WITH CHECK (is_super_admin_v2(auth.uid()));

-- =====================================================
-- RLS POLICIES: organization_members
-- =====================================================

-- Users can view membership of their own orgs
CREATE POLICY rls_org_members_member_select ON public.organization_members
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.organization_members om2
      WHERE om2.org_id = organization_members.org_id AND om2.user_id = auth.uid()
    )
  );

-- Admins can view all memberships
CREATE POLICY rls_org_members_admin_select ON public.organization_members
  FOR SELECT
  USING (is_admin_v2(auth.uid()));

-- Super admins have full CRUD
CREATE POLICY rls_org_members_superadmin ON public.organization_members
  FOR ALL
  USING (is_super_admin_v2(auth.uid()))
  WITH CHECK (is_super_admin_v2(auth.uid()));

-- =====================================================
-- ADD org_id TO EXISTING TABLES (optional FK)
-- =====================================================

-- Add org_id to license_packages for org-level isolation
ALTER TABLE public.license_packages
  ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

-- Add org_id to contact_submissions for org-level isolation
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

-- =====================================================
-- PREVENT DELETION ON ORGANIZATIONS (legal retention)
-- =====================================================
CREATE TRIGGER trg_prevent_delete_organizations
  BEFORE DELETE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_delete();