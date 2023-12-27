"use client"

import { useState } from "react";
import { useQuery} from "react-query";
import {
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Product } from "../../../lib/schemas/product/schema";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createColumns } from "../../../lib/data/product/columns";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"; // Adjust the import paths according to your project
import { ProductForm } from "@/components/forms/product/product-form";
import { deactivateProduct, fetchActiveProducts } from "@/lib/services/supabase/product";
import useSuccessErrorMutation from "@/lib/mutations";

export default function ProductPage() { 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateProduct, setUpdateProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
  
  const columns = createColumns(openDialog, openUpdateDialog);

  const { data, isLoading } = useQuery('products', fetchActiveProducts);

  const deleteMutation = useSuccessErrorMutation(
    deactivateProduct,
    'Producto',
    'delete',
    {
        queryKey: ['products'], // Query key for cache invalidation
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
          <DataTable
            data={data ?? []}
            columns={columns}
            filterColumnId="description"
            collectionName="producto"
            formComponent={<ProductForm onOpenChange={setIsFormOpen} />}
            onFormOpenChange={setIsFormOpen}
            isFormOpen={isFormOpen}
          />
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
          <AlertDialogAction onClick={() => deleteMutation.mutate(selectedProduct?.id ?? 0)}>
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
