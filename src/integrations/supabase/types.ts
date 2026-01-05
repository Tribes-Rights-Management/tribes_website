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
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          key: string
          title: string
          updated_at: string
        }
        Insert: {
          body_text: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          title: string
          updated_at?: string
        }
        Update: {
          body_text?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      deal_terms: {
        Row: {
          created_at: string
          currency: string | null
          fee_amount: number | null
          id: string
          request_id: string
          template_id: string | null
          terms_json: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          fee_amount?: number | null
          id?: string
          request_id: string
          template_id?: string | null
          terms_json?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          fee_amount?: number | null
          id?: string
          request_id?: string
          template_id?: string | null
          terms_json?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_terms_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "license_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_terms_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "license_templates"
            referencedColumns: ["id"]
          },
        ]
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
          additional_notes: string | null
          created_at: string
          currency: string | null
          distributor_network_platform: string | null
          has_paid_media: boolean | null
          id: string
          is_exclusive: boolean | null
          is_mfn: boolean | null
          is_most_favored_terms: boolean | null
          isrc: string | null
          iswc: string | null
          licensee_address: string | null
          licensee_email: string | null
          licensee_entity_type:
            | Database["public"]["Enums"]["entity_type"]
            | null
          licensee_legal_name: string | null
          licensee_phone: string | null
          media_type: Database["public"]["Enums"]["media_type"] | null
          placement: string | null
          production_company: string | null
          project_title: string | null
          proposed_fee: number | null
          reference_link: string | null
          release_date: string | null
          signing_session_id: string | null
          signing_url: string | null
          song_title: string | null
          status: Database["public"]["Enums"]["request_status"]
          submitted_at: string | null
          term: string | null
          territory: string | null
          updated_at: string
          usage_duration: string | null
          usage_end_date: string | null
          usage_start_date: string | null
          user_id: string
          writers_publishers: string | null
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string
          currency?: string | null
          distributor_network_platform?: string | null
          has_paid_media?: boolean | null
          id?: string
          is_exclusive?: boolean | null
          is_mfn?: boolean | null
          is_most_favored_terms?: boolean | null
          isrc?: string | null
          iswc?: string | null
          licensee_address?: string | null
          licensee_email?: string | null
          licensee_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          licensee_legal_name?: string | null
          licensee_phone?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          placement?: string | null
          production_company?: string | null
          project_title?: string | null
          proposed_fee?: number | null
          reference_link?: string | null
          release_date?: string | null
          signing_session_id?: string | null
          signing_url?: string | null
          song_title?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string | null
          term?: string | null
          territory?: string | null
          updated_at?: string
          usage_duration?: string | null
          usage_end_date?: string | null
          usage_start_date?: string | null
          user_id: string
          writers_publishers?: string | null
        }
        Update: {
          additional_notes?: string | null
          created_at?: string
          currency?: string | null
          distributor_network_platform?: string | null
          has_paid_media?: boolean | null
          id?: string
          is_exclusive?: boolean | null
          is_mfn?: boolean | null
          is_most_favored_terms?: boolean | null
          isrc?: string | null
          iswc?: string | null
          licensee_address?: string | null
          licensee_email?: string | null
          licensee_entity_type?:
            | Database["public"]["Enums"]["entity_type"]
            | null
          licensee_legal_name?: string | null
          licensee_phone?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          placement?: string | null
          production_company?: string | null
          project_title?: string | null
          proposed_fee?: number | null
          reference_link?: string | null
          release_date?: string | null
          signing_session_id?: string | null
          signing_url?: string | null
          song_title?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string | null
          term?: string | null
          territory?: string | null
          updated_at?: string
          usage_duration?: string | null
          usage_end_date?: string | null
          usage_start_date?: string | null
          user_id?: string
          writers_publishers?: string | null
        }
        Relationships: []
      }
      license_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          version?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      request_files: {
        Row: {
          created_at: string
          file_name: string
          file_type: Database["public"]["Enums"]["file_type"]
          id: string
          request_id: string
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_type?: Database["public"]["Enums"]["file_type"]
          id?: string
          request_id: string
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_type?: Database["public"]["Enums"]["file_type"]
          id?: string
          request_id?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_files_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "license_requests"
            referencedColumns: ["id"]
          },
        ]
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
      template_clauses: {
        Row: {
          clause_id: string
          id: string
          is_required: boolean
          sort_order: number
          template_id: string
        }
        Insert: {
          clause_id: string
          id?: string
          is_required?: boolean
          sort_order?: number
          template_id: string
        }
        Update: {
          clause_id?: string
          id?: string
          is_required?: boolean
          sort_order?: number
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_clauses_clause_id_fkey"
            columns: ["clause_id"]
            isOneToOne: false
            referencedRelation: "clauses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_clauses_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "license_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
    }
    Enums: {
      app_role: "user" | "admin"
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
      app_role: ["user", "admin"],
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
      ],
    },
  },
} as const
