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
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Product, ProductSchema, classMapping, classNumericalMapping, formatMapping, formatNumericalMapping, typeMapping, typeNumericalMapping } from "./data/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "react-query"
import { supabase } from "@/lib/client/supabase"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductFormProps {
  product?: Product | null; // Optional property for existing product data
  onOpenChange: (isOpen: boolean) => void;
}

function getKeyByValue(object: Record<string, string>, value: string): string | undefined {
  return Object.keys(object).find(key => object[key] === value);
}

export function ProductForm({ product, onOpenChange }: ProductFormProps) {
    const form = useForm({
      resolver: zodResolver(ProductSchema.omit({
        id: true,
        active: true,
        created_at: true,
        updated_at: true,
        provider_id: true
      })),
      mode: "onChange",
      defaultValues: product || {
        name: '',
        description: '',
        alias: '',
        class: undefined,
        format: undefined,
        type: undefined
      }
    });
  
    const {toast} = useToast()
  
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

  const updateProductMutation = useMutation(
    async (productToUpdate: Product) => {
      const { data, error } = await supabase
        .from('products')
        .update(productToUpdate)
        .match({ id: productToUpdate.id });
      if (error) throw new Error(error.message);
      return data;
    },
    {
      onSuccess: () => {
        onOpenChange(false); // Close the dialog/form
        toast({
          variant: "default",
          title: "Producto actualizado con éxito" // Success message for update
        });
        queryClient.invalidateQueries('products'); // Refresh the product list
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Error al actualizar el producto" // Error message for update
        });
      }
    }
  );
  
    function onSubmit(data: any) {
      const mappedData = {
        ...data,
        class: classNumericalMapping[data.class] || null,
        format: formatNumericalMapping[data.format] || null,
        type: typeNumericalMapping[data.type] || null
      };
    
      if (product) {
        // If updating, include the product's id
        updateProductMutation.mutate({ ...mappedData, id: product.id });
      } else {
        // If adding a new product
        addProductMutation.mutate(mappedData);
      }
    }
    
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Alias Field */}
        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alias</FormLabel>
              <FormControl>
              <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          
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

          {/* Class Field */}
          <FormField control={form.control} name="class" render={({ field }) => (
            <FormItem>
              <FormLabel>Clase</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una clase" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(classMapping).map(([label, value]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          

          {/* Format Field */}
          <FormField control={form.control} name="format" render={({ field }) => (
            <FormItem>
              <FormLabel>Formato</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(formatMapping).map(([label, value]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}/>
        

        {/* Type Field */}
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeMapping).map(([label, value]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}/>
  
          {/* Submit Button */}
          <Button type="submit">Guardar</Button>
        </form>
      </Form>
    )
  }
