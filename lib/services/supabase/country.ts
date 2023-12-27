import { supabase } from "@/lib/client/supabase";

// Function to fetch countries
export const fetchCountries = async () => {
    try {
      const { data, error } = await supabase.from("countries").select("id, name");
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
};