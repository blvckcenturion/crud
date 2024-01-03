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
  ImportCostsRow,
  ImportCostsInsertSchema,
  ImportCostsUpdateSchema
} from "@/lib/schemas/import-cost";
import { addNewImportCost, updateImportCost } from "@/lib/services/supabase/import-cost";

import useSuccessErrorMutation from "@/lib/mutations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { fetchActiveProviders } from "@/lib/services/supabase/provider";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { fetchActivePurchasesWithItems } from "@/lib/services/supabase/purchase";

interface ImportCostsFormProps {
  importCost?: ImportCostsRow | null; // Optional property for existing import cost data
  onOpenChange: (isOpen: boolean) => void;
}

export function ImportCostsForm({ importCost, onOpenChange }: ImportCostsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter()
  const form = useForm({
    resolver: zodResolver(importCost ? ImportCostsUpdateSchema : ImportCostsInsertSchema),
    mode: "onChange",
    defaultValues: importCost || {
      order_id: 0,
      provider_id: 0,
      fob_value: 0,
      maritime_transport_cost: 0,
      land_transport_cost: 0,
      tax_iva: 0,
      net_value: 0,
      additional_costs: 0,
      import_date: '',
      additional_notes: '',
      active: true
    },
  });

    // Queries
    const { data: providers, isLoading: isLoadingProviders } = useQuery("providers", fetchActiveProviders);
    const { data: purchases, isLoading: isLoadingProducts} = useQuery("purchases", fetchActivePurchasesWithItems)
    
  // Mutations
  const addMutation = useSuccessErrorMutation(
    addNewImportCost,
    'Costo de Importación',
    'create',
    { queryKey: ['import-costs'] }
  );
  const updateMutation = useSuccessErrorMutation(
    updateImportCost,
    'Costo de Importación',
    'update',
    { queryKey: ['import-costs'] }
  );
    
  const handleProviderChange = (value: string) => {
    if (value === "-1") {
      // Logic for navigating to providers page
      router.push("/dashboard/provider");
    } else {
        form.setValue("provider_id", value === "null" ? 0 : Number(value));
    }
  };
    
  const handlePurchaseChange = (value: string) => {
    if (value === "-1") {
      // Logic for navigating to providers page
      router.push("/dashboard/purchase");
    } else {
        form.setValue("order_id", value === "null" ? 0 : Number(value));
    }
  };

  async function onSubmit(data: any) {
    try {
      setIsLoading(true);
      if (importCost && importCost.id) {
        // If updating an existing import cost
        updateMutation.mutate({ importCostData: data, importCostId: importCost.id });
      } else {
        // If adding a new import cost
        addMutation.mutate(data);
      }
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error in onSubmit function:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
          {/* Order ID Field */}
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

            {/* Provider Field */}
            <FormField control={form.control} name="provider_id" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="provider_id">Proveedor</FormLabel>
                <FormControl>
                    <Select name="provider_id" onValueChange={handleProviderChange} value={String(field.value)} disabled={isLoadingProviders}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Proveedores Existentes</SelectLabel>
                        {providers?.map(provider => (
                            <SelectItem key={provider.id} value={String(provider.id)}>{provider.name}</SelectItem>
                        ))}
                        </SelectGroup>
                        <SelectGroup>
                        <SelectLabel>Más Opciones</SelectLabel>
                        <SelectItem value="null">Sin Proveedor</SelectItem>
                        <SelectItem value="-1">Agregar Más Proveedores</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* FOB Value Field */}
            <FormField control={form.control} name="fob_value" render={({ field }) => (
                <FormItem>
                    <FormLabel htmlFor="fob_value">Valor FOB</FormLabel>
                    <FormControl>
                        <Input 
                            id="fob_value" 
                            type="number" 
                            value={field.value || ''} // Ensure the value is a string
                            onChange={(e) => field.onChange(Number(e.target.value))} // Convert the string value to a number
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            {/* Maritime Transport Cost Field */}
            <FormField control={form.control} name="maritime_transport_cost" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="maritime_transport_cost">Costo de Transporte Marítimo</FormLabel>
                <FormControl>
                  <Input {...field} id="maritime_transport_cost" type="number" value={field.value || ''} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* Land Transport Cost Field */}
            <FormField control={form.control} name="land_transport_cost" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="land_transport_cost">Costo de Transporte Terrestre</FormLabel>
                <FormControl>
                  <Input {...field} id="land_transport_cost" type="number" value={field.value || ''} onChange={(e) => field.onChange(Number(e.target.value))}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* Tax IVA Field */}
            <FormField control={form.control} name="tax_iva" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="tax_iva">Impuesto IVA</FormLabel>
                <FormControl>
                    <Input {...field} id="tax_iva" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* Net Value Field */}
            <FormField control={form.control} name="net_value" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="net_value">Valor Neto</FormLabel>
                <FormControl>
                    <Input {...field} id="net_value" type="number" onChange={(e) => field.onChange(Number(e.target.value))}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* Additional Costs Field */}
            <FormField control={form.control} name="additional_costs" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="additional_costs">Costos Adicionales</FormLabel>
                <FormControl>
                    <Input {...field} id="additional_costs" type="number" onChange={(e) => field.onChange(Number(e.target.value))}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* Import Date Field */}
            <FormField control={form.control} name="import_date" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="import_date">Fecha de Importación</FormLabel>
                <FormControl>
                    <Input {...field} id="import_date" type="date" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* Additional Notes Field */}
            <FormField control={form.control} name="additional_notes" render={({ field }) => (
                <FormItem>
                <FormLabel htmlFor="additional_notes">Notas Adicionales</FormLabel>
                <FormControl>
                    <Input {...field} id="additional_notes" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )} />

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Guardando..." : "Guardar"}
            </Button>
      </form>
    </Form>
  );
}