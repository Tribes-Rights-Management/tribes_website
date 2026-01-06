export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clauses: {
        Row: {
          body_text: string
          created_at: string
          id: string
          placeholders: string[] | null
          sort_order: number
          title: string
        }
        Insert: {
          body_text: string
          created_at?: string
          id?: string
          placeholders?: string[] | null
          sort_order?: number
          title: string
        }
        Update: {
          body_text?: string
          created_at?: string
          id?: string
          placeholders?: string[] | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      generated_documents: {
        Row: {
          created_at: string
          doc_type: Database["public"]["Enums"]["doc_type"]
          id: string
          request_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          doc_type: Database["public"]["Enums"]["doc_type"]
          id?: string
          request_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          doc_type?: Database["public"]["Enums"]["doc_type"]
          id?: string
          request_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "license_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_notes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "license_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      license_requests: {
        Row: {
          additional_product_info: string | null
          additional_track_info: string | null
          address_city: string | null
          address_country: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          agreement_accounting: boolean | null
          agreement_terms: boolean | null
          appears_multiple_times: boolean | null
          created_at: string
          currency: string | null
          distributor: string | null
          first_name: string | null
          id: string
          label_master_owner: string | null
          last_name: string | null
          license_id: string | null
          licensee_email: string | null
          licensee_legal_name: string | null
          media_type: Database["public"]["Enums"]["media_type"] | null
          organization: string | null
          product_upc: string | null
          project_title: string | null
          proposed_fee: number | null
          recording_artist: string | null
          reference_link: string | null
          release_date: string | null
          release_title: string | null
          runtime: string | null
          signed_at: string | null
          signing_envelope_id: string | null
          signing_url: string | null
          song_title: string | null
          status: Database["public"]["Enums"]["request_status"]
          submitted_at: string | null
          term: string | null
          territory: string | null
          times_count: number | null
          track_artist: string | null
          track_isrc: string | null
          track_title: string | null
          updated_at: string
          usage_description: string | null
          usage_start_date: string | null
          user_id: string
          writers_publishers: string | null
        }
        Insert: {
          additional_product_info?: string | null
          additional_track_info?: string | null
          address_city?: string | null
          address_country?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          agreement_accounting?: boolean | null
          agreement_terms?: boolean | null
          appears_multiple_times?: boolean | null
          created_at?: string
          currency?: string | null
          distributor?: string | null
          first_name?: string | null
          id?: string
          label_master_owner?: string | null
          last_name?: string | null
          license_id?: string | null
          licensee_email?: string | null
          licensee_legal_name?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          organization?: string | null
          product_upc?: string | null
          project_title?: string | null
          proposed_fee?: number | null
          recording_artist?: string | null
          reference_link?: string | null
          release_date?: string | null
          release_title?: string | null
          runtime?: string | null
          signed_at?: string | null
          signing_envelope_id?: string | null
          signing_url?: string | null
          song_title?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string | null
          term?: string | null
          territory?: string | null
          times_count?: number | null
          track_artist?: string | null
          track_isrc?: string | null
          track_title?: string | null
          updated_at?: string
          usage_description?: string | null
          usage_start_date?: string | null
          user_id: string
          writers_publishers?: string | null
        }
        Update: {
          additional_product_info?: string | null
          additional_track_info?: string | null
          address_city?: string | null
          address_country?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          agreement_accounting?: boolean | null
          agreement_terms?: boolean | null
          appears_multiple_times?: boolean | null
          created_at?: string
          currency?: string | null
          distributor?: string | null
          first_name?: string | null
          id?: string
          label_master_owner?: string | null
          last_name?: string | null
          license_id?: string | null
          licensee_email?: string | null
          licensee_legal_name?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          organization?: string | null
          product_upc?: string | null
          project_title?: string | null
          proposed_fee?: number | null
          recording_artist?: string | null
          reference_link?: string | null
          release_date?: string | null
          release_title?: string | null
          runtime?: string | null
          signed_at?: string | null
          signing_envelope_id?: string | null
          signing_url?: string | null
          song_title?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string | null
          term?: string | null
          territory?: string | null
          times_count?: number | null
          track_artist?: string | null
          track_isrc?: string | null
          track_title?: string | null
          updated_at?: string
          usage_description?: string | null
          usage_start_date?: string | null
          user_id?: string
          writers_publishers?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      status_history: {
        Row: {
          actor_user_id: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["request_status"] | null
          id: string
          notes: string | null
          request_id: string
          to_status: Database["public"]["Enums"]["request_status"]
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["request_status"] | null
          id?: string
          notes?: string | null
          request_id: string
          to_status: Database["public"]["Enums"]["request_status"]
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["request_status"] | null
          id?: string
          notes?: string | null
          request_id?: string
          to_status?: Database["public"]["Enums"]["request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "license_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active_user: { Args: { _user_id: string }; Returns: boolean }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      account_status: "pending" | "active" | "rejected"
      app_role: "super_admin" | "admin_view" | "user"
      doc_type: "draft" | "executed"
      entity_type:
        | "individual"
        | "corporation"
        | "llc"
        | "partnership"
        | "other"
      file_type: "brief" | "cue_sheet" | "reference" | "other"
      media_type:
        | "film"
        | "tv"
        | "ad"
        | "trailer"
        | "social"
        | "ugc"
        | "podcast"
        | "game"
        | "other"
      request_status:
        | "draft"
        | "submitted"
        | "in_review"
        | "needs_info"
        | "approved"
        | "sent_for_signature"
        | "executed"
        | "closed"
        | "awaiting_signature"
        | "awaiting_payment"
        | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["pending", "active", "rejected"],
      app_role: ["super_admin", "admin_view", "user"],
      doc_type: ["draft", "executed"],
      entity_type: ["individual", "corporation", "llc", "partnership", "other"],
      file_type: ["brief", "cue_sheet", "reference", "other"],
      media_type: [
        "film",
        "tv",
        "ad",
        "trailer",
        "social",
        "ugc",
        "podcast",
        "game",
        "other",
      ],
      request_status: [
        "draft",
        "submitted",
        "in_review",
        "needs_info",
        "approved",
        "sent_for_signature",
        "executed",
        "closed",
        "awaiting_signature",
        "awaiting_payment",
        "done",
      ],
    },
  },
} as const
