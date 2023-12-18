"use client"

import { supabase } from "@/lib/client/supabase";
import { useState } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import {
  Spinner,
  Stack,
  ListItem,
  OrderedList,
  ListIcon,
  HStack,
  VStack,
  Flex,
  Text,
} from "@chakra-ui/react";
import { z } from "zod";
import { Product, ProductSchema } from "./data/schema";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "./data/columns";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"; // Adjust the import paths according to your project
import { ProductForm } from "./product-form";
import { useToast } from "@/components/ui/use-toast";

export default function ProductPage() { 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateProduct, setUpdateProduct] = useState<Product | null>(null);
  
  const openDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const openUpdateDialog = (product: Product) => {
    setUpdateProduct(product);
    setIsUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setUpdateProduct(null);
  };
  
  const queryClient = useQueryClient();

  const { toast } = useToast()
  
  const columns = createColumns(openDialog, openUpdateDialog);

  const { data, isLoading, isError, isSuccess } = useQuery(
    "products",
    async () => {
      const { data, error } = await supabase
        .from("products")
        .select()
        .order("id", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return z.array(ProductSchema).parse(data);
    }
  );

  const deleteProductMutation = useMutation(
    async (productId: number) => {
      const { error } = await supabase.from('products').delete().match({ id: productId });
      if (error) throw new Error(error.message);
    },
    {
      onSuccess: () => {
        toast({
          variant: "default",
          title: "Producto eliminado con éxito"
        });
        queryClient.invalidateQueries('products');
        closeDialog();
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Error al agregar producto"
        });
      }
    }
  );
  
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
      </div>
      {isLoading ? (
        <Stack>
          <Spinner size="xl" />
        </Stack>
      ): (
          <DataTable data={data ?? []} columns={columns}/>
      )}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el producto de nuestros servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteProductMutation.mutate(selectedProduct?.id ?? 0)}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
      <DialogContent className="w-full sm:w-1/2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Aquí puedes editar la información del producto. Haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <ProductForm product={updateProduct} onOpenChange={closeUpdateDialog} />
      </DialogContent>
    </Dialog>
    </div>
  );
}
