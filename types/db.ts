export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
          teams_uuid: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
          teams_uuid?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
          teams_uuid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_teams_uuid_fkey"
            columns: ["teams_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          }
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          name: string | null
          status: string | null
          teams_uuid: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          name?: string | null
          status?: string | null
          teams_uuid?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          name?: string | null
          status?: string | null
          teams_uuid?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_teams_uuid_fkey"
            columns: ["teams_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          }
        ]
      }
      sections: {
        Row: {
          created_at: string
          description: string | null
          name: string | null
          projects_uuid: string | null
          status: string | null
          teams_uuid: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          name?: string | null
          projects_uuid?: string | null
          status?: string | null
          teams_uuid?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          name?: string | null
          projects_uuid?: string | null
          status?: string | null
          teams_uuid?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_projects_uuid_fkey"
            columns: ["projects_uuid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "sections_teams_uuid_fkey"
            columns: ["teams_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          }
        ]
      }
      settings: {
        Row: {
          created_at: string
          name: string | null
          projects_uuid: string | null
          sections_uuid: string | null
          status: string | null
          teams_uuid: string | null
          type: string | null
          updated_at: string | null
          uuid: string
          value: string | null
        }
        Insert: {
          created_at?: string
          name?: string | null
          projects_uuid?: string | null
          sections_uuid?: string | null
          status?: string | null
          teams_uuid?: string | null
          type?: string | null
          updated_at?: string | null
          uuid?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          name?: string | null
          projects_uuid?: string | null
          sections_uuid?: string | null
          status?: string | null
          teams_uuid?: string | null
          type?: string | null
          updated_at?: string | null
          uuid?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_projects_uuid_fkey"
            columns: ["projects_uuid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "settings_sections_uuid_fkey"
            columns: ["sections_uuid"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "settings_teams_uuid_fkey"
            columns: ["teams_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          teams_uuid: string | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          teams_uuid?: string | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          teams_uuid?: string | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_teams_uuid_fkey"
            columns: ["teams_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          name: string | null
          uuid: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          name?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          name?: string | null
          uuid?: string
        }
        Relationships: []
      }
      teams_users: {
        Row: {
          created_at: string
          role: string | null
          teams_uuid: string | null
          user_uuid: string | null
          uuid: string
        }
        Insert: {
          created_at?: string
          role?: string | null
          teams_uuid?: string | null
          user_uuid?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string
          role?: string | null
          teams_uuid?: string | null
          user_uuid?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_users_teams_uuid_fkey"
            columns: ["teams_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "teams_users_user_uuid_fkey"
            columns: ["user_uuid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tokens: {
        Row: {
          created_at: string
          teams_uuid: string | null
          token: string | null
          uuid: string
        }
        Insert: {
          created_at?: string
          teams_uuid?: string | null
          token?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string
          teams_uuid?: string | null
          token?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "tokens_teams_uuid_fkey"
            columns: ["teams_uuid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["uuid"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      teams_uuid_by_user_id: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      user_exists_in_team: {
        Args: {
          auth_user_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
      user_teams_uuid: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
