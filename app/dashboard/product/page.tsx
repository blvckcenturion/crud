"use client"

import { useState } from "react";
import { useQuery} from "react-query";
import {
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { Product } from "@/lib/schemas/product/schema";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createProductColumns } from "@/lib/data/product/columns";
import { ProductForm } from "@/components/forms/product/product-form";
import { deactivateProduct, fetchActiveProducts } from "@/lib/services/supabase/product";
import useSuccessErrorMutation from "@/lib/mutations";
import AlertDialogComponent from "@/components/dialog/alert-dialog";
import UpdateFormDialogComponent from "@/components/dialog/update-dialog";

export default function ProductPage() { 
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Columns creation
  const columns = createProductColumns(
    (product) => {
      setSelectedProduct(product); // Set the product to be deleted
      setIsDialogOpen(true); // Open the product confirmation dialog
    },
    (product) => {
      setSelectedProduct(product);  // Set the provider to be updated
      setIsUpdateDialogOpen(true); // Open the update dialog
    }
  )

  // Queries
  const { data, isLoading, isError } = useQuery('products', fetchActiveProducts);
  
  // Mutations
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
      ) : isError ? (
        <p>Error cargando productos</p>
      ) : (
        <DataTable
          data={data ?? []}
          columns={columns}
          filterColumnId="name"
          collectionName="producto"
          formComponent={<ProductForm onOpenChange={setIsFormOpen} />}
          onFormOpenChange={setIsFormOpen}
          isFormOpen={isFormOpen}
        />
      )}
      <AlertDialogComponent
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={() => deleteMutation.mutate(selectedProduct?.id ?? 0)} />
      <UpdateFormDialogComponent
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        title={"Editar Producto"}
        description={"Aquí puedes editar la información del producto. Haz clic en guardar cuando hayas terminado."}
        formComponent={<ProductForm product={selectedProduct} onOpenChange={() => setIsUpdateDialogOpen(false)} />}/>
    </div>
  );
}
