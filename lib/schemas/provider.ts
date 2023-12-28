import { z } from "zod";

// Schema for Provider Insert/Update
const ProviderInsertUpdateSchema = z.object({
  id: z.number().optional(), // Optional for insertions as it's auto-generated
  name: z.string().trim().min(1, "El nombre del proveedor es obligatorio."),
  active: z.boolean().optional(),
  country_id: z.number().refine(val => val !== null && val !== undefined, {
    message: "El país es obligatorio."
  }), // Foreign key reference to the country
  created_at: z.string().optional(), // Auto-generated
  updated_at: z.string().optional() // Auto-generated
});

// Schema for Provider Retrieval (including country name)
const ProviderWithCountrySchema = ProviderInsertUpdateSchema.extend({
  country: z.object({
    name: z.string(),
  }),
});

// Array Schemas for multiple providers
const ProvidersArrayInsertUpdateSchema = z.array(ProviderInsertUpdateSchema);
const ProvidersWithCountryArraySchema = z.array(ProviderWithCountrySchema);

export type ProviderType = z.infer<typeof ProviderInsertUpdateSchema>;
export type ProviderWithCountryType = z.infer<typeof ProviderWithCountrySchema>;

export {
  ProviderInsertUpdateSchema,
  ProviderWithCountrySchema,
  ProvidersArrayInsertUpdateSchema,
  ProvidersWithCountryArraySchema
};