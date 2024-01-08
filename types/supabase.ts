
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
          active: boolean
          albo_customs_logistics: number
          albo_customs_logistics_detail: string | null
          albo_customs_storage: number
          albo_customs_storage_detail: string | null
          aspb_port_expenses: number
          aspb_port_expenses_detail: string | null
          cf_iva: number
          chamber_of_commerce: number
          chamber_of_commerce_detail: string | null
          cif_value: number
          consolidated_tax_duty: number
          consolidated_tax_duty_detail: string | null
          created_at: string
          custom_agent_commissions: number
          custom_agent_commissions_detail: string | null
          djv_forms: number
          djv_forms_detail: string | null
          dui_forms: number
          dui_forms_detail: string | null
          financial_commissions: number
          financial_commissions_detail: string | null
          fob_value: number
          foreign_insurance: number
          foreign_insurance_detail: string | null
          handling_and_storage: number
          handling_and_storage_detail: string | null
          id: number
          insurance: number
          insurance_detail: string | null
          intermediary_commissions: number
          intermediary_commissions_detail: string | null
          land_transportation: number
          land_transportation_detail: string | null
          maritime_transportation: number
          maritime_transportation_detail: string | null
          national_transportation: number
          national_transportation_detail: string | null
          net_total_warehouse_cost: number
          optional_expense_1: number | null
          optional_expense_1_detail: string | null
          optional_expense_2: number | null
          optional_expense_2_detail: string | null
          optional_expense_3: number | null
          optional_expense_3_detail: string | null
          optional_expense_4: number | null
          optional_expense_4_detail: string | null
          optional_expense_5: number | null
          optional_expense_5_detail: string | null
          order_id: number
          other_commissions: number
          other_commissions_detail: string | null
          other_expenses_i: number
          other_expenses_i_detail: string | null
          other_expenses_ii: number
          other_expenses_ii_detail: string | null
          other_expenses_iii: number
          other_expenses_iii_detail: string | null
          other_penalties: number
          other_penalties_detail: string | null
          senasag: number
          senasag_detail: string | null
          specific_consumption_tax_ice: number
          specific_consumption_tax_ice_detail: string | null
          total_warehouse_cost: number
          updated_at: string
          value_added_tax_iva: number
          value_added_tax_iva_detail: string | null
        }
        Insert: {
          active?: boolean
          albo_customs_logistics: number
          albo_customs_logistics_detail?: string | null
          albo_customs_storage: number
          albo_customs_storage_detail?: string | null
          aspb_port_expenses: number
          aspb_port_expenses_detail?: string | null
          cf_iva: number
          chamber_of_commerce: number
          chamber_of_commerce_detail?: string | null
          cif_value: number
          consolidated_tax_duty: number
          consolidated_tax_duty_detail?: string | null
          created_at?: string
          custom_agent_commissions: number
          custom_agent_commissions_detail?: string | null
          djv_forms: number
          djv_forms_detail?: string | null
          dui_forms: number
          dui_forms_detail?: string | null
          financial_commissions: number
          financial_commissions_detail?: string | null
          fob_value: number
          foreign_insurance: number
          foreign_insurance_detail?: string | null
          handling_and_storage: number
          handling_and_storage_detail?: string | null
          id?: number
          insurance: number
          insurance_detail?: string | null
          intermediary_commissions: number
          intermediary_commissions_detail?: string | null
          land_transportation: number
          land_transportation_detail?: string | null
          maritime_transportation: number
          maritime_transportation_detail?: string | null
          national_transportation: number
          national_transportation_detail?: string | null
          net_total_warehouse_cost: number
          optional_expense_1?: number | null
          optional_expense_1_detail?: string | null
          optional_expense_2?: number | null
          optional_expense_2_detail?: string | null
          optional_expense_3?: number | null
          optional_expense_3_detail?: string | null
          optional_expense_4?: number | null
          optional_expense_4_detail?: string | null
          optional_expense_5?: number | null
          optional_expense_5_detail?: string | null
          order_id: number
          other_commissions: number
          other_commissions_detail?: string | null
          other_expenses_i: number
          other_expenses_i_detail?: string | null
          other_expenses_ii: number
          other_expenses_ii_detail?: string | null
          other_expenses_iii: number
          other_expenses_iii_detail?: string | null
          other_penalties: number
          other_penalties_detail?: string | null
          senasag: number
          senasag_detail?: string | null
          specific_consumption_tax_ice: number
          specific_consumption_tax_ice_detail?: string | null
          total_warehouse_cost: number
          updated_at?: string
          value_added_tax_iva: number
          value_added_tax_iva_detail?: string | null
        }
        Update: {
          active?: boolean
          albo_customs_logistics?: number
          albo_customs_logistics_detail?: string | null
          albo_customs_storage?: number
          albo_customs_storage_detail?: string | null
          aspb_port_expenses?: number
          aspb_port_expenses_detail?: string | null
          cf_iva?: number
          chamber_of_commerce?: number
          chamber_of_commerce_detail?: string | null
          cif_value?: number
          consolidated_tax_duty?: number
          consolidated_tax_duty_detail?: string | null
          created_at?: string
          custom_agent_commissions?: number
          custom_agent_commissions_detail?: string | null
          djv_forms?: number
          djv_forms_detail?: string | null
          dui_forms?: number
          dui_forms_detail?: string | null
          financial_commissions?: number
          financial_commissions_detail?: string | null
          fob_value?: number
          foreign_insurance?: number
          foreign_insurance_detail?: string | null
          handling_and_storage?: number
          handling_and_storage_detail?: string | null
          id?: number
          insurance?: number
          insurance_detail?: string | null
          intermediary_commissions?: number
          intermediary_commissions_detail?: string | null
          land_transportation?: number
          land_transportation_detail?: string | null
          maritime_transportation?: number
          maritime_transportation_detail?: string | null
          national_transportation?: number
          national_transportation_detail?: string | null
          net_total_warehouse_cost?: number
          optional_expense_1?: number | null
          optional_expense_1_detail?: string | null
          optional_expense_2?: number | null
          optional_expense_2_detail?: string | null
          optional_expense_3?: number | null
          optional_expense_3_detail?: string | null
          optional_expense_4?: number | null
          optional_expense_4_detail?: string | null
          optional_expense_5?: number | null
          optional_expense_5_detail?: string | null
          order_id?: number
          other_commissions?: number
          other_commissions_detail?: string | null
          other_expenses_i?: number
          other_expenses_i_detail?: string | null
          other_expenses_ii?: number
          other_expenses_ii_detail?: string | null
          other_expenses_iii?: number
          other_expenses_iii_detail?: string | null
          other_penalties?: number
          other_penalties_detail?: string | null
          senasag?: number
          senasag_detail?: string | null
          specific_consumption_tax_ice?: number
          specific_consumption_tax_ice_detail?: string | null
          total_warehouse_cost?: number
          updated_at?: string
          value_added_tax_iva?: number
          value_added_tax_iva_detail?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_costs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          }
        ]
      }
      import_costs_detail: {
        Row: {
          active: boolean
          created_at: string
          id: number
          import_costs_id: number
          product_id: number
          unit_cost: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          import_costs_id: number
          product_id: number
          unit_cost: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          import_costs_id?: number
          product_id?: number
          unit_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_costs_detail_import_costs_id_fkey"
            columns: ["import_costs_id"]
            isOneToOne: false
            referencedRelation: "import_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_costs_detail_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
          address: string | null
          city: string | null
          contact_person: string | null
          country_id: number
          created_at: string
          email: string | null
          fax: string | null
          id: number
          location: string | null
          name: string
          nit: string | null
          payment: number
          phones: string | null
          social_reason: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          city?: string | null
          contact_person?: string | null
          country_id: number
          created_at?: string
          email?: string | null
          fax?: string | null
          id?: number
          location?: string | null
          name?: string
          nit?: string | null
          payment: number
          phones?: string | null
          social_reason?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          city?: string | null
          contact_person?: string | null
          country_id?: number
          created_at?: string
          email?: string | null
          fax?: string | null
          id?: number
          location?: string | null
          name?: string
          nit?: string | null
          payment?: number
          phones?: string | null
          social_reason?: string | null
          updated_at?: string
          website?: string | null
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
          has_import_costs: boolean
          id: number
          provider_id: number | null
          storage_id: number | null
          type: number
          updated_at: string
        }
        Insert: {
          active: boolean
          created_at?: string
          has_import_costs?: boolean
          id?: number
          provider_id?: number | null
          storage_id?: number | null
          type: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          has_import_costs?: boolean
          id?: number
          provider_id?: number | null
          storage_id?: number | null
          type?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
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
          phones: string | null
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
          phones?: string | null
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
          phones?: string | null
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
      create_import_costs_with_details: {
        Args: {
          import_costs_data: Json
          import_costs_details_data: Json[]
        }
        Returns: undefined
      }
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
