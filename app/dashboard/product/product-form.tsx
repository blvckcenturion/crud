"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Product, ProductSchema } from "./data/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "react-query"
import { supabase } from "@/lib/client/supabase"

interface ProductFormProps {
  onOpenChange: (isOpen: boolean) => void;
}

export function ProductForm({ onOpenChange }: ProductFormProps) {
    const form = useForm({
      resolver: zodResolver(ProductSchema.omit({
        id: true,
        active: true,
        created_at: true,
        updated_at: true,
        provider_id: true
      })),
      mode: "onChange",
      defaultValues: {
        description: "",
        unit: "",
        max_unit_description: "",
        measure_unit_description: "",
        unit_x_max_unit: 0, // or another appropriate default value
        unit_x_measure_unit: 0, // or another appropriate default value
      }
      // Default values for other fields can be set here if needed
    });
  
    const queryClient = useQueryClient();

  const addProductMutation = useMutation(
    async (newProduct: Product) => {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct]);
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        onOpenChange(false)
        toast({
          variant: "default",
          title: "Producto agregado con éxito"
        });
        queryClient.invalidateQueries('products');
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Error al agregar producto"
        });
      }
    }
  );
  
    function onSubmit(data: any) {
      addProductMutation.mutate(data);
      // Insert form submission logic here
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripcion</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Unit Field */}
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Max Unit Description Field */}
          <FormField
            control={form.control}
            name="max_unit_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción de la Unidad Máxima</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Measure Unit Description Field */}
          <FormField
            control={form.control}
            name="measure_unit_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción de la Unidad de Medida</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
           {/* Unit x Max Unit Field */}
          <FormField
            control={form.control}
            name="unit_x_max_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad x Unidad Máxima</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue('unit_x_max_unit', e.target.value ? parseInt(e.target.value) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Unit x Measure Unit Field */}
          <FormField
            control={form.control}
            name="unit_x_measure_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad x Unidad de Medida</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    value={field.value || ''} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setValue('unit_x_measure_unit', e.target.value ? parseInt(e.target.value) : 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Submit Button */}
          <Button type="submit">Guardar</Button>
        </form>
      </Form>
    )
  }
