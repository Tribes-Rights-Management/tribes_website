import { Database } from "@/integrations/supabase/types";

// Database types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
export type LicenseRequest = Database["public"]["Tables"]["license_requests"]["Row"];
export type RequestFile = Database["public"]["Tables"]["request_files"]["Row"];
export type LicenseTemplate = Database["public"]["Tables"]["license_templates"]["Row"];
export type Clause = Database["public"]["Tables"]["clauses"]["Row"];
export type TemplateClause = Database["public"]["Tables"]["template_clauses"]["Row"];
export type DealTerms = Database["public"]["Tables"]["deal_terms"]["Row"];
export type GeneratedDocument = Database["public"]["Tables"]["generated_documents"]["Row"];
export type StatusHistory = Database["public"]["Tables"]["status_history"]["Row"];
export type InternalNote = Database["public"]["Tables"]["internal_notes"]["Row"];

// Enum types
export type AppRole = Database["public"]["Enums"]["app_role"];
export type RequestStatus = Database["public"]["Enums"]["request_status"];
export type MediaType = Database["public"]["Enums"]["media_type"];
export type EntityType = Database["public"]["Enums"]["entity_type"];
export type DocType = Database["public"]["Enums"]["doc_type"];
export type FileType = Database["public"]["Enums"]["file_type"];

// Form data types
export interface LicenseeFormData {
  licensee_legal_name: string;
  licensee_entity_type: EntityType | null;
  licensee_address: string;
  licensee_email: string;
  licensee_phone: string;
}

export interface ProjectFormData {
  project_title: string;
  production_company: string;
  distributor_network_platform: string;
  release_date: string | null;
}

export interface UsageFormData {
  media_type: MediaType | null;
  placement: string;
  usage_duration: string;
  usage_start_date: string | null;
  usage_end_date: string | null;
  term: string;
  territory: string;
  is_exclusive: boolean;
  has_paid_media: boolean;
}

export interface MusicFormData {
  song_title: string;
  writers_publishers: string;
  isrc: string;
  iswc: string;
  reference_link: string;
}

export interface BudgetFormData {
  proposed_fee: number | null;
  currency: string;
  is_mfn: boolean;
  is_most_favored_terms: boolean;
  additional_notes: string;
}

export interface LicenseRequestFormData extends 
  LicenseeFormData, 
  ProjectFormData, 
  UsageFormData, 
  MusicFormData, 
  BudgetFormData {}

// Status display
export const STATUS_LABELS: Record<RequestStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In Review",
  needs_info: "Needs Info",
  approved: "Approved",
  sent_for_signature: "Sent for Signature",
  executed: "Executed",
  closed: "Closed",
};

export const STATUS_DESCRIPTIONS: Record<RequestStatus, string> = {
  draft: "Request is being drafted",
  submitted: "Request has been submitted for review",
  in_review: "Currently being reviewed by our team",
  needs_info: "Additional information required",
  approved: "Request has been approved",
  sent_for_signature: "Contract sent for signature",
  executed: "Contract has been executed",
  closed: "Request has been closed",
};

// Media type labels
export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  film: "Film",
  tv: "Television",
  ad: "Advertising",
  trailer: "Trailer",
  social: "Social Media",
  ugc: "User Generated Content",
  podcast: "Podcast",
  game: "Video Game",
  other: "Other",
};

// Entity type labels
export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  individual: "Individual",
  corporation: "Corporation",
  llc: "LLC",
  partnership: "Partnership",
  other: "Other",
};

// Default form values
export const DEFAULT_LICENSE_REQUEST: LicenseRequestFormData = {
  licensee_legal_name: "",
  licensee_entity_type: null,
  licensee_address: "",
  licensee_email: "",
  licensee_phone: "",
  project_title: "",
  production_company: "",
  distributor_network_platform: "",
  release_date: null,
  media_type: null,
  placement: "",
  usage_duration: "",
  usage_start_date: null,
  usage_end_date: null,
  term: "",
  territory: "",
  is_exclusive: false,
  has_paid_media: false,
  song_title: "",
  writers_publishers: "",
  isrc: "",
  iswc: "",
  reference_link: "",
  proposed_fee: null,
  currency: "USD",
  is_mfn: false,
  is_most_favored_terms: false,
  additional_notes: "",
};
