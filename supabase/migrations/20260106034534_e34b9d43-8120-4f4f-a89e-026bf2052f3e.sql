-- Add license_id column to license_requests
ALTER TABLE public.license_requests 
ADD COLUMN license_id text UNIQUE;

-- Create index for searching by license_id
CREATE INDEX idx_license_requests_license_id ON public.license_requests(license_id);

-- Create function to generate license ID
CREATE OR REPLACE FUNCTION public.generate_license_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  submission_date text;
  daily_count integer;
  new_license_id text;
BEGIN
  -- Only generate if status is changing to 'submitted' and license_id is null
  IF NEW.status = 'submitted' AND NEW.license_id IS NULL THEN
    -- Get today's date in YYYYMMDD format
    submission_date := to_char(CURRENT_DATE, 'YYYYMMDD');
    
    -- Count existing license IDs for today
    SELECT COUNT(*) + 1 INTO daily_count
    FROM public.license_requests
    WHERE license_id LIKE 'TRL-' || submission_date || '-%';
    
    -- Generate the new license ID
    new_license_id := 'TRL-' || submission_date || '-' || LPAD(daily_count::text, 4, '0');
    
    -- Assign to the new record
    NEW.license_id := new_license_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-generate license_id on submission
CREATE TRIGGER generate_license_id_trigger
BEFORE UPDATE ON public.license_requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.generate_license_id();

-- Also handle direct inserts with submitted status
CREATE TRIGGER generate_license_id_on_insert_trigger
BEFORE INSERT ON public.license_requests
FOR EACH ROW
WHEN (NEW.status = 'submitted')
EXECUTE FUNCTION public.generate_license_id();