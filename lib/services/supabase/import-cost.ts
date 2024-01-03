// importCostsService.ts
import { supabase } from "@/lib/client/supabase";
import { z } from 'zod';
import { 
  ImportCostsRowSchema, 
  ImportCostsInsertSchema, 
  ImportCostsUpdateSchema 
} from "@/lib/schemas/import-cost";

// Function to fetch active import costs with provider's name
export const fetchActiveImportCosts = async () => {
  try {
    const { data, error } = await supabase
      .from("import_costs")
      .select(`
        *,
        providers(name)
      `)
      .eq("active", true)
      .order("id", { ascending: true });

    if (error) throw error;

    // Parse the data to ensure it matches the schema
    return ImportCostsRowSchema.array().parse(data);
  } catch (error) {
    console.error("Error fetching import costs:", error);
    throw error;
  }
};

// Function to add a new import cost
export const addNewImportCost = async (newImportCost: z.infer<typeof ImportCostsInsertSchema>) => {
  try {
    const { data, error } = await supabase
      .from('import_costs')
      .insert([newImportCost]);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error adding new import cost:", error);
    throw error;
  }
};

// Function to update an import cost
export const updateImportCost = async ({ importCostId, importCostData }: { importCostId: number, importCostData: z.infer<typeof ImportCostsUpdateSchema> }) => {
  try {
    const { data, error } = await supabase
      .from('import_costs')
      .update({ ...importCostData, updated_at: new Date().toISOString() })
      .match({ id: importCostId });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating import cost:", error);
    throw error;
  }
};

// Function to deactivate an import cost (set active to false)
export const deactivateImportCost = async (importCostId: number) => {
  try {
    const { data, error } = await supabase
      .from('import_costs')
      .update({ active: false, updated_at: new Date().toISOString() })
      .match({ id: importCostId });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error deactivating import cost:", error);
    throw error;
  }
};
