import { z } from "zod";

// Enum for payment options
const PaymentEnum = z.enum(['contado', 'credito']);

// Numerical mapping for payment options
const paymentNumericalMapping: Record<string, number> = {
  "contado": 1,
  "credito": 2,
};

// Reverse mapping for payment options
const paymentReverseMapping: Record<number, string> = {
  1: "contado",
  2: "credito",
};

// Schema for Provider Insert/Update
const ProviderInsertUpdateSchema = z.object({
  id: z.number().optional(), // Optional for insertions as it's auto-generated
  name: z.string().trim().min(1, "El nombre del proveedor es obligatorio."),
  active: z.boolean().optional(),
  country_id: z.number().refine(val => val !== null && val !== undefined, {
    message: "El país es obligatorio."
  }), // Foreign key reference to the country
  created_at: z.string().optional(), // Auto-generated
  updated_at: z.string().optional(), // Auto-generated
  social_reason: z.string().nullable(),
  nit: z.string().nullable(),
  address: z.string().nullable(),
  location: z.string().nullable(),
  city: z.string().nullable(),
  phones: z.string().nullable(),
  fax: z.string().nullable(),
  email: z.string().nullable(),
  contact_person: z.string().nullable(),
  website: z.string().nullable(),
  payment: z.number(), // Using the PaymentEnum for the payment field
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
  ProvidersWithCountryArraySchema,
  PaymentEnum,
  paymentNumericalMapping,
  paymentReverseMapping
};