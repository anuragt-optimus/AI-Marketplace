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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      offers: {
        Row: {
          created_at: string
          documentation_urls: string[] | null
          error_message: string | null
          fulfillment_manifest: Json | null
          icon_assets: string[] | null
          id: string
          key_features: Json | null
          legal_copy: string | null
          listing_title: string | null
          long_description: string | null
          manifest_file_url: string | null
          offer_alias: string | null
          offer_listing: Json | null
          offer_setup: Json | null
          offer_type: string
          partner_center_id: string | null
          plan_details: Json | null
          plans: Json | null
          preview_audience: Json | null
          pricing_draft: Json | null
          private_offer_templates: Json | null
          properties: Json | null
          resell_csp: Json | null
          screenshots: string[] | null
          short_description: string | null
          status: string | null
          supplemental_content: Json | null
          technical_config: Json | null
          updated_at: string
          use_cases: Json | null
          user_id: string
          web_app_link: string | null
          website_url: string
        }
        Insert: {
          created_at?: string
          documentation_urls?: string[] | null
          error_message?: string | null
          fulfillment_manifest?: Json | null
          icon_assets?: string[] | null
          id?: string
          key_features?: Json | null
          legal_copy?: string | null
          listing_title?: string | null
          long_description?: string | null
          manifest_file_url?: string | null
          offer_alias?: string | null
          offer_listing?: Json | null
          offer_setup?: Json | null
          offer_type: string
          partner_center_id?: string | null
          plan_details?: Json | null
          plans?: Json | null
          preview_audience?: Json | null
          pricing_draft?: Json | null
          private_offer_templates?: Json | null
          properties?: Json | null
          resell_csp?: Json | null
          screenshots?: string[] | null
          short_description?: string | null
          status?: string | null
          supplemental_content?: Json | null
          technical_config?: Json | null
          updated_at?: string
          use_cases?: Json | null
          user_id: string
          web_app_link?: string | null
          website_url: string
        }
        Update: {
          created_at?: string
          documentation_urls?: string[] | null
          error_message?: string | null
          fulfillment_manifest?: Json | null
          icon_assets?: string[] | null
          id?: string
          key_features?: Json | null
          legal_copy?: string | null
          listing_title?: string | null
          long_description?: string | null
          manifest_file_url?: string | null
          offer_alias?: string | null
          offer_listing?: Json | null
          offer_setup?: Json | null
          offer_type?: string
          partner_center_id?: string | null
          plan_details?: Json | null
          plans?: Json | null
          preview_audience?: Json | null
          pricing_draft?: Json | null
          private_offer_templates?: Json | null
          properties?: Json | null
          resell_csp?: Json | null
          screenshots?: string[] | null
          short_description?: string | null
          status?: string | null
          supplemental_content?: Json | null
          technical_config?: Json | null
          updated_at?: string
          use_cases?: Json | null
          user_id?: string
          web_app_link?: string | null
          website_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_demo_offers: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
