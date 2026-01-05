-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Create request status enum
CREATE TYPE public.request_status AS ENUM (
  'draft',
  'submitted',
  'in_review',
  'needs_info',
  'approved',
  'sent_for_signature',
  'executed',
  'closed'
);

-- Create media type enum
CREATE TYPE public.media_type AS ENUM (
  'film',
  'tv',
  'ad',
  'trailer',
  'social',
  'ugc',
  'podcast',
  'game',
  'other'
);

-- Create entity type enum
CREATE TYPE public.entity_type AS ENUM (
  'individual',
  'corporation',
  'llc',
  'partnership',
  'other'
);

-- Create doc type enum
CREATE TYPE public.doc_type AS ENUM ('draft', 'executed');

-- Create file type enum  
CREATE TYPE public.file_type AS ENUM ('brief', 'cue_sheet', 'reference', 'other');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- License requests table
CREATE TABLE public.license_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status request_status NOT NULL DEFAULT 'draft',
  
  -- Licensee info (Step 1)
  licensee_legal_name TEXT,
  licensee_entity_type entity_type,
  licensee_address TEXT,
  licensee_email TEXT,
  licensee_phone TEXT,
  
  -- Project info (Step 2)
  project_title TEXT,
  production_company TEXT,
  distributor_network_platform TEXT,
  release_date DATE,
  
  -- Usage info (Step 3)
  media_type media_type,
  placement TEXT,
  usage_duration TEXT,
  usage_start_date DATE,
  usage_end_date DATE,
  term TEXT,
  territory TEXT,
  is_exclusive BOOLEAN DEFAULT false,
  has_paid_media BOOLEAN DEFAULT false,
  
  -- Music info (Step 4)
  song_title TEXT,
  writers_publishers TEXT,
  isrc TEXT,
  iswc TEXT,
  reference_link TEXT,
  
  -- Budget info (Step 5)
  proposed_fee DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  is_mfn BOOLEAN DEFAULT false,
  is_most_favored_terms BOOLEAN DEFAULT false,
  additional_notes TEXT,
  
  -- Signature tracking
  signing_session_id TEXT,
  signing_url TEXT,
  
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Request files table
CREATE TABLE public.request_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.license_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type file_type NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- License templates table
CREATE TABLE public.license_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clauses table
CREATE TABLE public.clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body_text TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Template clauses junction table
CREATE TABLE public.template_clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.license_templates(id) ON DELETE CASCADE,
  clause_id UUID NOT NULL REFERENCES public.clauses(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(template_id, clause_id)
);

-- Deal terms table
CREATE TABLE public.deal_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.license_requests(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.license_templates(id),
  terms_json JSONB,
  fee_amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generated documents table
CREATE TABLE public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.license_requests(id) ON DELETE CASCADE,
  doc_type doc_type NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Status history table
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.license_requests(id) ON DELETE CASCADE,
  from_status request_status,
  to_status request_status NOT NULL,
  actor_user_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Internal notes table for admin
CREATE TABLE public.internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.license_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies (users can read their own, admins can manage all)
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- License requests policies
CREATE POLICY "Users can view own requests" ON public.license_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own requests" ON public.license_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft requests" ON public.license_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Users can update own needs_info requests" ON public.license_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'needs_info');

CREATE POLICY "Admins can view all requests" ON public.license_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all requests" ON public.license_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Request files policies
CREATE POLICY "Users can view own files" ON public.request_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own files" ON public.request_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all files" ON public.request_files
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- License templates policies (read-only for users, full for admins)
CREATE POLICY "All authenticated users can view active templates" ON public.license_templates
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can manage templates" ON public.license_templates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Clauses policies
CREATE POLICY "All authenticated users can view active clauses" ON public.clauses
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Admins can manage clauses" ON public.clauses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Template clauses policies
CREATE POLICY "All authenticated users can view template clauses" ON public.template_clauses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage template clauses" ON public.template_clauses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Deal terms policies
CREATE POLICY "Users can view deal terms for own requests" ON public.deal_terms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.license_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all deal terms" ON public.deal_terms
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Generated documents policies
CREATE POLICY "Users can view documents for own requests" ON public.generated_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.license_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all documents" ON public.generated_documents
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Status history policies
CREATE POLICY "Users can view history for own requests" ON public.status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.license_requests 
      WHERE id = request_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all history" ON public.status_history
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create history" ON public.status_history
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Internal notes policies (admin only)
CREATE POLICY "Admins can manage internal notes" ON public.internal_notes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_license_requests_updated_at
  BEFORE UPDATE ON public.license_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_license_templates_updated_at
  BEFORE UPDATE ON public.license_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_clauses_updated_at
  BEFORE UPDATE ON public.clauses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_deal_terms_updated_at
  BEFORE UPDATE ON public.deal_terms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for request files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('request-files', 'request-files', false);

-- Create storage bucket for generated documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('generated-documents', 'generated-documents', false);

-- Storage policies for request-files bucket
CREATE POLICY "Users can upload own request files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'request-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own request files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'request-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all request files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'request-files' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for generated-documents bucket
CREATE POLICY "Users can view own generated documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'generated-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can manage all generated documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'generated-documents' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Seed license templates
INSERT INTO public.license_templates (id, name, description, version) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Standard Sync License', 'Standard synchronization license for audiovisual media', '1.0'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Master Use License', 'License for master recording usage in media productions', '1.0');

-- Seed clauses
INSERT INTO public.clauses (id, key, title, body_text, category) VALUES
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'grant_of_rights', 'Grant of Rights', 'Licensor hereby grants to Licensee a non-exclusive license to synchronize the musical composition entitled "{{song_title}}" (the "Composition") in timed relation with the audiovisual production entitled "{{project_title}}" (the "Production").', 'core'),
  ('d4e5f6a7-b8c9-0123-def0-234567890123', 'territory', 'Territory', 'This license is granted for exploitation in {{territory}}.', 'scope'),
  ('e5f6a7b8-c9d0-1234-ef01-345678901234', 'term', 'Term', 'This license shall be effective for a period of {{term}} commencing on {{usage_start_date}}.', 'scope'),
  ('f6a7b8c9-d0e1-2345-f012-456789012345', 'fee', 'License Fee', 'In consideration for the rights granted herein, Licensee shall pay to Licensor a one-time synchronization fee of {{currency}} {{fee_amount}} (the "Fee").', 'financial'),
  ('a7b8c9d0-e1f2-3456-0123-567890123456', 'mfn', 'Most Favored Nations', 'The Fee shall be subject to Most Favored Nations treatment with respect to any other musical compositions licensed for use in the Production.', 'financial'),
  ('b8c9d0e1-f2a3-4567-1234-678901234567', 'credit', 'Credit', 'Licensee shall accord credit to Licensor in the Production''s end credits as follows: "{{song_title}}" written by {{writers_publishers}}.', 'obligations'),
  ('c9d0e1f2-a3b4-5678-2345-789012345678', 'representations', 'Representations and Warranties', 'Licensor represents and warrants that it has the full right, power, and authority to grant the rights herein and that the exercise of such rights will not infringe upon or violate the rights of any third party.', 'legal'),
  ('d0e1f2a3-b4c5-6789-3456-890123456789', 'indemnification', 'Indemnification', 'Licensor shall indemnify and hold harmless Licensee from and against any and all claims, damages, liabilities, costs, and expenses arising out of any breach of the representations and warranties contained herein.', 'legal');

-- Link clauses to Standard Sync template
INSERT INTO public.template_clauses (template_id, clause_id, sort_order, is_required) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 1, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd4e5f6a7-b8c9-0123-def0-234567890123', 2, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'e5f6a7b8-c9d0-1234-ef01-345678901234', 3, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f6a7b8c9-d0e1-2345-f012-456789012345', 4, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'a7b8c9d0-e1f2-3456-0123-567890123456', 5, false),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'b8c9d0e1-f2a3-4567-1234-678901234567', 6, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c9d0e1f2-a3b4-5678-2345-789012345678', 7, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0e1f2a3-b4c5-6789-3456-890123456789', 8, true);

-- Link clauses to Master Use template
INSERT INTO public.template_clauses (template_id, clause_id, sort_order, is_required) VALUES
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 1, true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'd4e5f6a7-b8c9-0123-def0-234567890123', 2, true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'e5f6a7b8-c9d0-1234-ef01-345678901234', 3, true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'f6a7b8c9-d0e1-2345-f012-456789012345', 4, true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'c9d0e1f2-a3b4-5678-2345-789012345678', 5, true),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'd0e1f2a3-b4c5-6789-3456-890123456789', 6, true);