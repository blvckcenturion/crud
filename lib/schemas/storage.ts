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
  name: z.string(),
  responsible: z.string(),
  updated_at: z.string()
});

// Zod schema for inserting a new row into 'storage' table
export const StorageInsertSchema = StorageRowSchema.omit({
  id: true, // ID is auto-generated, so it's omitted in insert schema
  created_at: true, // Created_at is auto-generated, so it's omitted
  updated_at: true  // Updated_at is auto-generated, so it's omitted
}).partial(); // Partial because not all fields might be necessary for an insert

// Zod schema for updating an existing row in 'storage' table
export const StorageUpdateSchema = StorageRowSchema.omit({
  id: true, // ID should not be updated, so it's omitted
  created_at: true // Created_at should not be updated, so it's omitted
}).partial(); // Partial because not all fields need to be present for an update

// TypeScript types inferred from Zod schemas
export type StorageRow = z.infer<typeof StorageRowSchema>;
export type StorageInsert = z.infer<typeof StorageInsertSchema>;
export type StorageUpdate = z.infer<typeof StorageUpdateSchema>;