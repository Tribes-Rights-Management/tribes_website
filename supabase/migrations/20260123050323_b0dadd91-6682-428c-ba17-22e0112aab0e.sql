-- ================================================================
-- RLS SECURITY HARDENING MIGRATION
-- Fixes overly permissive policies identified in security audit
-- ================================================================

-- ================================================================
-- 1. FIX: notifications table - INSERT should be service role only
-- The create_notification() function uses SECURITY DEFINER,
-- so we should restrict direct INSERT to authenticated with checks
-- ================================================================
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Allow authenticated users to insert notifications only for themselves as recipient
CREATE POLICY "Users can create own notifications via function"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  recipient_id = auth.uid() 
  OR is_platform_admin(auth.uid())
);

-- ================================================================
-- 2. FIX: searches table - Remove overly permissive UPDATE policy
-- Public users should only insert searches, not update them
-- ================================================================
DROP POLICY IF EXISTS "help__searches_update_public" ON public.searches;

-- Only allow managers to update search records for analytics
CREATE POLICY "Help managers can update searches"
ON public.searches
FOR UPDATE
USING (can_manage_help_content(auth.uid()))
WITH CHECK (can_manage_help_content(auth.uid()));

-- ================================================================
-- 3. FIX: api_access_logs - Add INSERT policy for service role
-- Currently only has SELECT policy, needs INSERT for logging
-- ================================================================
CREATE POLICY "Service role can insert API access logs"
ON public.api_access_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- ================================================================
-- 4. ENHANCEMENT: Add DELETE protection for critical audit tables
-- Ensure audit logs cannot be deleted even by admins (append-only)
-- ================================================================

-- Drop existing problematic policies that might allow DELETE
DROP POLICY IF EXISTS "Platform admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "External auditors can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Tenant admins can view tenant audit logs" ON public.audit_logs;

-- Re-create SELECT policies explicitly (no ALL or DELETE)
CREATE POLICY "Platform admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (is_platform_admin(auth.uid()));

CREATE POLICY "External auditors can view audit logs"
ON public.audit_logs
FOR SELECT
USING (is_external_auditor(auth.uid()));

CREATE POLICY "Tenant admins can view tenant audit logs"
ON public.audit_logs
FOR SELECT
USING (is_tenant_admin(auth.uid(), tenant_id));

-- Explicitly deny DELETE on audit_logs
CREATE POLICY "No deletes allowed on audit logs"
ON public.audit_logs
FOR DELETE
USING (false);

-- ================================================================
-- 5. ENHANCEMENT: Protect access_logs from deletion
-- ================================================================
CREATE POLICY "No deletes allowed on access logs"
ON public.access_logs
FOR DELETE
USING (false);

-- ================================================================
-- 6. FIX: Ensure notification_archive DELETE policy denies correctly
-- ================================================================
DROP POLICY IF EXISTS "No deletes from notification archive" ON public.notification_archive;

CREATE POLICY "No deletes from notification archive"
ON public.notification_archive
FOR DELETE
USING (false);

-- ================================================================
-- 7. FIX: search_query_log - Deny updates and deletes (analytics immutability)
-- ================================================================
CREATE POLICY "No updates on search query log"
ON public.search_query_log
FOR UPDATE
USING (false);

CREATE POLICY "No deletes on search query log"
ON public.search_query_log
FOR DELETE
USING (false);