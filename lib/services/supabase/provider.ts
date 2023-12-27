import { supabase } from "@/lib/client/supabase";
import { ProviderType, ProvidersWithCountryArraySchema } from "@/lib/schemas/provider/schema";

export const fetchActiveProviders = async () => {
    try {
      const { data, error } = await supabase
        .from("providers")
        .select(`
          *,
          country:country_id (name)
        `)
        .eq("active", true)
        .order("id", { ascending: true });
  
      if (error) throw error;
  
      return ProvidersWithCountryArraySchema.parse(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
      throw error;
    }
};

// Function to "delete" a provider (set active to false)
export const deactivateProvider = async (providerId: number) => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .update({ active: false, updated_at: new Date().toISOString() })
        .match({ id: providerId });
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error("Error deactivating provider:", error);
      throw error;
    }
};

// Function to add a new provider
export const addNewProvider = async (newProvider: ProviderType) => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .insert([newProvider]);
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error("Error adding new provider:", error);
      throw error;
    }
};
  
// Function to update an existing provider
export const updateProvider = async (providerToUpdate: ProviderType) => {
    try {
        const { data, error } = await supabase
        .from('providers')
        .update({ ...providerToUpdate, updated_at: new Date().toISOString() })
        .match({ id: providerToUpdate.id });

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error updating provider:", error);
        throw error;
    }
};