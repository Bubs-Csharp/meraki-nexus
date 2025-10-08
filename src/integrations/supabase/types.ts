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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          property_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          property_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          property_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          property_id: string | null
          recipient_id: string
          sender_id: string
          subject: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          property_id?: string | null
          recipient_id: string
          sender_id: string
          subject: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          property_id?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contractors: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string
          rating: number | null
          specialty: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone: string
          rating?: number | null
          specialty: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string
          rating?: number | null
          specialty?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          document_type: string
          expiry_date: string | null
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          property_id: string | null
          tenant_id: string | null
          title: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          document_type: string
          expiry_date?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          property_id?: string | null
          tenant_id?: string | null
          title: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          document_type?: string
          expiry_date?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          property_id?: string | null
          tenant_id?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          approved_by: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          property_id: string
          receipt_url: string | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          property_id: string
          receipt_url?: string | null
          transaction_date?: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          property_id?: string
          receipt_url?: string | null
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          checklist_completed: boolean | null
          created_at: string
          findings: Json | null
          id: string
          images: Json | null
          inspection_date: string
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          notes: string | null
          property_id: string
          runner_id: string
          updated_at: string
        }
        Insert: {
          checklist_completed?: boolean | null
          created_at?: string
          findings?: Json | null
          id?: string
          images?: Json | null
          inspection_date: string
          inspection_type: Database["public"]["Enums"]["inspection_type"]
          notes?: string | null
          property_id: string
          runner_id: string
          updated_at?: string
        }
        Update: {
          checklist_completed?: boolean | null
          created_at?: string
          findings?: Json | null
          id?: string
          images?: Json | null
          inspection_date?: string
          inspection_type?: Database["public"]["Enums"]["inspection_type"]
          notes?: string | null
          property_id?: string
          runner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_runner_id_fkey"
            columns: ["runner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          actual_cost: number | null
          completed_date: string | null
          contractor_id: string | null
          created_at: string
          created_by: string | null
          description: string
          estimated_cost: number | null
          id: string
          images: Json | null
          priority: string | null
          property_id: string
          runner_id: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["maintenance_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          completed_date?: string | null
          contractor_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          estimated_cost?: number | null
          id?: string
          images?: Json | null
          priority?: string | null
          property_id: string
          runner_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          completed_date?: string | null
          contractor_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          estimated_cost?: number | null
          id?: string
          images?: Json | null
          priority?: string | null
          property_id?: string
          runner_id?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_runner_id_fkey"
            columns: ["runner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          notification_preferences: Json | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          amenities: Json | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          current_value: number | null
          description: string | null
          id: string
          images: Json | null
          manager_id: string | null
          monthly_rent: number | null
          name: string
          owner_id: string
          property_type: string | null
          purchase_price: number | null
          runner_id: string | null
          size_sqft: number | null
          status: Database["public"]["Enums"]["property_status"] | null
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          images?: Json | null
          manager_id?: string | null
          monthly_rent?: number | null
          name: string
          owner_id: string
          property_type?: string | null
          purchase_price?: number | null
          runner_id?: string | null
          size_sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: Json | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          images?: Json | null
          manager_id?: string | null
          monthly_rent?: number | null
          name?: string
          owner_id?: string
          property_type?: string | null
          purchase_price?: number | null
          runner_id?: string | null
          size_sqft?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_runner_id_fkey"
            columns: ["runner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          email: string | null
          emergency_contact: Json | null
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          lease_end_date: string | null
          lease_start_date: string | null
          monthly_rent: number | null
          phone: string | null
          property_id: string
          security_deposit: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          lease_end_date?: string | null
          lease_start_date?: string | null
          monthly_rent?: number | null
          phone?: string | null
          property_id: string
          security_deposit?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          emergency_contact?: Json | null
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          lease_end_date?: string | null
          lease_start_date?: string | null
          monthly_rent?: number | null
          phone?: string | null
          property_id?: string
          security_deposit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: {
        Args: { _user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      inspection_type:
        | "routine"
        | "move_in"
        | "move_out"
        | "maintenance"
        | "emergency"
      maintenance_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      property_status:
        | "occupied"
        | "vacant"
        | "maintenance"
        | "under_construction"
      transaction_type: "income" | "expense"
      user_role:
        | "super_admin"
        | "property_manager"
        | "property_runner"
        | "property_owner"
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
      inspection_type: [
        "routine",
        "move_in",
        "move_out",
        "maintenance",
        "emergency",
      ],
      maintenance_status: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      property_status: [
        "occupied",
        "vacant",
        "maintenance",
        "under_construction",
      ],
      transaction_type: ["income", "expense"],
      user_role: [
        "super_admin",
        "property_manager",
        "property_runner",
        "property_owner",
      ],
    },
  },
} as const
