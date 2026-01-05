-- Migrate existing data to new status values
UPDATE public.license_requests SET status = 'awaiting_signature' WHERE status = 'sent_for_signature';
UPDATE public.license_requests SET status = 'done' WHERE status = 'executed';
UPDATE public.license_requests SET status = 'done' WHERE status = 'closed';