import { z } from 'zod';

// Enum for the 'branch' column with departments of Bolivia
export const BranchEnum = z.enum([
  'Cochabamba', 'La Paz', 'Santa Cruz',
  'Oruro', 'Potosi', 'Tarija',
  'Beni', 'Pando', 'Chuquisaca'
]);

// Zod schema for 'storage' table row
export const StorageRowSchema = z.object({
  active: z.boolean(),
  address: z.string().nullable(),
  branch: BranchEnum,
  created_at: z.string(),
  id: z.number(),
  name: z.string().trim().min(1, "El nombre es obligatorio."),
  responsible: z.string().trim().min(1, "El responsable es obligatorio."),
  updated_at: z.string()
});


// Zod schema for inserting a new row into 'storage' table
export const StorageInsertSchema = StorageRowSchema.omit({
  id: true, created_at: true, updated_at: true
}).partial().extend({
  name: z.string().trim().min(1, "El nombre es obligatorio.").optional(),
  responsible: z.string().trim().min(1, "El responsable es obligatorio.").optional(),
  branch: BranchEnum.optional().refine(val => val !== undefined, {
    message: "La sucursal es obligatoria."
  }),
});

// Zod schema for updating an existing row in 'storage' table
export const StorageUpdateSchema = StorageRowSchema.omit({
  id: true, created_at: true
}).partial().extend({
  name: z.string().trim().min(1, "El nombre es obligatorio.").optional(),
  responsible: z.string().trim().min(1, "El responsable es obligatorio.").optional(),
  branch: BranchEnum.optional().refine(val => val !== undefined, {
    message: "La sucursal es obligatoria."
  }),
});
// TypeScript types inferred from Zod schemas
export type StorageRow = z.infer<typeof StorageRowSchema>;
export type StorageInsert = z.infer<typeof StorageInsertSchema>;
export type StorageUpdate = z.infer<typeof StorageUpdateSchema>;

export const branchNumericalMapping: Record<string, number> = {
  "Cochabamba": 1,
  "La Paz": 2,
  "Santa Cruz": 3,
  "Oruro": 4,
  "Potosi": 5,
  "Tarija": 6,
  "Beni": 7,
  "Pando": 8,
  "Chuquisaca": 9
};

export const branchReverseMapping: Record<number, string> = {
  1: "Cochabamba",
  2: "La Paz",
  3: "Santa Cruz",
  4: "Oruro",
  5: "Potosi",
  6: "Tarija",
  7: "Beni",
  8: "Pando",
  9: "Chuquisaca"
};