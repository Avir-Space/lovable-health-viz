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
      kpi_categories: {
        Row: {
          category: string
          id: number
          kpi_key: string | null
          series: string | null
          snapshot_ts: string
          value: number
        }
        Insert: {
          category: string
          id?: number
          kpi_key?: string | null
          series?: string | null
          snapshot_ts?: string
          value: number
        }
        Update: {
          category?: string
          id?: number
          kpi_key?: string | null
          series?: string | null
          snapshot_ts?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_categories_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "kpi_meta"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_heatmap: {
        Row: {
          id: number
          kpi_key: string | null
          snapshot_ts: string
          value: number
          x_label: string
          y_label: string
        }
        Insert: {
          id?: number
          kpi_key?: string | null
          snapshot_ts?: string
          value: number
          x_label: string
          y_label: string
        }
        Update: {
          id?: number
          kpi_key?: string | null
          snapshot_ts?: string
          value?: number
          x_label?: string
          y_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_heatmap_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "kpi_meta"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_meta: {
        Row: {
          config: Json | null
          dashboard: string
          kpi_key: string
          name: string
          unit: string | null
          variant: string
          x_axis: string | null
          y_axis: string | null
        }
        Insert: {
          config?: Json | null
          dashboard: string
          kpi_key: string
          name: string
          unit?: string | null
          variant: string
          x_axis?: string | null
          y_axis?: string | null
        }
        Update: {
          config?: Json | null
          dashboard?: string
          kpi_key?: string
          name?: string
          unit?: string | null
          variant?: string
          x_axis?: string | null
          y_axis?: string | null
        }
        Relationships: []
      }
      kpi_table_rows: {
        Row: {
          id: number
          kpi_key: string | null
          row_data: Json
          snapshot_ts: string
        }
        Insert: {
          id?: number
          kpi_key?: string | null
          row_data: Json
          snapshot_ts?: string
        }
        Update: {
          id?: number
          kpi_key?: string | null
          row_data?: Json
          snapshot_ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_table_rows_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "kpi_meta"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_timeseries: {
        Row: {
          id: number
          inserted_at: string | null
          kpi_key: string | null
          range_tag: string | null
          series: string | null
          ts: string
          value: number
        }
        Insert: {
          id?: number
          inserted_at?: string | null
          kpi_key?: string | null
          range_tag?: string | null
          series?: string | null
          ts: string
          value: number
        }
        Update: {
          id?: number
          inserted_at?: string | null
          kpi_key?: string | null
          range_tag?: string | null
          series?: string | null
          ts?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "kpi_meta"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_kpi_payload: {
        Args: { p_kpi_key: string; p_range: string }
        Returns: Json
      }
      kpi_latest_categories: {
        Args: { p_kpi_key: string }
        Returns: {
          category: string
          series: string
          value: number
        }[]
      }
      kpi_latest_heatmap: {
        Args: { p_kpi_key: string }
        Returns: {
          value: number
          x_label: string
          y_label: string
        }[]
      }
      kpi_latest_table: {
        Args: { p_kpi_key: string }
        Returns: {
          row_data: Json
        }[]
      }
      kpi_timeseries_bucketed: {
        Args: { p_kpi_key: string; p_range: string }
        Returns: {
          bucket: string
          series: string
          value: number
        }[]
      }
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
