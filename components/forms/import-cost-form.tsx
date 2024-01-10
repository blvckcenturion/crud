import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  ImportCostsFormSchema,
  ImportCostsRow,
  ImportCostsWithDetailsAndProvider,
  ImportCostsWithDetailsAndProviderSchema,
  InsertImportCostsSchema,
  IntermediateImportCostsReturnSchema,

} from "@/lib/schemas/import-cost";
import { addNewImportCost } from "@/lib/services/supabase/import-cost";

import useSuccessErrorMutation from "@/lib/mutations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { fetchActiveProviders } from "@/lib/services/supabase/provider";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { fetchActivePurchasesWithItems, fetchActivePurchasesWithNoCosts } from "@/lib/services/supabase/purchase";
import { calculateImportCostValues } from "@/lib/services/processing/import-cost";

interface ImportCostsFormProps {
  importCost?: ImportCostsWithDetailsAndProvider | null; // Optional property for existing import cost data
  onOpenChange: (isOpen: boolean) => void;
}

export function ImportCostsForm({ importCost, onOpenChange }: ImportCostsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter()
    const form = useForm({
      resolver: zodResolver(importCost ? ImportCostsWithDetailsAndProviderSchema : ImportCostsFormSchema ),
      mode: "onChange",
      defaultValues: importCost || {
          order_id: 0, // Default value for 'order_id'
          maritime_transportation: 0, // Default value for 'maritime_transportation'
          maritime_transportation_detail: '', // Default value for 'maritime_transportation_detail'
          land_transportation: 0, // Default value for 'land_transportation'
          land_transportation_detail: '', // Default value for 'land_transportation_detail'
          foreign_insurance: 0, // Default value for 'foreign_insurance'
          foreign_insurance_detail: '', // Default value for 'foreign_insurance_detail'
          aspb_port_expenses: 0, // Default value for 'aspb_port_expenses'
          aspb_port_expenses_detail: '', // Default value for 'aspb_port_expenses_detail'
          intermediary_commissions: 0, // Default value for 'intermediary_commissions'
          intermediary_commissions_detail: '', // Default value for 'intermediary_commissions_detail'
          other_expenses_i: 0, // Default value for 'other_expenses_i'
          other_expenses_i_detail: '', // Default value for 'other_expenses_i_detail'
          consolidated_tax_duty: 0, // Default value for 'consolidated_tax_duty'
          consolidated_tax_duty_iva: 0, // Default value for 'consolidated_tax_duty'
          consolidated_tax_duty_detail: '', // Default value for 'consolidated_tax_duty_detail'
          value_added_tax_iva: 0, // Default value for 'value_added_tax_iva'
          value_added_tax_iva_iva: 0, // Default value for 'value_added_tax_iva'
          value_added_tax_iva_detail: '', // Default value for 'value_added_tax_iva_detail'
          specific_consumption_tax_ice: 0, // Default value for 'specific_consumption_tax_ice'
          specific_consumption_tax_ice_iva: 0, // Default value for 'specific_consumption_tax_ice'
          specific_consumption_tax_ice_detail: '', // Default value for 'specific_consumption_tax_ice_detail'
          other_penalties: 0, // Default value for 'other_penalties'
          other_penalties_iva: 0, // Default value for 'other_penalties'
          other_penalties_detail: '', // Default value for 'other_penalties_detail'
          albo_customs_storage: 0, // Default value for 'albo_customs_storage'
          albo_customs_storage_iva: 0, // Default value for 'albo_customs_storage'
          albo_customs_storage_detail: '', // Default value for 'albo_customs_storage_detail'
          albo_customs_logistics: 0, // Default value for 'albo_customs_logistics'
          albo_customs_logistics_iva: 0, // Default value for 'albo_customs_logistics'
          albo_customs_logistics_detail: '', // Default value for 'albo_customs_logistics_detail'
          dui_forms: 0, // Default value for 'dui_forms'
          dui_forms_iva: 0, // Default value for 'dui_forms'
          dui_forms_detail: '', // Default value for 'dui_forms_detail'
          djv_forms: 0, // Default value for 'djv_forms'
          djv_forms_iva: 0, // Default value for 'djv_forms'
          djv_forms_detail: '', // Default value for 'djv_forms_detail'
          other_expenses_ii: 0, // Default value for 'other_expenses_ii'
          other_expenses_ii_iva: 0, // Default value for 'other_expenses_ii'
          other_expenses_ii_detail: '', // Default value for 'other_expenses_ii_detail'
          chamber_of_commerce: 0, // Default value for 'chamber_of_commerce'
          chamber_of_commerce_iva: 0, // Default value for 'chamber_of_commerce'
          chamber_of_commerce_detail: '', // Default value for 'chamber_of_commerce_detail'
          senasag: 0, // Default value for 'senasag'
          senasag_iva: 0, // Default value for 'senasag'
          senasag_detail: '', // Default value for 'senasag_detail'
          custom_agent_commissions: 0, // Default value for 'custom_agent_commissions'
          custom_agent_commissions_iva: 0, // Default value for 'custom_agent_commissions'
          custom_agent_commissions_detail: '', // Default value for 'custom_agent_commissions_detail'
          financial_commissions: 0, // Default value for 'financial_commissions'
          financial_commissions_iva: 0, // Default value for 'financial_commissions'
          financial_commissions_detail: '', // Default value for 'financial_commissions_detail'
          other_commissions: 0, // Default value for 'other_commissions'
          other_commissions_iva: 0, // Default value for 'other_commissions'
          other_commissions_detail: '', // Default value for 'other_commissions_detail'
          national_transportation: 0, // Default value for 'national_transportation'
          national_transportation_iva: 0, // Default value for 'national_transportation'
          national_transportation_detail: '', // Default value for 'national_transportation_detail'
          insurance: 0, // Default value for 'insurance'
          insurance_iva: 0, // Default value for 'insurance'
          insurance_detail: '', // Default value for 'insurance_detail'
          handling_and_storage: 0, // Default value for 'handling_and_storage'
          handling_and_storage_iva: 0, // Default value for 'handling_and_storage'
          handling_and_storage_detail: '', // Default value for 'handling_and_storage_detail'
          other_expenses_iii: 0, // Default value for 'other_expenses_iii'
          other_expenses_iii_iva: 0, // Default value for 'other_expenses_iii'
          other_expenses_iii_detail: '', // Default value for 'other_expenses_iii_detail'
          optional_expense_1: 0, // Default value for 'optional_expense_1'
          optional_expense_1_iva: 0, // Default value for 'optional_expense_1'
          optional_expense_1_detail: '', // Default value for 'optional_expense_1_detail'
          optional_expense_2: 0, // Default value for 'optional_expense_2'
          optional_expense_2_iva: 0, // Default value for 'optional_expense_2'
          optional_expense_2_detail: '', // Default value for 'optional_expense_2_detail'
          optional_expense_3: 0, // Default value for 'optional_expense_3'
          optional_expense_3_iva: 0, // Default value for 'optional_expense_3'
          optional_expense_3_detail: '', // Default value for 'optional_expense_3_detail'
          optional_expense_4: 0, // Default value for 'optional_expense_4'
          optional_expense_4_iva: 0, // Default value for 'optional_expense_4'
          optional_expense_4_detail: '', // Default value for 'optional_expense_4_detail'
          optional_expense_5: 0, // Default value for 'optional_expense_5'
          optional_expense_5_iva: 0, // Default value for 'optional_expense_5'
          optional_expense_5_detail: '', // Default value for 'optional_expense_5_detail'
          cf_iva: 0,
      },
  });

    // Queries
    const { data: purchases, isLoading: isLoadingProducts} = useQuery("purchases", fetchActivePurchasesWithNoCosts)
    
  // Mutations
  const addMutation = useSuccessErrorMutation(
    addNewImportCost,
    'Costo de Importación',
    'create',
    { queryKey: ['import-costs', 'purchases'] }
  );
    
  const handlePurchaseChange = (value: string) => {
    if (value === "-1") {
      // Logic for navigating to providers page
      router.push("/dashboard/purchase");
    } else {
        form.setValue("order_id", value === "null" ? 0 : Number(value));
    }
  };

  async function onSubmit(data: ImportCostsFormSchema) {
    try {
        setIsLoading(true);
        
        const selectedPurchase = purchases?.find(purchase => purchase.id === data.order_id);

        if (!selectedPurchase) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "La compra seleccionada no es valida."
            })
            return;
        }
        
        const values: IntermediateImportCostsReturnSchema = await calculateImportCostValues(data)
        const mappedData: InsertImportCostsSchema = {
            ...data,
            total_warehouse_cost: values.total_warehouse_cost,
            fob_value: values.fob_value,
            cif_value: values.cif_value,
            net_total_warehouse_cost: values.net_total_warehouse_cost,
            net_total_warehouse_cost_calculated: values.net_total_warehouse_cost_calculated
        }

        console.log(mappedData)

        const mappedDetails = values.import_cost_details

        addMutation.mutate({
            importCosts: mappedData,
            details: mappedDetails
        })
        
        onOpenChange(false);
    } catch (error) {
        console.error("Error in onSubmit function:", error);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
              {importCost && (
                  <FormField name="providerName" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="providerName">Proveedor</FormLabel>
                          <FormControl>
                              <Input
                                  id="providerName"
                                  type="text"
                                  disabled={importCost ? true : false}  
                                  value={importCost?.providerName ?? ''} // Valor predeterminado es 0
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
              )}

              {/* Order ID Field */}
              {!importCost && (
                  <FormField control={form.control} name="order_id" render={({ field }) => (
                  <FormItem>
                      <FormLabel htmlFor="order_id">ID de Orden</FormLabel>
                      <FormControl>
                      <Select name="order_id" onValueChange={handlePurchaseChange} value={String(field.value)} disabled={isLoadingProducts}>
                          <SelectTrigger>
                          <SelectValue placeholder="Seleccione una orden" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectGroup>
                              <SelectLabel>Compras Disponibles</SelectLabel>
                              {purchases?.map(purchase => (
                              <SelectItem key={purchase.id} value={String(purchase.id)}>ORDER-{purchase.id}</SelectItem>
                              ))}
                          </SelectGroup>
                          <SelectGroup>
                              <SelectLabel>Más Opciones</SelectLabel>
                              <SelectItem value="-1">Agregar Más Compras</SelectItem>
                          </SelectGroup>        
                          </SelectContent>
                      </Select>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}/>
              )}

            {/* Maritime Transportation Field */}
            <FormField control={form.control} name="maritime_transportation" render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="maritime_transportation">Transporte Marítimo</FormLabel>
                    <FormControl>
                        <Input
                            id="maritime_transportation"
                            type="number"
                            disabled={importCost ? true : false}  
                            value={field.value} // Valor predeterminado es 0
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            {/* Maritime Transportation Detail Field */}
            <FormField control={form.control} name="maritime_transportation_detail" render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="maritime_transportation_detail">Detalle Transporte Marítimo</FormLabel>
                    <FormControl>
                        <Input
                            id="maritime_transportation_detail"
                            type="text"
                            disabled={importCost ? true : false}  
                            value={field.value || ''} // Valor predeterminado es una cadena vacía
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
        )} />
        
            {/* Land Transportation Field */}
            <FormField control={form.control} name="land_transportation" render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="land_transportation">Transporte Terrestre</FormLabel>
                    <FormControl>
                        <Input
                            id="land_transportation"
                            type="number"
                            disabled={importCost ? true : false}  
                            value={field.value} // Valor predeterminado es 0
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            {/* Land Transportation Detail Field */}
            <FormField control={form.control} name="land_transportation_detail" render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="land_transportation_detail">Detalle Transporte Terrestre</FormLabel>
                    <FormControl>
                        <Input
                            id="land_transportation_detail"
                            type="text"
                            disabled={importCost ? true : false}  
                            value={field.value || ''} // Valor predeterminado es una cadena vacía
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
        )} />
        
        {/* Foreign Insurance Field */}
        <FormField control={form.control} name="foreign_insurance" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="foreign_insurance">Seguro en el Extranjero</FormLabel>
                <FormControl>
                    <Input
                        id="foreign_insurance"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Foreign Insurance Detail Field */}
        <FormField control={form.control} name="foreign_insurance_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="foreign_insurance_detail">Detalle Seguro en el Extranjero</FormLabel>
                <FormControl>
                    <Input
                        id="foreign_insurance_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Gastos Portuarios ASPB Field */}
        <FormField control={form.control} name="aspb_port_expenses" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="aspb_port_expenses">Gastos Portuarios ASPB</FormLabel>
                <FormControl>
                    <Input
                        id="aspb_port_expenses"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Gastos Portuarios ASPB Detail Field */}
        <FormField control={form.control} name="aspb_port_expenses_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="aspb_port_expenses_detail">Detalle Gastos Portuarios ASPB</FormLabel>
                <FormControl>
                    <Input
                        id="aspb_port_expenses_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Comisiones Intermediarios Field */}
        <FormField control={form.control} name="intermediary_commissions" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="intermediary_commissions">Comisiones Intermediarios</FormLabel>
                <FormControl>
                    <Input
                        id="intermediary_commissions"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Comisiones Intermediarios Detail Field */}
        <FormField control={form.control} name="intermediary_commissions_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="intermediary_commissions_detail">Detalle Comisiones Intermediarios</FormLabel>
                <FormControl>
                    <Input
                        id="intermediary_commissions_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Otros Gastos I Field */}
        <FormField control={form.control} name="other_expenses_i" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="other_expenses_i">Otros Gastos I</FormLabel>
                <FormControl>
                    <Input
                        id="other_expenses_i"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Otros Gastos I Detail Field */}
        <FormField control={form.control} name="other_expenses_i_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="other_expenses_i_detail">Detalle Otros Gastos I</FormLabel>
                <FormControl>
                    <Input
                        id="other_expenses_i_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              
              {importCost && (
                  <FormField name="providerName" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="maritime_transportation">Valor FOB</FormLabel>
                          <FormControl>
                              <Input
                                  id="maritime_transportation"
                                  type="number"
                                  disabled={importCost ? true : false}  
                                  value={importCost?.fob_value ?? 0} // Valor predeterminado es 0
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
              )}

        {/* Gravamen Impuesto Consolidado (GAC) Field */}
          <FormField control={form.control} name="consolidated_tax_duty" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="consolidated_tax_duty">Gravamen Impuesto Consolidado (GAC)</FormLabel>
                  <FormControl>
                      <Input
                          id="consolidated_tax_duty"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
        )} />
              
        {/* Gravamen Impuesto Consolidado (GAC) IVA Field */}
          <FormField control={form.control} name="consolidated_tax_duty_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="consolidated_tax_duty_iva">IVA | Gravamen Impuesto Consolidado (GAC)</FormLabel>
                  <FormControl>
                      <Input
                          id="consolidated_tax_duty_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gravamen Impuesto Consolidado (GAC) Detail Field */}
          <FormField control={form.control} name="consolidated_tax_duty_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="consolidated_tax_duty_detail">Detalle Gravamen Impuesto Consolidado (GAC)</FormLabel>
                  <FormControl>
                      <Input
                          id="consolidated_tax_duty_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
            

          {/* Impuesto al Valor Agregado (IVA) Field */}
          <FormField control={form.control} name="value_added_tax_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="value_added_tax_iva">Impuesto al Valor Agregado (IVA)</FormLabel>
                  <FormControl>
                      <Input
                          id="value_added_tax_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
              {/* IVA Impuesto al Valor Agregado (IVA) Field */}
          <FormField control={form.control} name="value_added_tax_iva_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="value_added_tax_iva_iva">IVA | Impuesto al Valor Agregado (IVA)</FormLabel>
                  <FormControl>
                      <Input
                          id="value_added_tax_iva_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Impuesto al Valor Agregado (IVA) Detail Field */}
          <FormField control={form.control} name="value_added_tax_iva_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="value_added_tax_iva_detail">Detalle Impuesto al Valor Agregado (IVA)</FormLabel>
                  <FormControl>
                      <Input
                          id="value_added_tax_iva_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Impuesto al Consumo Especifico (ICE) Field */}
          <FormField control={form.control} name="specific_consumption_tax_ice" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="specific_consumption_tax_ice">Impuesto al Consumo Especifico (ICE)</FormLabel>
                  <FormControl>
                      <Input
                          id="specific_consumption_tax_ice"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
              {/* Impuesto al Consumo Especifico (ICE) Field */}
          <FormField control={form.control} name="specific_consumption_tax_ice_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="specific_consumption_tax_ice_iva">IVA | Impuesto al Consumo Especifico (ICE)</FormLabel>
                  <FormControl>
                      <Input
                          id="specific_consumption_tax_ice_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Impuesto al Consumo Especifico (ICE) Detail Field */}
          <FormField control={form.control} name="specific_consumption_tax_ice_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="specific_consumption_tax_ice_detail">Detalle Impuesto al Consumo Especifico (ICE)</FormLabel>
                  <FormControl>
                      <Input
                          id="specific_consumption_tax_ice_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Contravenciones Otros Field */}
          <FormField control={form.control} name="other_penalties" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_penalties">Contravenciones Otros</FormLabel>
                  <FormControl>
                      <Input
                          id="other_penalties"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
            {/* Contravenciones Otros Field */}
          <FormField control={form.control} name="other_penalties_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_penalties_iva">IVA | Contravenciones Otros</FormLabel>
                  <FormControl>
                      <Input
                          id="other_penalties_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Contravenciones Otros Detail Field */}
          <FormField control={form.control} name="other_penalties_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_penalties_detail">Detalle Contravenciones Otros</FormLabel>
                  <FormControl>
                      <Input
                          id="other_penalties_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
        )} />
        
        {/* Almacenaje Aduana ALBO S.A. Field */}
        <FormField control={form.control} name="albo_customs_storage" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="albo_customs_storage">Almacenaje Aduana ALBO S.A.</FormLabel>
                <FormControl>
                    <Input
                        id="albo_customs_storage"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              
        {/* Almacenaje Aduana ALBO S.A. Field */}
        <FormField control={form.control} name="albo_customs_storage_iva" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="albo_customs_storage_iva">IVA | Almacenaje Aduana ALBO S.A.</FormLabel>
                <FormControl>
                    <Input
                        id="albo_customs_storage_iva"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Almacenaje Aduana ALBO S.A. Detail Field */}
        <FormField control={form.control} name="albo_customs_storage_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="albo_customs_storage_detail">Detalle Almacenaje Aduana ALBO S.A.</FormLabel>
                <FormControl>
                    <Input
                        id="albo_customs_storage_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Logística Aduana ALBO S.A. Field */}
        <FormField control={form.control} name="albo_customs_logistics" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="albo_customs_logistics">Logística Aduana ALBO S.A.</FormLabel>
                <FormControl>
                    <Input
                        id="albo_customs_logistics"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              
        {/* Logística Aduana ALBO S.A. Field */}
        <FormField control={form.control} name="albo_customs_logistics_iva" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="albo_customs_logistics_iva">IVA | Logística Aduana ALBO S.A.</FormLabel>
                <FormControl>
                    <Input
                        id="albo_customs_logistics_iva"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Logística Aduana ALBO S.A. Detail Field */}
        <FormField control={form.control} name="albo_customs_logistics_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="albo_customs_logistics_detail">Detalle Logística Aduana ALBO S.A.</FormLabel>
                <FormControl>
                    <Input
                        id="albo_customs_logistics_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Formularios DUI Field */}
        <FormField control={form.control} name="dui_forms" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="dui_forms">Formularios DUI</FormLabel>
                <FormControl>
                    <Input
                        id="dui_forms"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              
        {/* Formularios DUI Field */}
        <FormField control={form.control} name="dui_forms_iva" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="dui_forms_iva">IVA | Formularios DUI</FormLabel>
                <FormControl>
                    <Input
                        id="dui_forms_iva"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Formularios DUI Detail Field */}
        <FormField control={form.control} name="dui_forms_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="dui_forms_detail">Detalle Formularios DUI</FormLabel>
                <FormControl>
                    <Input
                        id="dui_forms_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Formularios DJV Field */}
        <FormField control={form.control} name="djv_forms" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="djv_forms">Formularios DJV</FormLabel>
                <FormControl>
                    <Input
                        id="djv_forms"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              
              {/* Formularios DJV Field */}
        <FormField control={form.control} name="djv_forms_iva" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="djv_forms_iva">IVA | Formularios DJV</FormLabel>
                <FormControl>
                    <Input
                        id="djv_forms_iva"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Formularios DJV Detail Field */}
        <FormField control={form.control} name="djv_forms_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="djv_forms_detail">Detalle Formularios DJV</FormLabel>
                <FormControl>
                    <Input
                        id="djv_forms_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        
        {/* Otros Gastos II Field */}
          <FormField control={form.control} name="other_expenses_ii" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_expenses_ii">Otros Gastos II</FormLabel>
                  <FormControl>
                      <Input
                          id="other_expenses_ii"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Otros Gastos II Field */}
        <FormField control={form.control} name="other_expenses_ii_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_expenses_ii_iva">IVA | Otros Gastos II</FormLabel>
                  <FormControl>
                      <Input
                          id="other_expenses_ii_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Otros Gastos II Detail Field */}
          <FormField control={form.control} name="other_expenses_ii_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_expenses_ii_detail">Detalle Otros Gastos II</FormLabel>
                  <FormControl>
                      <Input
                          id="other_expenses_ii_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Cámara Comercio Field */}
          <FormField control={form.control} name="chamber_of_commerce" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="chamber_of_commerce">Cámara Comercio</FormLabel>
                  <FormControl>
                      <Input
                          id="chamber_of_commerce"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
              {/* Cámara Comercio Field */}
          <FormField control={form.control} name="chamber_of_commerce_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="chamber_of_commerce_iva">IVA | Cámara Comercio</FormLabel>
                  <FormControl>
                      <Input
                          id="chamber_of_commerce_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Cámara Comercio Detail Field */}
          <FormField control={form.control} name="chamber_of_commerce_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="chamber_of_commerce_detail">Detalle Cámara Comercio</FormLabel>
                  <FormControl>
                      <Input
                          id="chamber_of_commerce_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Senasag Field */}
          <FormField control={form.control} name="senasag" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="senasag">Senasag</FormLabel>
                  <FormControl>
                      <Input
                          id="senasag"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Senasag Field */}
        <FormField control={form.control} name="senasag_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="senasag_iva">IVA | Senasag</FormLabel>
                  <FormControl>
                      <Input
                          id="senasag_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Senasag Detail Field */}
          <FormField control={form.control} name="senasag_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="senasag_detail">Detalle Senasag</FormLabel>
                  <FormControl>
                      <Input
                          id="senasag_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Comisiones Agente Despachante Aduana Field */}
          <FormField control={form.control} name="custom_agent_commissions" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="custom_agent_commissions">Comisiones Agente Despachante Aduana</FormLabel>
                  <FormControl>
                      <Input
                          id="custom_agent_commissions"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Comisiones Agente Despachante Aduana Field */}
        <FormField control={form.control} name="custom_agent_commissions_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="custom_agent_commissions_iva">IVA | Comisiones Agente Despachante Aduana</FormLabel>
                  <FormControl>
                      <Input
                          id="custom_agent_commissions_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Comisiones Agente Despachante Aduana Detail Field */}
          <FormField control={form.control} name="custom_agent_commissions_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="custom_agent_commissions_detail">Detalle Comisiones Agente Despachante Aduana</FormLabel>
                  <FormControl>
                      <Input
                          id="custom_agent_commissions_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
        )} />
        
        {/* Comisiones Financieras Field */}
          <FormField control={form.control} name="financial_commissions" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="financial_commissions">Comisiones Financieras</FormLabel>
                  <FormControl>
                      <Input
                          id="financial_commissions"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Comisiones Financieras Field */}
        <FormField control={form.control} name="financial_commissions_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="financial_commissions_iva">IVA | Comisiones Financieras</FormLabel>
                  <FormControl>
                      <Input
                          id="financial_commissions_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Comisiones Financieras Detail Field */}
          <FormField control={form.control} name="financial_commissions_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="financial_commissions_detail">Detalle Comisiones Financieras</FormLabel>
                  <FormControl>
                      <Input
                          id="financial_commissions_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Otras Comisiones Field */}
          <FormField control={form.control} name="other_commissions" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_commissions">Otras Comisiones</FormLabel>
                  <FormControl>
                      <Input
                          id="other_commissions"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
            {/* Otras Comisiones Field */}
          <FormField control={form.control} name="other_commissions_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_commissions_iva">IVA | Otras Comisiones</FormLabel>
                  <FormControl>
                      <Input
                          id="other_commissions_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Otras Comisiones Detail Field */}
          <FormField control={form.control} name="other_commissions_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="other_commissions_detail">Detalle Otras Comisiones</FormLabel>
                  <FormControl>
                      <Input
                          id="other_commissions_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Transporte Nacional Field */}
          <FormField control={form.control} name="national_transportation" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="national_transportation">Transporte Nacional</FormLabel>
                  <FormControl>
                      <Input
                          id="national_transportation"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
            {/* Transporte Nacional Field */}
          <FormField control={form.control} name="national_transportation_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="national_transportation_iva">IVA Transporte Nacional</FormLabel>
                  <FormControl>
                      <Input
                          id="national_transportation_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Transporte Nacional Detail Field */}
          <FormField control={form.control} name="national_transportation_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="national_transportation_detail">Detalle Transporte Nacional</FormLabel>
                  <FormControl>
                      <Input
                          id="national_transportation_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Seguros Field */}
          <FormField control={form.control} name="insurance" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="insurance">Seguros</FormLabel>
                  <FormControl>
                      <Input
                          id="insurance"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Seguros Field */}
        <FormField control={form.control} name="insurance_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="insurance_iva">IVA | Seguros</FormLabel>
                  <FormControl>
                      <Input
                          id="insurance_iva"
                          type="number"
                          disabled={importCost ? true : false}  
                          value={field.value} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Seguros Detail Field */}
          <FormField control={form.control} name="insurance_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="insurance_detail">Detalle Seguros</FormLabel>
                  <FormControl>
                      <Input
                          id="insurance_detail"
                          type="text"
                          disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
        )} />
        
        {/* Cargos y Manipuleo Field */}
        <FormField control={form.control} name="handling_and_storage" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="handling_and_storage">Cargos y Manipuleo</FormLabel>
                <FormControl>
                    <Input
                        id="handling_and_storage"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              
        {/* Cargos y Manipuleo Field */}
        <FormField control={form.control} name="handling_and_storage_iva" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="handling_and_storage_iva">IVA | Cargos y Manipuleo</FormLabel>
                <FormControl>
                    <Input
                        id="handling_and_storage_iva"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Cargos y Manipuleo Detail Field */}
        <FormField control={form.control} name="handling_and_storage_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="handling_and_storage_detail">Detalle Cargos y Manipuleo</FormLabel>
                <FormControl>
                    <Input
                        id="handling_and_storage_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Otros Gastos III Field */}
        <FormField control={form.control} name="other_expenses_iii" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="other_expenses_iii">Otros Gastos III</FormLabel>
                <FormControl>
                    <Input
                        id="other_expenses_iii"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              
        {/* Otros Gastos III Field */}
        <FormField control={form.control} name="other_expenses_iii_iva" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="other_expenses_iii_iva">IVA | Otros Gastos III</FormLabel>
                <FormControl>
                    <Input
                        id="other_expenses_iii_iva"
                        type="number"
                        disabled={importCost ? true : false}  
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Otros Gastos III Detail Field */}
        <FormField control={form.control} name="other_expenses_iii_detail" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="other_expenses_iii_detail">Detalle Otros Gastos III</FormLabel>
                <FormControl>
                    <Input
                        id="other_expenses_iii_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                        value={field.value || ''} // Valor predeterminado es una cadena vacía
                        onChange={field.onChange}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Gasto opcional 1 Field */}
          <FormField control={form.control} name="optional_expense_1" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_1">Gasto opcional 1</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_1"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Gasto opcional 1 Field */}
        <FormField control={form.control} name="optional_expense_1_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_1_iva">IVA | Gasto opcional 1</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_1_iva"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 1 Detail Field */}
          <FormField control={form.control} name="optional_expense_1_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_1_detail">Detalle Gasto opcional 1</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_1_detail"
                              type="text"
                              disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 2 Field */}
          <FormField control={form.control} name="optional_expense_2" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_2">Gasto opcional 2</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_2"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Gasto opcional 1 Field */}
        <FormField control={form.control} name="optional_expense_2_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_2_iva">IVA | Gasto opcional 2</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_2_iva"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 2 Detail Field */}
          <FormField control={form.control} name="optional_expense_2_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_2_detail">Detalle Gasto opcional 2</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_2_detail"
                              type="text"
                              disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 3 Field */}
          <FormField control={form.control} name="optional_expense_3" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_3">Gasto opcional 3</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_3"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Gasto opcional 3 Field */}
        <FormField control={form.control} name="optional_expense_3_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_3_iva">IVA | Gasto opcional 3</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_3_iva"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 3 Detail Field */}
          <FormField control={form.control} name="optional_expense_3_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_3_detail">Detalle Gasto opcional 3</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_3_detail"
                              type="text"
                              disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 4 Field */}
          <FormField control={form.control} name="optional_expense_4" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_4">Gasto opcional 4</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_4"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Gasto opcional 4 Field */}
        <FormField control={form.control} name="optional_expense_4_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_4_iva">IVA | Gasto opcional 4</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_4_iva"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 4 Detail Field */}
          <FormField control={form.control} name="optional_expense_4_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_4_detail">Detalle Gasto opcional 4</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_4_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 5 Field */}
          <FormField control={form.control} name="optional_expense_5" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_5">Gasto opcional 5</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_5"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
              )} />
              
        {/* Gasto opcional 5 Field */}
        <FormField control={form.control} name="optional_expense_5_iva" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_5_iva">IVA | Gasto opcional 5</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_5_iva"
                              type="number"
                              disabled={importCost ? true : false}  
                          value={field.value || 0} // Valor predeterminado es 0
                          onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )} />

          {/* Gasto opcional 5 Detail Field */}
          <FormField control={form.control} name="optional_expense_5_detail" render={({ field }) => (
              <FormItem>
                  <FormLabel htmlFor="optional_expense_5_detail">Detalle Gasto opcional 5</FormLabel>
                  <FormControl>
                      <Input
                          id="optional_expense_5_detail"
                        type="text"
                        disabled={importCost ? true : false}  
                          value={field.value || ''} // Valor predeterminado es una cadena vacía
                          onChange={field.onChange}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
        )} />

        {/* CF IVA Field */}
        <FormField control={form.control} name="cf_iva" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="cf_iva">CF IVA</FormLabel>
                <FormControl>
                    <Input
                        id="cf_iva"
                        type="number"
                        disabled={importCost ? true : false}      
                        value={field.value || 0} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
              )} />
              {importCost && (
                  <FormField name="total_warehouse_cost" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="net_total_warehouse_cost">Costo Total Almacenes</FormLabel>
                          <FormControl>
                              <Input
                                  id="net_total_warehouse_cost"
                                  type="number"
                                  disabled={importCost ? true : false}  
                                  value={importCost?.total_warehouse_cost ?? 0} // Valor predeterminado es 0
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
              )} 
              {importCost && (
                  <FormField name="net_total_warehouse_cost" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="net_total_warehouse_cost">Costo Total Neto Almacenes</FormLabel>
                          <FormControl>
                              <Input
                                  id="net_total_warehouse_cost"
                                  type="number"
                                  disabled={importCost ? true : false}  
                                  value={importCost?.net_total_warehouse_cost ?? 0} // Valor predeterminado es 0
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
              )}      
              {importCost && (
                  <FormField name="net_total_warehouse_cost_calculated" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="net_total_warehouse_cost_calculated">Costo Total Neto Almacene (CALCULADO)</FormLabel>
                          <FormControl>
                              <Input
                                  id="net_total_warehouse_cost_calculated"
                                  type="number"
                                  disabled={importCost ? true : false}  
                                  value={importCost?.net_total_warehouse_cost_calculated ?? 0} // Valor predeterminado es 0
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
              )}   
              {importCost && (
                  <FormField name="unitary_cost" render={({ field }) => (
                      <FormItem>
                          <FormLabel htmlFor="unitary_cost">Costo Unitario</FormLabel>
                          <FormControl>
                          <div className="overflow-y-auto">
                                <div className="flex space-x-4 py-2">
                                {importCost.import_costs_detail?.map((detail, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg w-full border">
                                    <div className="text-sm font-medium text-gray-900">{detail.productName}</div>
                                    <div className="text-lg font-semibold text-gray-600">${detail.unit_cost}</div>
                                    </div>
                                ))}
                                </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )} />
              )}      
        
            {/* Submit Button */}
            {!importCost && (
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Guardando..." : "Guardar"}
            </Button>
                  
            )}
      </form>
    </Form>
  );
}