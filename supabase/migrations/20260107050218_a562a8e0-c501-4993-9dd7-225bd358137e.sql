-- Add user_agent column to contact_submissions
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS user_agent text;

-- Add the new enum values to existing contact_status enum
ALTER TYPE public.contact_status ADD VALUE IF NOT EXISTS 'follow_up_required';
ALTER TYPE public.contact_status ADD VALUE IF NOT EXISTS 'closed';