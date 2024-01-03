
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
      countries: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      import_costs: {
        Row: {
          additional_costs: number
          additional_notes: string
          fob_value: number
          id: number
          import_date: string
          land_transport_cost: number | null
          maritime_transport_cost: number | null
          net_value: number
          order_id: number
          provider_id: number
          tax_iva: number
        }
        Insert: {
          additional_costs: number
          additional_notes: string
          fob_value: number
          id?: number
          import_date: string
          land_transport_cost?: number | null
          maritime_transport_cost?: number | null
          net_value: number
          order_id: number
          provider_id: number
          tax_iva: number
        }
        Update: {
          additional_costs?: number
          additional_notes?: string
          fob_value?: number
          id?: number
          import_date?: string
          land_transport_cost?: number | null
          maritime_transport_cost?: number | null
          net_value?: number
          order_id?: number
          provider_id?: number
          tax_iva?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_costs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_costs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean
          alias: string | null
          class: number
          created_at: string
          description: string | null
          format: number
          id: number
          image_url: string | null
          name: string
          provider_id: number | null
          type: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          alias?: string | null
          class: number
          created_at?: string
          description?: string | null
          format: number
          id?: number
          image_url?: string | null
          name: string
          provider_id?: number | null
          type: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          alias?: string | null
          class?: number
          created_at?: string
          description?: string | null
          format?: number
          id?: number
          image_url?: string | null
          name?: string
          provider_id?: number | null
          type?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      providers: {
        Row: {
          active: boolean
          country_id: number
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          country_id: number
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          country_id?: number
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "providers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
      purchase_items: {
        Row: {
          active: boolean
          created_at: string
          id: number
          product_id: number
          purchase_id: number
          qty: number
          unitary_price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          product_id: number
          purchase_id: number
          qty: number
          unitary_price: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          product_id?: number
          purchase_id?: number
          qty?: number
          unitary_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          }
        ]
      }
      purchases: {
        Row: {
          active: boolean
          created_at: string
          id: number
          storage_id: number | null
          type: number
          updated_at: string
        }
        Insert: {
          active: boolean
          created_at?: string
          id?: number
          storage_id?: number | null
          type: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          storage_id?: number | null
          type?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_storage_id_fkey"
            columns: ["storage_id"]
            isOneToOne: false
            referencedRelation: "storage"
            referencedColumns: ["id"]
          }
        ]
      }
      storage: {
        Row: {
          active: boolean
          address: string | null
          branch: number
          created_at: string
          id: number
          name: string
          responsible: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          branch?: number
          created_at?: string
          id?: number
          name: string
          responsible: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          branch?: number
          created_at?: string
          id?: number
          name?: string
          responsible?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_purchase_with_items: {
        Args: {
          purchase_data: Json
          items_data: Json[]
        }
        Returns: undefined
      }
      delete_purchase_with_items: {
        Args: {
          p_id: number
        }
        Returns: undefined
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
