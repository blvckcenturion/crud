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
import { useRef, useState } from "react"
import Image from "next/image"
import { ImageModal } from "@/components/ui/image-modal"
import { ReloadIcon } from "@radix-ui/react-icons"

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
      type: undefined,
      image_url: ''
    }
  });
  
  const fileInputRef = useRef(null);
  const [imageURL, setImageURL] = useState(product?.image_url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast()

  const queryClient = useQueryClient();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageURL(URL.createObjectURL(file)); // Immediate preview URL
    }
  };

  async function uploadImage(file: File): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`${Date.now()}-${file.name}`, file);
  
      if (error) {
        console.log(error)
        throw error;
      }
  
      // Construct the URL using the `path` returned from the upload
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${data.path}`;
      return url;
    } catch (error) {
      toast({ variant: "destructive", title: "Error uploading image" });
      return null;
    }
  }

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
  
  async function onSubmit(data: any) {
    setIsLoading(true); // Start loading
    let imageURL = product?.image_url || '';

    if (selectedFile) {
      const uploadedURL = await uploadImage(selectedFile);
      if (uploadedURL) {
        imageURL = uploadedURL;
      }
    }

    const mappedData = {
      ...data,
      image_url: imageURL,
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
    setIsLoading(false); // Stop loading after operation is completed
  }
    
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
        {/* Image Upload Field */}
        <FormItem>
          <FormLabel>Imagen</FormLabel>
          <FormControl>
            <Input type="file"  ref={fileInputRef} onChange={handleFileChange} />
          </FormControl>
          {imageURL && (
            <div className="mt-4 max-w-xs mx-auto overflow-hidden rounded-lg shadow-lg">
              <Image
                src={imageURL}
                alt="Product"
                width={200}
                height={200}
                layout="responsive"
                className="object-cover object-center"
              />
            </div>
          )}
        </FormItem>

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
        )} />

        {/* Submit Button */}
        <Button disabled={isLoading}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Espere por favor" : "Guardar"} 
        </Button>
      </form>
    </Form>
  )
}
