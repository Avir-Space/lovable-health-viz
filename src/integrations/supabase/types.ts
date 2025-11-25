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
      aircraft: {
        Row: {
          airworthiness_state: string | null
          base_airport_code: string | null
          country: string | null
          created_at: string
          external_tracking_id: string | null
          external_tracking_source: string | null
          fleet_type: string | null
          health_index: number | null
          icao24_hex: string | null
          id: string
          is_active: boolean | null
          is_aog: boolean | null
          last_arrival_airport: string | null
          last_departure_airport: string | null
          last_flight_arrival_at: string | null
          last_flight_departure_at: string | null
          last_known_altitude_ft: number | null
          last_known_lat: number | null
          last_known_lon: number | null
          last_known_speed_kt: number | null
          last_position_at: string | null
          last_position_source: string | null
          meta: Json | null
          operator_name: string | null
          org_id: string
          predicted_next_compliance_at: string | null
          predicted_next_maintenance_at: string | null
          readiness_status: string | null
          registration: string
          serial_number: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          airworthiness_state?: string | null
          base_airport_code?: string | null
          country?: string | null
          created_at?: string
          external_tracking_id?: string | null
          external_tracking_source?: string | null
          fleet_type?: string | null
          health_index?: number | null
          icao24_hex?: string | null
          id?: string
          is_active?: boolean | null
          is_aog?: boolean | null
          last_arrival_airport?: string | null
          last_departure_airport?: string | null
          last_flight_arrival_at?: string | null
          last_flight_departure_at?: string | null
          last_known_altitude_ft?: number | null
          last_known_lat?: number | null
          last_known_lon?: number | null
          last_known_speed_kt?: number | null
          last_position_at?: string | null
          last_position_source?: string | null
          meta?: Json | null
          operator_name?: string | null
          org_id: string
          predicted_next_compliance_at?: string | null
          predicted_next_maintenance_at?: string | null
          readiness_status?: string | null
          registration: string
          serial_number?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          airworthiness_state?: string | null
          base_airport_code?: string | null
          country?: string | null
          created_at?: string
          external_tracking_id?: string | null
          external_tracking_source?: string | null
          fleet_type?: string | null
          health_index?: number | null
          icao24_hex?: string | null
          id?: string
          is_active?: boolean | null
          is_aog?: boolean | null
          last_arrival_airport?: string | null
          last_departure_airport?: string | null
          last_flight_arrival_at?: string | null
          last_flight_departure_at?: string | null
          last_known_altitude_ft?: number | null
          last_known_lat?: number | null
          last_known_lon?: number | null
          last_known_speed_kt?: number | null
          last_position_at?: string | null
          last_position_source?: string | null
          meta?: Json | null
          operator_name?: string | null
          org_id?: string
          predicted_next_compliance_at?: string | null
          predicted_next_maintenance_at?: string | null
          readiness_status?: string | null
          registration?: string
          serial_number?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      aircraft_counters: {
        Row: {
          aircraft_id: string
          counter_key: string
          created_at: string
          current_value: number | null
          id: string
          last_update_source: string | null
          last_updated_at: string
          meta: Json | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          aircraft_id: string
          counter_key: string
          created_at?: string
          current_value?: number | null
          id?: string
          last_update_source?: string | null
          last_updated_at?: string
          meta?: Json | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          aircraft_id?: string
          counter_key?: string
          created_at?: string
          current_value?: number | null
          id?: string
          last_update_source?: string | null
          last_updated_at?: string
          meta?: Json | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aircraft_counters_aircraft_id_fkey"
            columns: ["aircraft_id"]
            isOneToOne: false
            referencedRelation: "aircraft"
            referencedColumns: ["id"]
          },
        ]
      }
      central_tasks: {
        Row: {
          aircraft_reg: string | null
          assignee_id: string | null
          assignee_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          fleet: string | null
          id: number
          impact_band: string | null
          location: string | null
          priority: string
          sort_order: number | null
          source_dashboard: string | null
          source_kpi_key: string | null
          source_ref: Json | null
          source_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          aircraft_reg?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          fleet?: string | null
          id?: number
          impact_band?: string | null
          location?: string | null
          priority?: string
          sort_order?: number | null
          source_dashboard?: string | null
          source_kpi_key?: string | null
          source_ref?: Json | null
          source_type?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          aircraft_reg?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          fleet?: string | null
          id?: number
          impact_band?: string | null
          location?: string | null
          priority?: string
          sort_order?: number | null
          source_dashboard?: string | null
          source_kpi_key?: string | null
          source_ref?: Json | null
          source_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_kpi_benchmarks: {
        Row: {
          ai_recommendation_cta_label: string
          ai_recommendation_title: string
          ai_summary_text: string
          current_value: number
          kpi_key: string
          last_period_value: number
          target_band: string
          unit: string
          updated_at: string
        }
        Insert: {
          ai_recommendation_cta_label: string
          ai_recommendation_title: string
          ai_summary_text: string
          current_value: number
          kpi_key: string
          last_period_value: number
          target_band: string
          unit: string
          updated_at?: string
        }
        Update: {
          ai_recommendation_cta_label?: string
          ai_recommendation_title?: string
          ai_summary_text?: string
          current_value?: number
          kpi_key?: string
          last_period_value?: number
          target_band?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      impact_kpi_registry: {
        Row: {
          chart_variant: string
          config: Json
          created_at: string
          dashboard: string
          kpi_key: string
          name: string
          primary_source: string | null
          product_sources: string[]
          time_variants: string[]
          unit: string | null
          updated_at: string
        }
        Insert: {
          chart_variant: string
          config?: Json
          created_at?: string
          dashboard: string
          kpi_key: string
          name: string
          primary_source?: string | null
          product_sources?: string[]
          time_variants?: string[]
          unit?: string | null
          updated_at?: string
        }
        Update: {
          chart_variant?: string
          config?: Json
          created_at?: string
          dashboard?: string
          kpi_key?: string
          name?: string
          primary_source?: string | null
          product_sources?: string[]
          time_variants?: string[]
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      impact_settings: {
        Row: {
          aog_min_cost: number
          co2_factor: number
          currency: string
          delay_min_cost: number
          effective_from: string
          fuel_price_per_kg: number
          id: number
          inventory_carry_rate: number
          overtime_hour_cost: number
        }
        Insert: {
          aog_min_cost: number
          co2_factor: number
          currency?: string
          delay_min_cost: number
          effective_from?: string
          fuel_price_per_kg: number
          id?: never
          inventory_carry_rate: number
          overtime_hour_cost: number
        }
        Update: {
          aog_min_cost?: number
          co2_factor?: number
          currency?: string
          delay_min_cost?: number
          effective_from?: string
          fuel_price_per_kg?: number
          id?: never
          inventory_carry_rate?: number
          overtime_hour_cost?: number
        }
        Relationships: []
      }
      impact_summaries_overall: {
        Row: {
          created_at: string
          id: number
          impact_summary: string | null
          impact_unit: string | null
          impact_value: number | null
          kpi_key: string
          period: string
          summary_text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          impact_summary?: string | null
          impact_unit?: string | null
          impact_value?: number | null
          kpi_key: string
          period: string
          summary_text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          impact_summary?: string | null
          impact_unit?: string | null
          impact_value?: number | null
          kpi_key?: string
          period?: string
          summary_text?: string | null
        }
        Relationships: []
      }
      impact_summaries_user: {
        Row: {
          created_at: string
          id: number
          impact_summary: string | null
          impact_unit: string | null
          impact_value: number | null
          kpi_key: string
          period: string
          summary_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          impact_summary?: string | null
          impact_unit?: string | null
          impact_value?: number | null
          kpi_key: string
          period: string
          summary_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          impact_summary?: string | null
          impact_unit?: string | null
          impact_value?: number | null
          kpi_key?: string
          period?: string
          summary_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      impact_timeseries: {
        Row: {
          bucket: string
          context: string
          created_at: string
          id: number
          kpi_key: string
          series: string
          ts: string
          user_id: string | null
          value: number
        }
        Insert: {
          bucket?: string
          context: string
          created_at?: string
          id?: number
          kpi_key: string
          series?: string
          ts: string
          user_id?: string | null
          value: number
        }
        Update: {
          bucket?: string
          context?: string
          created_at?: string
          id?: number
          kpi_key?: string
          series?: string
          ts?: string
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "impact_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "impact_kpi_registry"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "impact_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_dynamic"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "impact_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_my_cards"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "impact_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_overall_cards"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "impact_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_slideover"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_actions: {
        Row: {
          action_cta_label: string | null
          action_title: string | null
          created_at: string | null
          evidence_section: string | null
          expected_gain: string | null
          id: number
          impact_if_ignored: string | null
          kpi_key: string
          updated_at: string | null
          why_this_action: string | null
        }
        Insert: {
          action_cta_label?: string | null
          action_title?: string | null
          created_at?: string | null
          evidence_section?: string | null
          expected_gain?: string | null
          id?: number
          impact_if_ignored?: string | null
          kpi_key: string
          updated_at?: string | null
          why_this_action?: string | null
        }
        Update: {
          action_cta_label?: string | null
          action_title?: string | null
          created_at?: string | null
          evidence_section?: string | null
          expected_gain?: string | null
          id?: number
          impact_if_ignored?: string | null
          kpi_key?: string
          updated_at?: string | null
          why_this_action?: string | null
        }
        Relationships: []
      }
      kpi_alert_rules: {
        Row: {
          comparison_operator: string
          created_at: string
          dashboard_id: string
          frequency: string
          id: number
          is_active: boolean
          kpi_key: string
          last_triggered_at: string | null
          notify_email: boolean
          notify_in_app: boolean
          threshold_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comparison_operator: string
          created_at?: string
          dashboard_id: string
          frequency?: string
          id?: number
          is_active?: boolean
          kpi_key: string
          last_triggered_at?: string | null
          notify_email?: boolean
          notify_in_app?: boolean
          threshold_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comparison_operator?: string
          created_at?: string
          dashboard_id?: string
          frequency?: string
          id?: number
          is_active?: boolean
          kpi_key?: string
          last_triggered_at?: string | null
          notify_email?: boolean
          notify_in_app?: boolean
          threshold_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kpi_categories: {
        Row: {
          category: string
          id: number
          kpi_key: string
          series: string | null
          snapshot_ts: string
          value: number
        }
        Insert: {
          category: string
          id?: number
          kpi_key: string
          series?: string | null
          snapshot_ts?: string
          value: number
        }
        Update: {
          category?: string
          id?: number
          kpi_key?: string
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
          {
            foreignKeyName: "kpi_categories_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_card_registry"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_categories_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_export_full"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_categories_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_product_sources"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_heatmap: {
        Row: {
          id: number
          kpi_key: string
          snapshot_ts: string
          value: number
          x_label: string
          y_label: string
        }
        Insert: {
          id?: number
          kpi_key: string
          snapshot_ts?: string
          value: number
          x_label: string
          y_label: string
        }
        Update: {
          id?: number
          kpi_key?: string
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
          {
            foreignKeyName: "kpi_heatmap_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_card_registry"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_heatmap_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_export_full"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_heatmap_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_product_sources"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_meta: {
        Row: {
          config: Json
          dashboard: string
          kpi_key: string
          name: string
          unit: string | null
          variant: string
          x_axis: string | null
          y_axis: string | null
        }
        Insert: {
          config?: Json
          dashboard: string
          kpi_key: string
          name: string
          unit?: string | null
          variant: string
          x_axis?: string | null
          y_axis?: string | null
        }
        Update: {
          config?: Json
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
      kpi_product_sources: {
        Row: {
          created_at: string
          kpi_key: string
          product_source: string
          sources: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          kpi_key: string
          product_source: string
          sources: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          kpi_key?: string
          product_source?: string
          sources?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_product_sources_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: true
            referencedRelation: "kpi_meta"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_product_sources_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: true
            referencedRelation: "v_impact_card_registry"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_product_sources_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: true
            referencedRelation: "v_kpi_export_full"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_product_sources_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: true
            referencedRelation: "v_kpi_product_sources"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_table_rows: {
        Row: {
          id: number
          kpi_key: string
          row: Json
          snapshot_ts: string
        }
        Insert: {
          id?: number
          kpi_key: string
          row: Json
          snapshot_ts?: string
        }
        Update: {
          id?: number
          kpi_key?: string
          row?: Json
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
          {
            foreignKeyName: "kpi_table_rows_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_card_registry"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_table_rows_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_export_full"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_table_rows_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_product_sources"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      kpi_timeseries: {
        Row: {
          bucket: string | null
          id: number
          kpi_key: string
          range_tag: string
          series: string | null
          ts: string
          value: number
        }
        Insert: {
          bucket?: string | null
          id?: number
          kpi_key: string
          range_tag: string
          series?: string | null
          ts: string
          value: number
        }
        Update: {
          bucket?: string | null
          id?: number
          kpi_key?: string
          range_tag?: string
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
          {
            foreignKeyName: "kpi_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_impact_card_registry"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_export_full"
            referencedColumns: ["kpi_key"]
          },
          {
            foreignKeyName: "kpi_timeseries_kpi_key_fkey"
            columns: ["kpi_key"]
            isOneToOne: false
            referencedRelation: "v_kpi_product_sources"
            referencedColumns: ["kpi_key"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          org_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      orgs: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      pinned_kpis: {
        Row: {
          created_at: string
          id: number
          kpi_key: string
          sort_order: number
          source_dashboard: string
        }
        Insert: {
          created_at?: string
          id?: never
          kpi_key: string
          sort_order?: number
          source_dashboard: string
        }
        Update: {
          created_at?: string
          id?: never
          kpi_key?: string
          sort_order?: number
          source_dashboard?: string
        }
        Relationships: []
      }
    }
    Views: {
      impact_ai_summaries: {
        Row: {
          context: string | null
          impact_unit: string | null
          impact_value: number | null
          kpi_key: string | null
          period: string | null
          period_end: string | null
          summary: string | null
          summary_text: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_impact_card_registry: {
        Row: {
          action_cta_label: string | null
          action_title: string | null
          kpi_key: string | null
          name: string | null
          product_sources: string[] | null
          unit: string | null
        }
        Relationships: []
      }
      v_impact_dynamic: {
        Row: {
          chart_variant: string | null
          computed_at: string | null
          current_value: number | null
          dashboard: string | null
          impact_percentage: number | null
          impact_trend: string | null
          kpi_key: string | null
          kpi_name: string | null
          previous_value: number | null
          product_sources: string[] | null
          unit: string | null
        }
        Relationships: []
      }
      v_impact_my_cards: {
        Row: {
          chart_variant: string | null
          computed_at: string | null
          dashboard: string | null
          impact_value: number | null
          kpi_key: string | null
          kpi_name: string | null
          product_sources: string[] | null
          unit: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_impact_overall_aog_minutes_avoided: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_cards: {
        Row: {
          chart_variant: string | null
          computed_at: string | null
          current_value: number | null
          dashboard: string | null
          impact_percentage: number | null
          impact_trend: string | null
          kpi_key: string | null
          kpi_name: string | null
          previous_value: number | null
          product_sources: string[] | null
          unit: string | null
        }
        Relationships: []
      }
      v_impact_overall_cost_saved: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_crew_overtime_hours: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_fuel_saved: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_grounded_due_to_spares: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_non_tech_delay_minutes: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_tech_delay_minutes: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_timeseries: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_overall_warranty_recovery_rate: {
        Row: {
          bucket: string | null
          context: string | null
          kpi_key: string | null
          series: string | null
          ts: string | null
          value: number | null
        }
        Relationships: []
      }
      v_impact_slideover: {
        Row: {
          action_cta_label: string | null
          action_title: string | null
          action_ts: string | null
          chart_variant: string | null
          dashboard: string | null
          evidence_section: string | null
          expected_gain: string | null
          impact_if_ignored: string | null
          kpi_key: string | null
          name: string | null
          primary_source: string | null
          product_sources: string[] | null
          unit: string | null
          why_this_action: string | null
        }
        Relationships: []
      }
      v_kpi_export_full: {
        Row: {
          action_cta_label: string | null
          action_title: string | null
          ai_context: string | null
          ai_impact_unit: string | null
          ai_impact_value: number | null
          ai_period: string | null
          ai_period_end: string | null
          ai_summary: string | null
          ai_summary_text: string | null
          bucket: string | null
          chart_variant: string | null
          dashboard: string | null
          evidence_section: string | null
          expected_gain: string | null
          impact_if_ignored: string | null
          kpi_config: Json | null
          kpi_key: string | null
          kpi_name: string | null
          range_tag: string | null
          series: string | null
          timeseries_id: number | null
          ts: string | null
          unit: string | null
          value: number | null
          why_this_action: string | null
          x_axis: string | null
          y_axis: string | null
        }
        Relationships: []
      }
      v_kpi_product_sources: {
        Row: {
          dashboard: string | null
          kpi_key: string | null
          name: string | null
          source: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _fx_day_grid: {
        Args: { n: number }
        Returns: {
          ts: string
        }[]
      }
      _fx_hash01: { Args: { p: string }; Returns: number }
      _fx_points_for_range: { Args: { r: string }; Returns: number }
      _grid: {
        Args: { p_range: string }
        Returns: {
          ts: string
        }[]
      }
      _hash01: { Args: { p: string }; Returns: number }
      _jitter: {
        Args: { base: number; salt: string; spread: number }
        Returns: number
      }
      core_get_kpi_payload: {
        Args: { p_kpi_key: string; p_range_tag?: string }
        Returns: Json
      }
      get_impact_slideover_payload: {
        Args: { p_kpi_key: string; p_user_id: string }
        Returns: Json
      }
      get_kpi_payload: {
        Args: { kpi_key: string; range_tag?: string }
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
      rebuild_impact_timeseries_overall: { Args: never; Returns: undefined }
      seed_all_kpis: { Args: never; Returns: undefined }
      seed_categories_kpi: {
        Args: { k: string; pie_or_bar: string }
        Returns: undefined
      }
      seed_gauge_numeric_kpi: { Args: { k: string }; Returns: undefined }
      seed_heatmap_kpi: { Args: { k: string }; Returns: undefined }
      seed_line_kpi: { Args: { k: string }; Returns: undefined }
      seed_table_kpi: { Args: { k: string }; Returns: undefined }
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
