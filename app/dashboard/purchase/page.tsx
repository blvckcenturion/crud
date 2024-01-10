"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Spinner, Stack } from "@chakra-ui/react";
import { PurchaseWithItemsExtended } from "@/lib/schemas/purchase";
import { DataTable } from "@/components/ui/data-table/data-table";
import { PurchaseForm } from "@/components/forms/purchase-form";
import { createPurchaseColumns } from "@/lib/data/purchase"; // You need to create this function
import { deletePurchaseWithItems, fetchActivePurchasesWithItems } from "@/lib/services/supabase/purchase";
import AlertDialogComponent from "@/components/dialog/alert-dialog";
import useSuccessErrorMutation from "@/lib/mutations";
import UpdateFormDialogComponent from "@/components/dialog/update-dialog";

export default function PurchasePage() {
  // State
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseWithItemsExtended | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Columns creation 
  const columns = createPurchaseColumns(
    (purchase) => {
      setSelectedPurchase(purchase); // Set the purchase to be deleted
      setIsDialogOpen(true); // Open the delete confirmation dialog
    },
    (purchase) => {
      setSelectedPurchase(purchase); // Set the purchase to be updated
      setIsUpdateDialogOpen(true); // Open the update dialog
    }
  );

  // Queries
  const { data, isLoading, isError } = useQuery('purchases', fetchActivePurchasesWithItems)
  
  // Mutations
  const deleteMutation = useSuccessErrorMutation(
    deletePurchaseWithItems,
    'Compra',
    'delete',
    {
      queryKey: ['purchases']
    }
  )

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Compras</h2>
      </div>
      {isLoading ? (
        <Stack>
          <Spinner size="xl" />
        </Stack>
      ) : isError ? (
        <p>Error cargando compras</p>
      ) : (
        <DataTable
          data={data ?? []}
          columns={columns}
          filterColumnId="id"
          collectionName="compra"
          formComponent={<PurchaseForm onOpenChange={setIsFormOpen} />}
          onFormOpenChange={setIsFormOpen}
          isFormOpen={isFormOpen}
        />
      )}
      <AlertDialogComponent
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={() => deleteMutation.mutate(selectedPurchase?.id ?? 0)}
      />
      <UpdateFormDialogComponent
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        title={"Editar Compra"}
        description={"Aquí puedes editar la información de la compra. Haz clic en guardar cuando hayas terminado."}
        formComponent={<PurchaseForm purchase={selectedPurchase} onOpenChange={() => setIsUpdateDialogOpen(false)} />}/>
    </div>
  );
}