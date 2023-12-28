import { supabase } from "@/lib/client/supabase";
import { PurchaseInsert, PurchaseInsertSchema, PurchaseItemInsert, PurchaseItemInsertSchema, PurchaseSchema, PurchaseWithItemsSchema } from "@/lib/schemas/purchase";
import { z } from "zod";

// Function to fetch active purchases with their active items
export const fetchActivePurchasesWithItems = async () => {
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          purchase_items (
            * 
            ) 
            where active = true
          )
        `)
        .eq("active", true)
        .order("id", { ascending: true });
  
      if (error) throw error;
  
      return PurchaseWithItemsSchema.array().parse(data);
    } catch (error) {
      console.error("Error fetching purchases with items:", error);
      throw error;
    }
};

export const createPurchaseWithItems = async (purchaseData: PurchaseInsert, itemsData: PurchaseItemInsert[]) => {
    try {
      // Start a transaction
      const { data, error } = await supabase.rpc('create_purchase_with_items', {
        purchase: purchaseData,
        items: itemsData
      });
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating purchase with items:", error);
      throw error;
    }
};



export const deletePurchaseWithItems = async (purchaseId: number) => {
    try {
      // Start a transaction
      const { error } = await supabase.rpc('delete_purchase_with_items', {
        purchase_id: purchaseId
      });
  
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting purchase and its items:", error);
      throw error;
    }
};