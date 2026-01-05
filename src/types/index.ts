import { Database } from "@/integrations/supabase/types";

// Database types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type LicenseRequest = Database["public"]["Tables"]["license_requests"]["Row"];
export type Clause = Database["public"]["Tables"]["clauses"]["Row"];
export type GeneratedDocument = Database["public"]["Tables"]["generated_documents"]["Row"];
export type StatusHistory = Database["public"]["Tables"]["status_history"]["Row"];

// Enum types
export type AppRole = "super_admin" | "admin_view" | "user";
export type RequestStatus = Database["public"]["Enums"]["request_status"];
export type MediaType = Database["public"]["Enums"]["media_type"];

// Wizard form data for multi-step form
export interface WizardFormData {
  // Agreement step
  agreement_accounting: boolean;
  agreement_terms: boolean;
  
  // Your Info step
  first_name: string;
  last_name: string;
  organization: string;
  licensee_email: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  address_country: string;
  
  // Product Details step
  label_master_owner: string;
  distributor: string;
  release_date: string | null;
  recording_artist: string;
  release_title: string;
  product_upc: string;
  additional_product_info: string;
  
  // Track Details step
  track_title: string;
  track_artist: string;
  track_isrc: string;
  runtime: string;
  appears_multiple_times: boolean;
  times_count: number | null;
  additional_track_info: string;
}

export const DEFAULT_WIZARD_FORM: WizardFormData = {
  // Agreement step
  agreement_accounting: false,
  agreement_terms: false,
  
  // Your Info step
  first_name: "",
  last_name: "",
  organization: "",
  licensee_email: "",
  address_street: "",
  address_city: "",
  address_state: "",
  address_zip: "",
  address_country: "United States",
  
  // Product Details step
  label_master_owner: "",
  distributor: "",
  release_date: null,
  recording_artist: "",
  release_title: "",
  product_upc: "",
  additional_product_info: "",
  
  // Track Details step
  track_title: "",
  track_artist: "",
  track_isrc: "",
  runtime: "",
  appears_multiple_times: false,
  times_count: null,
  additional_track_info: "",
};

// Legacy form data (keep for backward compatibility)
export interface LicenseRequestFormData {
  licensee_legal_name: string;
  licensee_email: string;
  project_title: string;
  media_type: MediaType | null;
  territory: string;
  term: string;
  usage_start_date: string | null;
  song_title: string;
  writers_publishers: string;
  proposed_fee: number | null;
  currency: string;
  usage_description: string;
  reference_link: string;
}

// Status display
export const STATUS_LABELS: Record<RequestStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In Review",
  needs_info: "Needs Info",
  approved: "Approved",
  sent_for_signature: "Awaiting Signature",
  executed: "Executed",
  closed: "Closed",
};

export const STATUS_DESCRIPTIONS: Record<RequestStatus, string> = {
  draft: "Request saved as draft",
  submitted: "Submitted for review",
  in_review: "Under review by our team",
  needs_info: "Additional information required",
  approved: "Approved — contract pending",
  sent_for_signature: "Contract sent for signature",
  executed: "Signed and complete",
  closed: "Request closed",
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

// Default form values (legacy)
export const DEFAULT_LICENSE_REQUEST: LicenseRequestFormData = {
  licensee_legal_name: "",
  licensee_email: "",
  project_title: "",
  media_type: null,
  territory: "",
  term: "",
  usage_start_date: null,
  song_title: "",
  writers_publishers: "",
  proposed_fee: null,
  currency: "USD",
  usage_description: "",
  reference_link: "",
};

// Required placeholders for contract generation
export const REQUIRED_PLACEHOLDERS = [
  "licensee_name",
  "song_title",
  "writers_publishers",
  "project_title",
  "media_type",
  "territory",
  "term",
  "start_date",
  "fee_amount",
  "currency",
];

// Role labels
export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  admin_view: "Admin (View Only)",
  user: "User",
};
