-- Fix function search_path for any functions missing it
-- This addresses the security linter warning

-- Update get_status_order to have explicit search_path
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
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;