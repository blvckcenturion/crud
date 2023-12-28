import { z } from 'zod';

// Enum for Purchase Type
export const PurchaseTypeEnum = z.enum(['nacional', 'internacional']);

// Updated Purchase Schema
export const PurchaseSchema = z.object({
  id: z.number().optional(),
  active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  storage_id: z.number().nullable(), // Nullable storage_id
  type: PurchaseTypeEnum // Purchase type
});

export const PurchaseInsertSchema = PurchaseSchema.omit({
  id: true, created_at: true, updated_at: true
}).partial();

export const PurchaseUpdateSchema = PurchaseSchema.omit({
  id: true, created_at: true
}).partial();

// Updated Purchase Item Schema
export const PurchaseItemSchema = z.object({
  id: z.number().optional(),
  active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  product_id: z.number(),
  purchase_id: z.number(),
  qty: z.number().min(1, "La cantidad debe ser al menos 1."),
  unitary_price: z.number().min(0, "El precio unitario debe ser positivo.") // Added unitary_price
});

export const PurchaseItemInsertSchema = PurchaseItemSchema.omit({
  id: true, created_at: true, updated_at: true
}).partial();

export const PurchaseItemUpdateSchema = PurchaseItemSchema.omit({
  id: true, created_at: true
}).partial();

// Extended Schemas and Types
export type Purchase = z.infer<typeof PurchaseSchema>;
export type PurchaseInsert = z.infer<typeof PurchaseInsertSchema>;
export type PurchaseUpdate = z.infer<typeof PurchaseUpdateSchema>;
export type PurchaseItem = z.infer<typeof PurchaseItemSchema>;
export type PurchaseItemInsert = z.infer<typeof PurchaseItemInsertSchema>;
export type PurchaseItemUpdate = z.infer<typeof PurchaseItemUpdateSchema>;

// Purchase with Items Schema
export const PurchaseWithItemsSchema = PurchaseSchema.extend({
  purchase_items: z.array(PurchaseItemSchema).optional()
});
export type PurchaseWithItems = z.infer<typeof PurchaseWithItemsSchema>;

// Extended Schema for Front-End Use
export const PurchaseItemExtendedSchema = PurchaseItemSchema.extend({
  isNew: z.boolean().optional(),
  isModified: z.boolean().optional(),
  isDeleted: z.boolean().optional()
});
export type PurchaseItemExtended = z.infer<typeof PurchaseItemExtendedSchema>;

export const PurchaseWithItemsExtendedSchema = PurchaseSchema.extend({
  purchase_items: z.array(PurchaseItemExtendedSchema).optional()
});
export type PurchaseWithItemsExtended = z.infer<typeof PurchaseWithItemsExtendedSchema>;

// Validation Example
const validatePurchaseItem = (item: PurchaseItemExtended) => {
  try {
    PurchaseItemExtendedSchema.parse(item);
    // Valid item with front-end flags
  } catch (error) {
    console.error(error);
    // Handle validation errors
  }
};

// Mapping from Enum to Numeric Values
export const PurchaseTypeNumericalMapping: Record<string, number> = {
  'nacional': 1,
  'internacional': 2
};