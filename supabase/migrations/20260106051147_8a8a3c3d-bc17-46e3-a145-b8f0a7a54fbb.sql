-- Create function to generate Package ID
CREATE OR REPLACE FUNCTION public.generate_package_id()
RETURNS TEXT AS $$
DECLARE
  today_str TEXT;
  seq_num INT;
  new_id TEXT;
BEGIN
  today_str := to_char(CURRENT_DATE, 'YYYYMMDD');
  
  -- Get the next sequence number for today
  SELECT COALESCE(MAX(
    CASE 
      WHEN package_reference ~ ('^PKG-' || today_str || '-[0-9]{4}$') 
      THEN CAST(RIGHT(package_reference, 4) AS INT)
      ELSE 0 
    END
  ), 0) + 1
  INTO seq_num
  FROM public.license_packages
  WHERE package_reference LIKE 'PKG-' || today_str || '-%';
  
  new_id := 'PKG-' || today_str || '-' || LPAD(seq_num::TEXT, 4, '0');
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Create trigger function for auto-generating Package ID
CREATE OR REPLACE FUNCTION public.trg_license_packages_auto_package_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if package_reference is null or empty
  IF NEW.package_reference IS NULL OR NEW.package_reference = '' THEN
    NEW.package_reference := public.generate_package_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Create trigger on license_packages
DROP TRIGGER IF EXISTS trg_auto_package_id ON public.license_packages;
CREATE TRIGGER trg_auto_package_id
  BEFORE INSERT ON public.license_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_license_packages_auto_package_id();

-- Add NOT NULL constraint with default for existing rows
UPDATE public.license_packages 
SET package_reference = public.generate_package_id() 
WHERE package_reference IS NULL OR package_reference = '';

-- Add constraint to ensure package_reference is always populated
ALTER TABLE public.license_packages 
  ALTER COLUMN package_reference SET NOT NULL;