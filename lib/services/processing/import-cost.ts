import { ImportCostsFormSchema, IntermediateImportCostsReturnSchema } from "@/lib/schemas/import-cost";
import { PurchaseWithItemsExtended } from "@/lib/schemas/purchase";
import { fetchActivePurchaseWithItemsById } from "@/lib/services/supabase/purchase";

export const calculateImportCostValues = async (costs: ImportCostsFormSchema): Promise<IntermediateImportCostsReturnSchema> => {
    try {
        // fetch purchase items
        const purchase: PurchaseWithItemsExtended | null = await fetchActivePurchaseWithItemsById(costs.order_id);

        if (!purchase) {
            throw new Error("Selected purchase not found")
        }

        // Map purchase items to the ImportCostsDetailFormSchema format
        let importCostDetails = purchase.purchase_items?.map(item => ({
            product_id: item.product_id,
            qty: item.qty,
            unitary_price: item.unitary_price,
            coefficient_value: 0
        }));

        if (!importCostDetails) {
            throw new Error("Selected purchase has no items")
        }

        // FOB
        const FOB = importCostDetails.reduce((total, item) => {
            return total + (item.qty * item.unitary_price);
        }, 0); // Start with an initial total of 0~

        importCostDetails = importCostDetails.map(item => ({ ...item, coefficient_value: (item.qty * item.unitary_price) / FOB }))
        
        const CIF = FOB + costs.maritime_transportation + costs.land_transportation + costs.foreign_insurance + costs.aspb_port_expenses + costs.intermediary_commissions + costs.other_expenses_i
        
        const NTWC = costs.total_warehouse_cost - costs.cf_iva

        let results: IntermediateImportCostsReturnSchema = {
            fob_value: Number(FOB.toFixed(2)),
            cif_value: Number(CIF.toFixed(2)),
            net_total_warehouse_cost: Number(NTWC.toFixed(2)),
            import_cost_details: importCostDetails.map(item => {
                
                const subtotal_ntwc = NTWC * item.coefficient_value
                const unit_cost = Number((subtotal_ntwc / item.qty).toFixed(2));
                    
                return {
                    product_id: item.product_id,
                    unit_cost
                }
            })
        }

        return results
    } catch (error) {
        console.error('Error calculating import costs values: ', error)
        throw error;
    }

}