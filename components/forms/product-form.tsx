"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Product, ProductSchema, classMapping, classNumericalMapping, formatMapping, formatNumericalMapping, typeMapping, typeNumericalMapping } from "@/lib/schemas/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "react-query"
import { supabase } from "@/lib/client/supabase"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRef, useState } from "react"
import Image from "next/image"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { addNewProduct, updateProduct } from "@/lib/services/supabase/product"
import useSuccessErrorMutation from "@/lib/mutations"
import { fetchActiveProviders } from "@/lib/services/supabase/provider"

interface ProductFormProps {
  product?: Product | null; // Optional property for existing product data
  onOpenChange: (isOpen: boolean) => void;
}

export function ProductForm({ product, onOpenChange }: ProductFormProps) {
  // State
  const fileInputRef = useRef(null);
  const [imageURL, setImageURL] = useState(product?.image_url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Clients
  const { toast } = useToast()
  const router = useRouter()

  // Form
  const form = useForm({
    resolver: zodResolver(ProductSchema.omit({
      id: true,
      active: true,
      created_at: true,
      updated_at: true
    })),
    mode: "onChange",
    defaultValues: product || {
      name: '',
      description: '',
      alias: '',
      class: undefined,
      format: undefined,
      type: undefined,
      provider_id: null,
      image_url: '',
      min_stock: 0,
      max_stock: 0
    }
  });

  // Mutations
  const addMutation = useSuccessErrorMutation(
    addNewProduct,
    'Producto',
    'create',
    {
      queryKey: ['products'], // Query key for cache invalidation
    }
  );
  const updateMutation = useSuccessErrorMutation(
    updateProduct,
    'Producto',
    'update',
    {
      queryKey: ['products'], // Query key for cache invalidation
    }
  );

  // Queries
  const { data: providers, isLoading: isLoadingProviders } = useQuery("providers", fetchActiveProviders);
  
  // Helper functions
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setImageURL(URL.createObjectURL(file));
    } else {
      // Reset the input if the file is not an image
      // Type assertion as HTMLInputElement
      const input = fileInputRef.current! as HTMLInputElement;
      if (input) {
        input.value = '';
      }
      toast({ variant: "destructive", title: "Tipo de archivo inválido", description: "Por favor, sube un archivo de imagen." });
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
    
  async function onSubmit(data: any) {
    try {
      setIsLoading(true); // Start loading
  
      // If there's a new selected file, upload it and get the URL
      let uploadedURL: string | null = '';
      if (selectedFile) {
        uploadedURL = await uploadImage(selectedFile);
      }
  
      // Determine the image URL to save based on the presence of a new file or deletion
      let imageURLToSave = uploadedURL || (imageURL !== product?.image_url ? null : imageURL);
  
      const mappedData = {
        ...data,
        image_url: imageURLToSave, // Use the determined image URL here
        class: classNumericalMapping[data.class] || null,
        format: formatNumericalMapping[data.format] || null,
        type: typeNumericalMapping[data.type] || null
      };
  
      // Check if we're updating an existing product
      if (product && product.id) {
        // If updating, include the product's id and check for image deletion
        updateMutation.mutate({ productData: mappedData, productId: product.id });
      } else {
        // If adding a new product, just use the mapped data
        addMutation.mutate(mappedData);
      }
  
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error in onSubmit function:", error);
    }
  }

  const handleProviderChange = (value: string) => {
    if (value === "-1") {
      // Logic for navigating to providers page
      router.push("/dashboard/provider");
    } else {
      form.setValue("provider_id", value === "null" ? null : Number(value));
    }
  };

  // Add a function to handle image deletion
  const handleDeleteImage = () => {
    // If there's a file selected, revoke the object URL to avoid memory leaks
    if (selectedFile) {
      URL.revokeObjectURL(imageURL);
    }
    setImageURL('');
    setSelectedFile(null);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
        {/* Image Upload Field */}
        <FormItem>
          <FormLabel htmlFor="image">Imagen</FormLabel>
          <FormControl>
            <Input type="file" id="image" name="image" ref={fileInputRef} onChange={handleFileChange} />
          </FormControl>
          {imageURL && (
            <div className="mt-4 max-w-xs mx-auto overflow-hidden  shadow-lg">
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
          {imageURL && (
            <Button onClick={handleDeleteImage}>
              Eliminar Imagen
            </Button>
          )}
        </FormItem>

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nombre</FormLabel>
              <FormControl>
                <Input {...field} id="name" name="name" autoComplete="name" />
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
            <FormLabel htmlFor="alias">Alias</FormLabel>
            <FormControl>
            <Input {...field} id="alias" name="alias" value={field.value || ''} autoComplete="alias" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />
        
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
        
        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Descripcion</FormLabel>
              <FormControl>
                <Input {...field} id="description" name="description" autoComplete="description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Class Field */}
        <FormField control={form.control} name="class" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="class">Clase</FormLabel>
            <FormControl>
              <Select name="class" onValueChange={field.onChange} value={field.value}>
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
            <FormLabel htmlFor="format">Formato</FormLabel>
            <FormControl>
              <Select name="format" onValueChange={field.onChange} value={field.value}>
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
          <FormLabel htmlFor="type">Tipo</FormLabel>
          <FormControl>
            <Select name="type" onValueChange={field.onChange} value={field.value}>
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

        {/* Min Stock Field */}
        <FormField control={form.control} name="min_stock" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="min_stock">Cantidad Minima de Stock</FormLabel>
                <FormControl>
                    <Input
                        id="min_stock"
                        type="number"
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        {/* Max Stock Field */}
        <FormField control={form.control} name="max_stock" render={({ field }) => (
            <FormItem>
                <FormLabel htmlFor="max_stock">Cantidad Maxima de Stock</FormLabel>
                <FormControl>
                    <Input
                        id="max_stock"
                        type="number"
                        value={field.value} // Valor predeterminado es 0
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
