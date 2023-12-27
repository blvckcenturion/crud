// productService.ts

import { supabase } from "@/lib/client/supabase";
import { z } from 'zod';
import { ProductSchema, ProductWithProviderSchema, classNumericalMapping, formatNumericalMapping, typeNumericalMapping } from "@/lib/schemas/product/schema";

// Function to reverse map numerical values to enum values
function reverseMapEnum(value: number, enumObject: Record<string, number>): string | undefined {
    const entry = Object.entries(enumObject).find(([_, num]) => num === value);
    return entry ? entry[0] : undefined;
  }
  
  // Function to map data to enums
  function mapDataToEnums(data: any): any {
    return {
      ...data,
      class: reverseMapEnum(data.class, classNumericalMapping),
      format: reverseMapEnum(data.format, formatNumericalMapping),
      type: reverseMapEnum(data.type, typeNumericalMapping),
    };
  }

// Function to fetch active products
export const fetchActiveProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`*, provider:provider_id (name)`)
      .eq("active", true)
      .order("id", { ascending: true });

    if (error) throw error;

    // Map the data to enums or any other transformations needed
    const mappedData = data.map((item: any) => mapDataToEnums(item));

    return ProductWithProviderSchema.array().parse(mappedData);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Function to add a new product
export const addNewProduct = async (newProduct: z.infer<typeof ProductSchema>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct]);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error adding new product:", error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async ({ productId, productData }: { productId: number, productData: z.infer<typeof ProductSchema> }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...productData, updated_at: new Date().toISOString() })
        .match({ id: productId });
  
      if (error) throw error;
  
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
};

// Function to "delete" a product (set active to false)
export const deactivateProduct = async (productId: number) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ active: false, updated_at: new Date().toISOString() })
      .match({ id: productId });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error deactivating product:", error);
    throw error;
  }
};
