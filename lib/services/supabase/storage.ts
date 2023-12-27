// storageService.ts
import { supabase } from "@/lib/client/supabase";
import { z } from 'zod';
import { StorageRowSchema, StorageInsertSchema, StorageUpdateSchema } from "@/lib/schemas/storage";

// Function to fetch active storage locations
export const fetchActiveStorage = async () => {
  try {
    const { data, error } = await supabase
      .from("storage")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: true });

    if (error) throw error;

    return StorageRowSchema.array().parse(data);
  } catch (error) {
    console.error("Error fetching storage locations:", error);
    throw error;
  }
};

// Function to add a new storage location
export const addNewStorage = async (newStorage: z.infer<typeof StorageInsertSchema>) => {
  try {
    const { data, error } = await supabase
      .from('storage')
      .insert([newStorage]);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error adding new storage location:", error);
    throw error;
  }
};

// Function to update a storage location
export const updateStorage = async ({ storageId, storageData }: { storageId: number, storageData: z.infer<typeof StorageUpdateSchema> }) => {
  try {
    const { data, error } = await supabase
      .from('storage')
      .update({ ...storageData, updated_at: new Date().toISOString() })
      .match({ id: storageId });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating storage location:", error);
    throw error;
  }
};

// Function to deactivate a storage location (set active to false)
export const deactivateStorage = async (storageId: number) => {
  try {
    const { data, error } = await supabase
      .from('storage')
      .update({ active: false, updated_at: new Date().toISOString() })
      .match({ id: storageId });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error deactivating storage location:", error);
    throw error;
  }
};
