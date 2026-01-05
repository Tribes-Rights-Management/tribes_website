-- Add new columns for the multi-step wizard form
ALTER TABLE public.license_requests
  -- Agreement step
  ADD COLUMN IF NOT EXISTS agreement_accounting boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS agreement_terms boolean DEFAULT false,
  
  -- Your Info step
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS organization text,
  ADD COLUMN IF NOT EXISTS address_street text,
  ADD COLUMN IF NOT EXISTS address_city text,
  ADD COLUMN IF NOT EXISTS address_state text,
  ADD COLUMN IF NOT EXISTS address_zip text,
  
  -- Product Details step
  ADD COLUMN IF NOT EXISTS label_master_owner text,
  ADD COLUMN IF NOT EXISTS distributor text,
  ADD COLUMN IF NOT EXISTS release_date date,
  ADD COLUMN IF NOT EXISTS recording_artist text,
  ADD COLUMN IF NOT EXISTS release_title text,
  ADD COLUMN IF NOT EXISTS product_upc text,
  ADD COLUMN IF NOT EXISTS additional_product_info text,
  
  -- Track Details step
  ADD COLUMN IF NOT EXISTS track_title text,
  ADD COLUMN IF NOT EXISTS track_artist text,
  ADD COLUMN IF NOT EXISTS track_isrc text,
  ADD COLUMN IF NOT EXISTS runtime text,
  ADD COLUMN IF NOT EXISTS appears_multiple_times boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS times_count integer,
  ADD COLUMN IF NOT EXISTS additional_track_info text;