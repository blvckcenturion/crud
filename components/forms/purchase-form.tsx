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
import { Input } from '@/components/ui/input';
import {
  PurchaseWithItemsExtended,
  PurchaseWithItemsExtendedSchema,
  PurchaseTypeNumericalMapping,
  PurchaseWithItemsUpdateSchema,
  PurchaseWithItemsInsertSchema,
} from '@/lib/schemas/purchase';
import { fetchActiveStorage } from '@/lib/services/supabase/storage';
import { fetchActiveProducts } from '@/lib/services/supabase/product';
import { useQuery } from 'react-query';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SelectGroup } from '@radix-ui/react-select';

interface PurchaseFormProps {
  purchase?: PurchaseWithItemsExtended | null; // Optional property for existing purchase data
  onOpenChange: (isOpen: boolean) => void;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ purchase, onOpenChange }) => {
  // State
  const [isLoading, setIsLoading] = useState(false);

  // Form
  const form = useForm({
    resolver: zodResolver(purchase ? PurchaseWithItemsUpdateSchema : PurchaseWithItemsInsertSchema),
    defaultValues: purchase || {
      type: undefined,
      storage_id: null,
      purchase_items: []
    },
  });

  // Mutations

  // Queries 
  const { data: products, isLoading: isLoadingProducts } = useQuery("products", fetchActiveProducts)
  const { data: storages, isLoading: isLoadingStorages } = useQuery("storages", fetchActiveStorage)

  // Helper functions
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'purchase_items'
  });

  const selectedType = form.watch("type");

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
    // Implement your submission logic here
    onOpenChange(false);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
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

        {/* Purchase Items */}
        <div>
          <h3>Items de la Compra</h3>
          {fields.map((item, index) => (
            <div key={item.id} className="flex gap-4 mb-4">
              <FormControl>
                <SelectContent {...form.register(`purchase_items.${index}.product_id`)} defaultValue={item.product_id?.toString() || ''}>
                  {products?.map(product => (
                    <SelectItem key={product.id} value={product.id?.toString() ?? ''}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </FormControl>
              <FormControl>
                <Input type="number" {...form.register(`purchase_items.${index}.qty`)} defaultValue={item.qty} placeholder="Cantidad" />
              </FormControl>
              <FormControl>
                <Input type="number" {...form.register(`purchase_items.${index}.unitary_price`)} defaultValue={item.unitary_price} placeholder="Precio Unitario" />
              </FormControl>
              <Button onClick={() => remove(index)}>Eliminar</Button>
            </div>
          ))}
          <Button>Agregar Item</Button>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Espere por favor" : "Guardar"} 
        </Button>
      </form>
    </Form>
  );
};