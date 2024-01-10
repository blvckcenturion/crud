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

        const TWC =  CIF + costs.consolidated_tax_duty + costs.value_added_tax_iva + costs.specific_consumption_tax_ice + costs.other_penalties + costs.albo_customs_storage + costs.albo_customs_logistics + costs.dui_forms + costs.djv_forms + costs.other_expenses_ii + costs.chamber_of_commerce + costs.senasag + costs.custom_agent_commissions + costs.financial_commissions + costs.other_commissions + costs.national_transportation + costs.insurance + costs.handling_and_storage + costs.other_expenses_iii + costs.optional_expense_1 + costs.optional_expense_2 + costs.optional_expense_3 + costs.optional_expense_4 + costs.optional_expense_5
        
        const NTWC = TWC - costs.cf_iva

        const TWC_IVA = (
            costs.consolidated_tax_duty_iva +
            costs.value_added_tax_iva_iva +
            costs.specific_consumption_tax_ice_iva +
            costs.other_penalties_iva +
            costs.albo_customs_storage_iva +
            costs.albo_customs_logistics_iva +
            costs.dui_forms_iva +
            costs.djv_forms_iva +
            costs.other_expenses_ii_iva +
            costs.chamber_of_commerce_iva +
            costs.senasag_iva +
            costs.custom_agent_commissions_iva +
            costs.financial_commissions_iva +
            costs.other_commissions_iva +
            costs.national_transportation_iva +
            costs.insurance_iva +
            costs.handling_and_storage_iva +
            costs.other_expenses_iii_iva + costs.optional_expense_1_iva + costs.optional_expense_2_iva + costs.optional_expense_3_iva + costs.optional_expense_4_iva + costs.optional_expense_5_iva)

        console.log(TWC_IVA)

        console.log(costs.senasag_iva)

        const NTWCC = TWC - TWC_IVA

        console.log(NTWCC)

        let results: IntermediateImportCostsReturnSchema = {
            fob_value: Number(FOB.toFixed(2)),
            cif_value: Number(CIF.toFixed(2)),
            total_warehouse_cost: Number(TWC.toFixed(2)),
            net_total_warehouse_cost: Number(NTWC.toFixed(2)),
            net_total_warehouse_cost_calculated:Number(NTWCC.toFixed(2)),
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