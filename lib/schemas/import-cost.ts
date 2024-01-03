import { z } from 'zod';

// Zod schema for 'import_costs' table row
export const ImportCostsRowSchema = z.object({
    id: z.number(),
    order_id: z.number().refine(val => val !== null, { message: "El ID de orden es requerido." }),
    provider_id: z.number().refine(val => val !== null, { message: "El ID de proveedor es requerido." }),
    providers: z.object({
      name: z.string()
    }).optional(),
    fob_value: z.number().refine(val => val !== null, { message: "El valor FOB es requerido." }),
    maritime_transport_cost: z.number().nullable(),
    land_transport_cost: z.number().nullable(),
    tax_iva: z.number().refine(val => val !== null, { message: "El impuesto IVA es requerido." }),
    net_value: z.number().refine(val => val !== null, { message: "El valor neto es requerido." }),
    additional_costs: z.number().refine(val => val !== null, { message: "Costos adicionales son requeridos." }),
    import_date: z.string().refine(val => val !== null, { message: "La fecha de importación es requerida." }),
    additional_notes: z.string().trim().min(1, "Notas adicionales son requeridas.").refine(val => val !== null, { message: "Notas adicionales son requeridas." }),
    active: z.boolean(),
    created_at: z.string(), // Assuming the date is provided as a string
    updated_at: z.string()  // Assuming the date is provided as a string
});

// Zod schema for inserting a new row into 'import_costs' table
export const ImportCostsInsertSchema = ImportCostsRowSchema.omit({
  id: true, // Automatically generated, not needed on insert
  active: true,
  created_at: true, // Automatically set to NOW(), not needed on insert
  updated_at: true,  // Automatically set to NOW(), not needed on insert
  providers: true
}).partial();

// Zod schema for updating an existing row in 'import_costs' table
export const ImportCostsUpdateSchema = ImportCostsRowSchema.omit({
  id: true, // Cannot change the ID of an existing row
  active: true,
  created_at: true, // Should not update the creation timestamp
  providers: true
}).partial();

// TypeScript types inferred from Zod schemas
export type ImportCostsRow = z.infer<typeof ImportCostsRowSchema>;
export type ImportCostsInsert = z.infer<typeof ImportCostsInsertSchema>;
export type ImportCostsUpdate = z.infer<typeof ImportCostsUpdateSchema>;
