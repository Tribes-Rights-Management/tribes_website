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

// Simplified form data (10-12 fields)
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

// Default form values
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
