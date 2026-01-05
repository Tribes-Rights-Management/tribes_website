-- Add new enum values for the updated workflow
ALTER TYPE public.request_status ADD VALUE IF NOT EXISTS 'awaiting_signature';
ALTER TYPE public.request_status ADD VALUE IF NOT EXISTS 'awaiting_payment';
ALTER TYPE public.request_status ADD VALUE IF NOT EXISTS 'done';