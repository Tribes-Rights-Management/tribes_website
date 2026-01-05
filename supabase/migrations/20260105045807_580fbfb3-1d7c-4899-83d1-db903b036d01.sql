-- Simplify the data model for MVP
-- Drop complex tables not needed for single-template MVP
DROP TABLE IF EXISTS public.template_clauses CASCADE;
DROP TABLE IF EXISTS public.license_templates CASCADE;
DROP TABLE IF EXISTS public.deal_terms CASCADE;
DROP TABLE IF EXISTS public.request_files CASCADE;
DROP TABLE IF EXISTS public.internal_notes CASCADE;

-- Recreate clauses table for single template
DROP TABLE IF EXISTS public.clauses CASCADE;
CREATE TABLE public.clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  body_text TEXT NOT NULL,
  placeholders TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clauses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read clauses" ON public.clauses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage clauses" ON public.clauses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Simplify license_requests table
ALTER TABLE public.license_requests 
  DROP COLUMN IF EXISTS licensee_entity_type,
  DROP COLUMN IF EXISTS licensee_address,
  DROP COLUMN IF EXISTS licensee_phone,
  DROP COLUMN IF EXISTS production_company,
  DROP COLUMN IF EXISTS distributor_network_platform,
  DROP COLUMN IF EXISTS release_date,
  DROP COLUMN IF EXISTS placement,
  DROP COLUMN IF EXISTS usage_duration,
  DROP COLUMN IF EXISTS usage_end_date,
  DROP COLUMN IF EXISTS is_exclusive,
  DROP COLUMN IF EXISTS has_paid_media,
  DROP COLUMN IF EXISTS isrc,
  DROP COLUMN IF EXISTS iswc,
  DROP COLUMN IF EXISTS is_mfn,
  DROP COLUMN IF EXISTS is_most_favored_terms,
  DROP COLUMN IF EXISTS additional_notes,
  DROP COLUMN IF EXISTS signing_session_id,
  DROP COLUMN IF EXISTS signing_url;

-- Add simplified/renamed columns
ALTER TABLE public.license_requests
  ADD COLUMN IF NOT EXISTS usage_description TEXT,
  ADD COLUMN IF NOT EXISTS signing_envelope_id TEXT,
  ADD COLUMN IF NOT EXISTS signing_url TEXT,
  ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;

-- Seed the single license template clauses
INSERT INTO public.clauses (sort_order, title, body_text, placeholders) VALUES
(1, 'Parties', 'This Music Synchronization License Agreement ("Agreement") is entered into as of {{effective_date}} by and between the music rights holder ("Licensor") and {{licensee_name}} ("Licensee").', ARRAY['effective_date', 'licensee_name']),
(2, 'Grant of Rights', 'Licensor hereby grants to Licensee a non-exclusive license to synchronize the musical composition entitled "{{song_title}}" written by {{writers_publishers}} (the "Composition") in timed relation with the audiovisual production entitled "{{project_title}}" (the "Production").', ARRAY['song_title', 'writers_publishers', 'project_title']),
(3, 'Permitted Use', 'The Composition may be used in the Production for {{media_type}} distribution. {{usage_description}}', ARRAY['media_type', 'usage_description']),
(4, 'Territory', 'This license is granted for exploitation in {{territory}}.', ARRAY['territory']),
(5, 'Term', 'This license shall be effective for a period of {{term}} commencing on {{start_date}}.', ARRAY['term', 'start_date']),
(6, 'License Fee', 'In consideration for the rights granted herein, Licensee shall pay to Licensor a one-time synchronization fee of {{currency}} {{fee_amount}} (the "Fee"), payable within thirty (30) days of execution of this Agreement.', ARRAY['currency', 'fee_amount']),
(7, 'Credit', 'Licensee shall use best efforts to accord credit to Licensor in the Production end credits as follows: "{{song_title}}" written by {{writers_publishers}}".', ARRAY['song_title', 'writers_publishers']),
(8, 'Representations and Warranties', 'Licensor represents and warrants that it has the full right, power, and authority to grant the rights herein and that the exercise of such rights will not infringe upon or violate the rights of any third party.', ARRAY[]::TEXT[]),
(9, 'Indemnification', 'Each party shall indemnify and hold harmless the other party from and against any and all claims, damages, liabilities, costs, and expenses arising out of any breach of the representations and warranties contained herein.', ARRAY[]::TEXT[]),
(10, 'Governing Law', 'This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of laws principles.', ARRAY[]::TEXT[]),
(11, 'Entire Agreement', 'This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, or agreements relating thereto.', ARRAY[]::TEXT[]),
(12, 'Signatures', 'IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

LICENSOR:
Signature: _________________________
Name: _________________________
Date: _________________________

LICENSEE:
Signature: _________________________
Name: {{licensee_name}}
Date: _________________________', ARRAY['licensee_name']);