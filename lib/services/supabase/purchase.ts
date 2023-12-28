import { supabase } from "@/lib/client/supabase";
import { PurchaseInsert, PurchaseInsertSchema, PurchaseItemExtended, PurchaseItemExtendedSchema, PurchaseItemInsert, PurchaseItemInsertSchema, PurchaseItemSchema, PurchaseSchema, PurchaseUpdate, PurchaseUpdateSchema, PurchaseWithItemsExtended } from "@/lib/schemas/purchase";

// Function to fetch active purchases with their active items
export const fetchActivePurchasesWithItems = async (): Promise<PurchaseWithItemsExtended[]> => {
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          purchase_items (
            *,
            active.eq.true
          )
        `)
        .eq("active", true)
        .order("id", { ascending: true });

      if (error) throw error;

      // Check if data is in the expected format
      if (!Array.isArray(data)) {
        throw new Error("Unexpected data format");
      }

      // Transform purchase_items to include the extended flags
      const transformedData = data.map((purchase: any) => ({
        ...purchase,
        purchase_items: purchase.purchase_items?.map((item: any) => ({
          ...item,
          isNew: false,
          isModified: false,
          isDeleted: false
        })) ?? []
      }));

      return transformedData as PurchaseWithItemsExtended[];
    } catch (error) {
      console.error("Error fetching purchases with items:", error);
      throw error;
    }
};


export const createPurchaseWithItems = async (purchaseData: PurchaseInsert, itemsData: PurchaseItemInsert[]) => {
    try {
      // Validate data
      PurchaseInsertSchema.parse(purchaseData);
      PurchaseItemInsertSchema.array().parse(itemsData);

      // RPC call to create purchase with items
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

// Function to update a purchase and manage its items
export const updatePurchaseWithItems = async (purchaseId: number, purchaseData: PurchaseUpdate, items: PurchaseItemExtended[]) => {
    try {
      // Validate purchase data
      PurchaseUpdateSchema.parse(purchaseData);

      // Begin a transaction
      const { data, error: updateError } = await supabase
        .from('purchases')
        .update(purchaseData)
        .match({ id: purchaseId });

      if (updateError) throw updateError;

      // Process each item
      for (const item of items) {
        // Validate each item
        PurchaseItemExtendedSchema.parse(item);

        if (item.isNew) {
          // Insert new item
          const { error: insertError } = await supabase.from('purchase_items').insert([{ ...item, purchase_id: purchaseId }]);
          if (insertError) throw insertError;
        } else if (item.isModified) {
          // Update existing item
          const { error: updateItemError } = await supabase.from('purchase_items').update(item).match({ id: item.id });
          if (updateItemError) throw updateItemError;
        } else if (item.isDeleted) {
          // Deactivate or delete item
          const { error: deleteError } = await supabase.from('purchase_items').update({ active: false }).match({ id: item.id });
          if (deleteError) throw deleteError;
        }
      }

      return { purchaseId, purchaseData, items };
    } catch (error) {
      console.error("Error updating purchase with items:", error);
      throw error;
    }
};

export const deletePurchaseWithItems = async (purchaseId: number) => {
    try {
      // RPC call to delete purchase with items
      const { error } = await supabase.rpc('delete_purchase_with_items', {
        purchase_id: purchaseId
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting purchase and its items:", error);
      throw error;
    }
};