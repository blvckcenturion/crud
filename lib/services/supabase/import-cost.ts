// importCostsService.ts
import { supabase } from "@/lib/client/supabase";
import { 
  ImportCostsRowSchema, ImportCostsWithDetailsAndProviderSchema, InsertImportCostsDetailSchema, InsertImportCostsSchema,
} from "@/lib/schemas/import-cost";


interface CreateImportCostsWithDetailsParams {
  importCosts: InsertImportCostsSchema,
  details: InsertImportCostsDetailSchema[]
}

// Function to fetch active import costs with details and provider's name
export const fetchActiveImportCosts = async () => {
  try {
    const { data, error } = await supabase
      .from("import_costs")
      .select(`
        *,
        import_costs_detail(
          *,
          product:product_id (name)
        ),
        purchases (
          *,
          provider:provider_id (name)
        )
      `)
      .eq("active", true)
      .order("id", { ascending: true });

    if (error) throw error;

    // Transform the data to include provider's name and product names
    const transformedData = data.map(cost => ({
      ...cost,
      providerName: cost.purchases?.provider?.name,
      import_costs_detail: cost.import_costs_detail?.map((detail: any) => ({
        ...detail,
        productName: detail.product?.name
      })) ?? []
    }));

    console.log(transformedData)

    // Validate the transformed data against the updated schema
    return ImportCostsWithDetailsAndProviderSchema.array().parse(transformedData);
  } catch (error) {
    console.error("Error fetching import costs:", error);
    throw error;
  }
};


// Function to add a new import cost
export const addNewImportCost = async (params: CreateImportCostsWithDetailsParams) => {
  const { importCosts, details } = params

  console.log(importCosts, details)

  try {

    const { data, error } = await supabase.rpc('create_import_costs_with_details', {
      import_costs_data: importCosts,
      import_costs_details_data: details
    })

    if (error) {
      console.error("Error creating import costs with items:", error);
      throw error;
    }
    // const { data, error } = await supabase
    //   .from('import_costs')
    //   .insert([newImportCost]);

    // if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error adding new import cost:", error);
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
