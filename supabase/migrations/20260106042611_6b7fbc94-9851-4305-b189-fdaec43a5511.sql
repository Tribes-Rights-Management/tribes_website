-- Add notification preferences columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notify_license_status boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_signature_payment boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_admin_announcements boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS last_sign_in_at timestamp with time zone;

-- Add organization settings columns (for admin use)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS org_reply_to_email text,
ADD COLUMN IF NOT EXISTS org_admin_notification_email text;