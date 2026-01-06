-- Create table for policy acknowledgments
CREATE TABLE public.policy_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX idx_policy_acknowledgments_user_version ON public.policy_acknowledgments(user_id, policy_version);

-- Enable RLS
ALTER TABLE public.policy_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own acknowledgments
CREATE POLICY "Users can view own acknowledgments"
ON public.policy_acknowledgments
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own acknowledgments
CREATE POLICY "Users can insert own acknowledgments"
ON public.policy_acknowledgments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all acknowledgments (for audit)
CREATE POLICY "Admins can view all acknowledgments"
ON public.policy_acknowledgments
FOR SELECT
USING (public.is_admin_v2(auth.uid()) OR public.is_super_admin_v2(auth.uid()));

-- Function to check if admin has acknowledged current policy version
CREATE OR REPLACE FUNCTION public.has_acknowledged_policy(
  _user_id UUID,
  _policy_version TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.policy_acknowledgments
    WHERE user_id = _user_id
      AND policy_version = _policy_version
  )
$$;