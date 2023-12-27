import { supabase } from "@/lib/client/supabase";
import { ProvidersWithCountryArraySchema } from "@/lib/schemas/provider/schema";
import { z } from "zod";

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