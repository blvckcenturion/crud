import { z } from "zod";

// Schema for Provider Insert/Update
const ProviderInsertUpdateSchema = z.object({
  id: z.number().optional(), // Optional for insertions as it's auto-generated
  name: z.string(),
  active: z.boolean().optional(),
  country_id: z.number(), // Foreign key reference to the country
  created_at: z.string(), // Optional as it's auto-generated
  updated_at: z.string() // Optional as it's auto-generated
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