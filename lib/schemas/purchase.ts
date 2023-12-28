import { z } from 'zod';

export const PurchaseSchema = z.object({
  id: z.number().optional(),
  active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  storage_id: z.number(),
  value: z.number().min(0, "El valor debe ser positivo.")
});

export const PurchaseInsertSchema = PurchaseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
}).partial();

export const PurchaseUpdateSchema = PurchaseSchema.omit({
  id: true,
  created_at: true
}).partial();

export type Purchase = z.infer<typeof PurchaseSchema>;
export type PurchaseInsert = z.infer<typeof PurchaseInsertSchema>;
export type PurchaseUpdate = z.infer<typeof PurchaseUpdateSchema>;

export const PurchaseItemSchema = z.object({
    id: z.number().optional(),
    active: z.boolean().default(true),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    product_id: z.number(),
    purchase_id: z.number(),
    qty: z.number().min(1, "La cantidad debe ser al menos 1.")
});
  
export const PurchaseItemInsertSchema = PurchaseItemSchema.omit({
    id: true,
    created_at: true,
    updated_at: true
}).partial();
  
export const PurchaseItemUpdateSchema = PurchaseItemSchema.omit({
    id: true,
    created_at: true
}).partial();

export type PurchaseItem = z.infer<typeof PurchaseItemSchema>;
export type PurchaseItemInsert = z.infer<typeof PurchaseItemInsertSchema>;
export type PurchaseItemUpdate = z.infer<typeof PurchaseItemUpdateSchema>;

export const PurchaseWithItemsSchema = PurchaseSchema.extend({
    purchase_items: z.array(PurchaseItemSchema).optional()
  });
  
  export type PurchaseWithItems = z.infer<typeof PurchaseWithItemsSchema>;
  