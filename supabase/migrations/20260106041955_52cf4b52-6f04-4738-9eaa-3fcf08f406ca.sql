-- Create audit_log table for tracking access-related actions
CREATE TABLE public.audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  actor_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  target_email text,
  details jsonb,
  CONSTRAINT audit_log_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX idx_audit_log_target_id ON public.audit_log(target_id);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);

-- Enable RLS
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Super admin can view audit logs"
ON public.audit_log
FOR SELECT
USING (is_super_admin(auth.uid()));

-- Only super admins can insert audit logs (via edge functions with service role)
CREATE POLICY "Super admin can insert audit logs"
ON public.audit_log
FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));