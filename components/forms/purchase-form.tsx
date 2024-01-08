'use client'

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  PurchaseWithItemsExtended,
  PurchaseWithItemsExtendedSchema,
  PurchaseTypeNumericalMapping,
  PurchaseWithItemsUpdateSchema,
  PurchaseWithItemsInsertSchema,
  PurchaseItemExtended,
  PurchaseInsertSchema,
  PurchaseItemInsertSchema,
  PurchaseUpdateSchema,
  PurchaseItemUpdateSchema,
  PurchaseTypeReverseMapping,
} from '@/lib/schemas/purchase';
import { fetchActiveStorage } from '@/lib/services/supabase/storage';
import { fetchActiveProducts } from '@/lib/services/supabase/product';
import { useQuery } from 'react-query';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SelectGroup } from '@radix-ui/react-select';
import ProductSelectorComponent from '../product-selector';
import { useToast } from '../ui/use-toast';
import useSuccessErrorMutation from '@/lib/mutations';
import { createPurchaseWithItems, updatePurchaseWithItems } from '@/lib/services/supabase/purchase';
import { fetchActiveProviders } from '@/lib/services/supabase/provider';


interface PurchaseFormProps {
  purchase?: PurchaseWithItemsExtended | null; // Optional property for existing purchase data
  onOpenChange: (isOpen: boolean) => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchase, onOpenChange }) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<PurchaseItemExtended[]>([]);

  // Convert numeric type to string representation for editing
  const convertedType = purchase ? PurchaseTypeReverseMapping[Number(purchase.type)] : undefined;

  const form = useForm({
      resolver: zodResolver(purchase ? PurchaseWithItemsUpdateSchema : PurchaseWithItemsInsertSchema),
      defaultValues: {
        type: convertedType, // Use the converted type here
        storage_id: purchase?.storage_id || null,
        purchase_items: purchase?.purchase_items || [],
        provider_id: purchase?.provider_id || 0
      },
    });

  // Mutations
  const createPurchaseMutation = useSuccessErrorMutation(
    createPurchaseWithItems,
    'Compra',
    'create',
    { queryKey: ['purchases'] }
  );

  const updatePurchaseMutation = useSuccessErrorMutation(
    updatePurchaseWithItems,
    'Compra',
    'update',
    { queryKey: ['purchases'] }
  );

  // Queries 
  const { data: products, isLoading: isLoadingProducts } = useQuery("products", fetchActiveProducts)
  const { data: storages, isLoading: isLoadingStorages } = useQuery("storages", fetchActiveStorage)
  const { data: providers, isLoading: isLoadingProviders } = useQuery("providers", fetchActiveProviders)

  // Helper functions
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'purchase_items'
  });

  const selectedType = form.watch("type");
  const { toast } = useToast()

  const onSubmit = (data: any) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Productos requeridos",
        description: "Debe agregar al menos un producto a la compra.",
        variant: "destructive"
      });
      return; // Prevent form submission
    }
  
    if (data.type === 'nacional' && data.storage_id === null) {
      toast({
        title: "Se requiere almacen",
        description: "Por favor seleccione un almacen para compras nacionales.",
        variant: "destructive"
      });
      return;
    }

    // Map type to its numerical value
    const mappedPurchaseData = {
      ...data,
      type: PurchaseTypeNumericalMapping[data.type] || null
    };
  
    const mappedItemsData = selectedProducts.map(item => ({
      ...item,
      product_id: item.product_id,
      qty: item.qty,
      unitary_price: item.unitary_price,
      // Include other necessary fields from item
    }));
  
    setIsLoading(true);
    try {
      if (purchase?.id === undefined) {
  
        // Validate Each Purchase Item
        mappedItemsData.forEach(item => PurchaseItemInsertSchema.parse(item));
  
        // Create New Purchase
        createPurchaseMutation.mutate({ purchaseData: mappedPurchaseData, itemsData: mappedItemsData });
      } else {
  
        // Validate Each Purchase Item
        mappedItemsData.forEach(item => PurchaseItemUpdateSchema.parse(item));
  
        // Update Existing Purchase
        updatePurchaseMutation.mutate({ purchaseId: purchase.id, purchaseData: mappedPurchaseData, items: mappedItemsData });
      }
    } catch (error) {
      console.error("Error in onSubmit function:", error);
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const router = useRouter();

  const handleStorageChange = (value: string) => {
    
    if (value === "-1") {
      // Logic for navigating to storage page
      router.push("/dashboard/storage");
    } else {
      form.setValue("storage_id", value === "null" ? null : Number(value));
    }
  };

  // Handle provider selection change
  const handleProviderChange = (value: string) => {
    const providerId = value === "null" ? null : Number(value);

    form.setValue("provider_id", value === "null" ? 0 : Number(value))

    setSelectedProducts([]); // Reset selected products
  };

  // Effects 
  useEffect(() => {
    if (selectedType !== 'nacional') {
      form.setValue("storage_id", null);
    }
  }, [selectedType, form]);

  useEffect(() => {
    // If updating a purchase, initialize selectedProducts with existing items
    if (purchase) {
      setSelectedProducts(purchase.purchase_items || []);
    }
  }, [purchase]);

  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="px-2 space-y-8 overflow-y-auto max-h-[85vh]">
        {/* Purchase Type Field */}
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="type">Tipo de Compra</FormLabel>
            <FormControl>
              <Select name="type" onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PurchaseTypeNumericalMapping).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{key}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Storage Field - Conditional Rendering */}
        {selectedType === 'nacional' && (
          <FormField control={form.control} name="storage_id" render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="storage_id">Almacen</FormLabel>
              <FormControl>
                <Select name="storage_id" onValueChange={handleStorageChange} value={String(field.value)} disabled={isLoadingStorages}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un almacen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Almacenes Existentes</SelectLabel>
                      {storages?.map(storage => (
                        <SelectItem key={storage.id} value={String(storage.id)}>{storage.name}</SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Mas Opciones</SelectLabel>
                      <SelectItem value="null">Sin Almacen</SelectItem>
                      <SelectItem value="-1">Agregar Mas Almacenes</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        )}

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
                    <SelectLabel>Mas Opciones</SelectLabel>
                    <SelectItem value="null">Sin Proveedor</SelectItem>
                    <SelectItem value="-1">Agregar Mas Proveedores</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Product Selector Component with Provider Filter */}
        <ProductSelectorComponent
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          products={products?.filter(product => product.provider_id === form.getValues("provider_id")) || []}
          purchaseId={purchase?.id}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Espere por favor" : "Guardar"} 
        </Button>
      </form>
    </Form>
  );
};