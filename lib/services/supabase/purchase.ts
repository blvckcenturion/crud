import { supabase } from "@/lib/client/supabase";
import { PurchaseInsert, PurchaseInsertSchema, PurchaseItemExtended, PurchaseItemExtendedSchema, PurchaseItemInsert, PurchaseItemInsertSchema, PurchaseItemSchema, PurchaseSchema, PurchaseUpdate, PurchaseUpdateSchema, PurchaseWithItemsExtended } from "@/lib/schemas/purchase";

interface CreatePurchaseWithItemsParams {
  purchaseData: PurchaseInsert;
  itemsData: PurchaseItemInsert[];
}

// Interface for updatePurchaseWithItems function
interface UpdatePurchaseWithItemsParams {
  purchaseId: number;
  purchaseData: PurchaseUpdate;
  items: PurchaseItemExtended[];
}

// Function to fetch active purchases with their active items
export const fetchActivePurchasesWithItems = async (): Promise<PurchaseWithItemsExtended[]> => {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        storage:storage_id (name),
        purchase_items (
          *,
          product:product_id (name)
        )
      `)
      .eq('active', true)
      .order('id', { ascending: true });

    if (error) throw error;

    // Check if data is in the expected format
    if (!Array.isArray(data)) {
      throw new Error('Unexpected data format');
    }

    // Transform purchase_items to include the extended flags
    const transformedData = data.map((purchase) => ({
      ...purchase,
      storageName: purchase.storage?.name,
      purchase_items: purchase.purchase_items?.map((item: any) => ({
        ...item,
        isNew: false,
        isModified: false,
        isDeleted: false,
        productName: item.product?.name
      })) ?? []
    }));

    return transformedData as PurchaseWithItemsExtended[];
  } catch (error) {
    console.error('Error fetching purchases with items:', error);
    throw error;
  }
};

// Function to create purchase with items using an interface
export const createPurchaseWithItems = async (params: CreatePurchaseWithItemsParams) => {
  const { purchaseData, itemsData } = params;

  try {
    console.log("purchaseData", purchaseData)
    console.log("itemsData", itemsData)


    // RPC call to create purchase with items
    // Ensure the parameter names match the expected names in your database function
    const { data, error } = await supabase.rpc('create_purchase_with_items', {
      purchase_data: purchaseData,
      items_data: itemsData
    });

    if (error) {
      console.error("Error creating purchase with items:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in service function:", error);
    throw error;
  }
};
// Function to update a purchase and manage its items using an interface
export const updatePurchaseWithItems = async (params: UpdatePurchaseWithItemsParams) => {
  const { purchaseId, purchaseData, items } = params;

  try {
    console.log("purchaseData", purchaseData)
    console.log("items", items)
    // Update the purchase data in 'purchases' table
    const { error: updateError } = await supabase
      .from('purchases')
      .update({
        storage_id: purchaseData.storage_id,
        type: purchaseData.type
      })
      .match({ id: purchaseId });

    if (updateError) throw updateError;

    // Process each item in 'purchase_items' table
    for (const item of items) {
      if (item.isNew) {
        // Insert new item
        const { error: insertError } = await supabase.from('purchase_items').insert({
          ...item,
          purchase_id: purchaseId // Make sure to include the foreign key to link to 'purchases' table
        });
        if (insertError) throw insertError;
      } else if (item.isModified) {
        // Update existing item
        const { error: updateItemError } = await supabase.from('purchase_items').update(item).match({ id: item.id });
        if (updateItemError) throw updateItemError;
      } else if (item.isDeleted) {
        // Deactivate or delete item
        const { error: deleteError } = await supabase.from('purchase_items').delete().match({ id: item.id });
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
        p_id: purchaseId
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting purchase and its items:", error);
      throw error;
    }
};