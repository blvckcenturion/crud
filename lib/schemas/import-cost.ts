import { z } from 'zod';

export const ImportCostsRowSchema = z.object({
    id: z.number(),
    order_id: z.number().refine(val => val !== null, { message: "El ID de orden es requerido." }),
    active: z.boolean(),
    created_at: z.string(), // Assuming the date is provided as a string
    updated_at: z.string(), // Assuming the date is provided as a string
    maritime_transportation: z.number().refine(val => val >= 0, { message: "Transporte Marítimo debe ser un valor positivo." }),
    maritime_transportation_detail: z.string().optional(),
    land_transportation: z.number().refine(val => val >= 0, { message: "Transporte Terrestre debe ser un valor positivo." }),
    land_transportation_detail: z.string().optional(),
    foreign_insurance: z.number().refine(val => val >= 0, { message: "Seguro Exterior debe ser un valor positivo." }),
    foreign_insurance_detail: z.string().optional(),
    aspb_port_expenses: z.number().refine(val => val >= 0, { message: "Gastos Portuarios ASPB debe ser un valor positivo." }),
    aspb_port_expenses_detail: z.string().optional(),
    intermediary_commissions: z.number().refine(val => val >= 0, { message: "Comisiones Intermediarios debe ser un valor positivo." }),
    intermediary_commissions_detail: z.string().optional(),
    other_expenses_i: z.number().refine(val => val >= 0, { message: "Otros Gastos I debe ser un valor positivo." }),
    other_expenses_i_detail: z.string().optional(),
    consolidated_tax_duty: z.number().refine(val => val >= 0, { message: "Gravamen Impuesto Consolidado (GAC) debe ser un valor positivo." }),
    consolidated_tax_duty_iva: z.number().refine(val => val >= 0, { message: "Gravamen Impuesto Consolidado (GAC) IVA debe ser un valor positivo." }),
    consolidated_tax_duty_detail: z.string().optional(),
    value_added_tax_iva: z.number().refine(val => val >= 0, { message: "Impuesto al Valor Agregado (IVA) debe ser un valor positivo." }),
    value_added_tax_iva_iva: z.number().refine(val => val >= 0, { message: "Impuesto al Valor Agregado (IVA) IVA debe ser un valor positivo." }),
    value_added_tax_iva_detail: z.string().optional(),
    specific_consumption_tax_ice: z.number().refine(val => val >= 0, { message: "Impuesto al Consumo Especifico (ICE) debe ser un valor positivo." }),
    specific_consumption_tax_ice_iva: z.number().refine(val => val >= 0, { message: "Impuesto al Consumo Especifico (ICE) IVA debe ser un valor positivo." }),
    specific_consumption_tax_ice_detail: z.string().optional(),
    other_penalties: z.number().refine(val => val >= 0, { message: "Contravenciones Otros debe ser un valor positivo." }),
    other_penalties_iva: z.number().refine(val => val >= 0, { message: "Contravenciones Otros IVA debe ser un valor positivo." }),
    other_penalties_detail: z.string().optional(),
    albo_customs_storage: z.number().refine(val => val >= 0, { message: "Almacenaje Aduana ALBO S.A. debe ser un valor positivo." }),
    albo_customs_storage_iva: z.number().refine(val => val >= 0, { message: "Almacenaje Aduana ALBO S.A. IVA debe ser un valor positivo." }),
    albo_customs_storage_detail: z.string().optional(),
    albo_customs_logistics: z.number().refine(val => val >= 0, { message: "Logística Aduana ALBO S.A. debe ser un valor positivo." }),
    albo_customs_logistics_iva: z.number().refine(val => val >= 0, { message: "Logística Aduana ALBO S.A. IVA debe ser un valor positivo." }),
    albo_customs_logistics_detail: z.string().optional(),
    dui_forms: z.number().refine(val => val >= 0, { message: "Formularios DUI debe ser un valor positivo." }),
    dui_forms_iva: z.number().refine(val => val >= 0, { message: "Formularios DUI IVA debe ser un valor positivo." }),
    dui_forms_detail: z.string().optional(),
    djv_forms: z.number().refine(val => val >= 0, { message: "Formularios DJV debe ser un valor positivo." }),
    djv_forms_iva: z.number().refine(val => val >= 0, { message: "Formularios DJV IVA debe ser un valor positivo." }),
    djv_forms_detail: z.string().optional(),
    other_expenses_ii: z.number().refine(val => val >= 0, { message: "Otros Gastos II debe ser un valor positivo." }),
    other_expenses_ii_iva: z.number().refine(val => val >= 0, { message: "Otros Gastos II IVA debe ser un valor positivo." }),
    other_expenses_ii_detail: z.string().optional(),
    chamber_of_commerce: z.number().refine(val => val >= 0, { message: "Cámara de Comercio debe ser un valor positivo." }),
    chamber_of_commerce_iva: z.number().refine(val => val >= 0, { message: "Cámara de Comercio IVA debe ser un valor positivo." }),
    chamber_of_commerce_detail: z.string().optional(),
    senasag: z.number().refine(val => val >= 0, { message: "Senasag debe ser un valor positivo." }),
    senasag_iva: z.number().refine(val => val >= 0, { message: "Senasag IVA debe ser un valor positivo." }),
    senasag_detail: z.string().optional(),
    custom_agent_commissions: z.number().refine(val => val >= 0, { message: "Comisiones Agente Despachante Aduana debe ser un valor positivo." }),
    custom_agent_commissions_iva: z.number().refine(val => val >= 0, { message: "Comisiones Agente Despachante IVA Aduana debe ser un valor positivo." }),
    custom_agent_commissions_detail: z.string().optional(),
    financial_commissions: z.number().refine(val => val >= 0, { message: "Comisiones Financieras debe ser un valor positivo." }),
    financial_commissions_iva: z.number().refine(val => val >= 0, { message: "Comisiones Financieras IVA debe ser un valor positivo." }),
    financial_commissions_detail: z.string().optional(),
    other_commissions: z.number().refine(val => val >= 0, { message: "Otras Comisiones debe ser un valor positivo." }),
    other_commissions_iva: z.number().refine(val => val >= 0, { message: "Otras Comisiones IVA debe ser un valor positivo." }),
    other_commissions_detail: z.string().optional(),
    national_transportation: z.number().refine(val => val >= 0, { message: "Transporte Nacional debe ser un valor positivo." }),
    national_transportation_iva: z.number().refine(val => val >= 0, { message: "Transporte Nacional IVA debe ser un valor positivo." }),
    national_transportation_detail: z.string().optional(),
    insurance: z.number().refine(val => val >= 0, { message: "Seguros debe ser un valor positivo." }),
    insurance_iva: z.number().refine(val => val >= 0, { message: "Seguros IVA debe ser un valor positivo." }),
    insurance_detail: z.string().optional(),
    handling_and_storage: z.number().refine(val => val >= 0, { message: "Cargos y Manipuleo debe ser un valor positivo." }),
    handling_and_storage_iva: z.number().refine(val => val >= 0, { message: "Cargos y Manipuleo IVA debe ser un valor positivo." }),
    handling_and_storage_detail: z.string().optional(),
    other_expenses_iii: z.number().refine(val => val >= 0, { message: "Otros Gastos III debe ser un valor positivo." }),
    other_expenses_iii_iva: z.number().refine(val => val >= 0, { message: "Otros Gastos III IVA debe ser un valor positivo." }),
    other_expenses_iii_detail: z.string().optional(),
    optional_expense_1: z.number().refine(val => val >= 0, { message: "Gasto opcional 1 debe ser un valor positivo." }),
    optional_expense_1_iva: z.number().refine(val => val >= 0, { message: "Gasto opcional 1 IVA debe ser un valor positivo." }),
    optional_expense_1_detail: z.string().optional(),
    optional_expense_2: z.number().refine(val => val >= 0, { message: "Gasto opcional 2 debe ser un valor positivo." }),
    optional_expense_2_iva: z.number().refine(val => val >= 0, { message: "Gasto opcional 2 IVA debe ser un valor positivo." }),
    optional_expense_2_detail: z.string().optional(),
    optional_expense_3: z.number().refine(val => val >= 0, { message: "Gasto opcional 3 debe ser un valor positivo." }),
    optional_expense_3_iva: z.number().refine(val => val >= 0, { message: "Gasto opcional 3 IVA debe ser un valor positivo." }),
    optional_expense_3_detail: z.string().optional(),
    optional_expense_4: z.number().refine(val => val >= 0, { message: "Gasto opcional 4 debe ser un valor positivo." }),
    optional_expense_4_iva: z.number().refine(val => val >= 0, { message: "Gasto opcional 4 IVA debe ser un valor positivo." }),
    optional_expense_4_detail: z.string().optional(),
    optional_expense_5: z.number().refine(val => val >= 0, { message: "Gasto opcional 5 debe ser un valor positivo." }),
    optional_expense_5_iva: z.number().refine(val => val >= 0, { message: "Gasto opcional 4 IVA debe ser un valor positivo." }),
    optional_expense_5_detail: z.string().optional(),
    fob_value: z.number(),
    cif_value: z.number(),
    total_warehouse_cost: z.number(),
    cf_iva: z.number().refine(val => val >= 0, { message: "CF IVA debe ser un valor positivo." }),
    net_total_warehouse_cost: z.number(),
    net_total_warehouse_cost_calculated: z.number()
    
});

export const ImportCostsDetailRowSchema = z.object({
  id: z.number(),
  active: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  product_id: z.number(),
  productName: z.string(),
  import_costs_id: z.number(),
  unit_cost: z.number(),
})

// Type for retrieval
export const ImportCostsWithDetailSchema = ImportCostsRowSchema.extend({
  import_costs_details: z.array(ImportCostsDetailRowSchema).optional()
})

// TypeScript types inferred from Zod schemas
export type ImportCostsRow = z.infer<typeof ImportCostsRowSchema>;
export type ImportCostsDetailRowSchema = z.infer<typeof ImportCostsDetailRowSchema>;
export type ImportCostsWithDetailSchema = z.infer<typeof ImportCostsWithDetailSchema>;

// Insert values
export const InsertImportCostsSchema = ImportCostsRowSchema.omit({
  id: true,
  active: true,
  created_at: true,
  updated_at: true
});

export type InsertImportCostsSchema = z.infer<typeof InsertImportCostsSchema>

export const InsertImportCostsDetailSchema = ImportCostsDetailRowSchema.omit({
  id: true,
  active: true,
  created_at: true,
  updated_at: true,
  productName: true,
  import_costs_id: true
})


export type InsertImportCostsDetailSchema = z.infer<typeof InsertImportCostsDetailSchema>;

// to pass to the function that will calculate the final values
export const ImportCostsFormSchema = ImportCostsRowSchema.omit({
  id: true,
  active: true,
  created_at: true,
  updated_at: true,
  fob_value: true,
  cif_value: true,
  total_warehouse_cost: true,
  net_total_warehouse_cost: true,
  net_total_warehouse_cost_calculated:true
});

export type ImportCostsFormSchema = z.infer<typeof ImportCostsFormSchema>;

export const ImportCostsDetailFormSchema = z.object({
  product_id: z.number(),
  qty: z.number(),
  unitary_price: z.number(),
  coefficient_value: z.number()
})

export type ImportCostsDetailFormSchema = z.infer<typeof ImportCostsDetailFormSchema>;

// Step 1
// Calculate FOB
// You calculate the FOB by summing all the ImportCostsDetailFormSchemas 
// FOB = SUM(ImportCostsDetailFormSchema(qty * unitary_price))

// 1.1 Calculate the distribution coefficient for each item
// coefficient_item_1 = subtotal_1 / FOB
// coefficient_item_2 = subtotal_2 / FOB
// coefficient_item_3 = subtotal_3 / FOB

// Step 2
// Calculate CIF
// CIF = FOB + maritime_transportation + land_transportation + foreign_insurance + aspb_port_expenses + intermediary_commissions + other_expenses_i

// Step 3
// Calculate net_total_warehouse_cost
// NTWC = TWC - CF_IVA

// Step 4
// Calculate Unitary costs


// 4.2 Calculate Unitary costs
// unitary_cost_item_1 = coefficient_item_1 * NTWC
// unitary_cost_item_2 = coefficient_item_2 * NTWC
// unitary_cost_item_3 = coefficient_item_3 * NTWC

// For calculation results
export const IntermediateImportCostsDetailReturnSchema = z.object({
  product_id: z.number(),
  unit_costs: z.number()
})

export const IntermediateImportCostsReturnSchema = z.object({
  fob_value: z.number(),
  cif_value: z.number(),
  total_warehouse_cost: z.number(),
  net_total_warehouse_cost: z.number(),
  net_total_warehouse_cost_calculated: z.number(),
  import_cost_details: z.array(InsertImportCostsDetailSchema)
});

export type IntermediateImportCostsReturnSchema = z.infer<typeof IntermediateImportCostsReturnSchema>;

// Schema to represent import costs with details and provider's name
export const ImportCostsWithDetailsAndProviderSchema = ImportCostsRowSchema.extend({
  import_costs_detail: z.array(ImportCostsDetailRowSchema.extend({
    productName: z.string().optional()
  })).optional(),
  providerName: z.string().optional()
});

// Update TypeScript types
export type ImportCostsWithDetailsAndProvider = z.infer<typeof ImportCostsWithDetailsAndProviderSchema>;