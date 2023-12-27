"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Spinner, Stack } from "@chakra-ui/react";
import { ProviderWithCountryType } from "@/lib/schemas/provider/schema";
import { DataTable } from "@/components/ui/data-table/data-table";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProviderForm } from "@/components/forms/provider/provider-form";
import { createProviderColumns } from "@/lib/data/provider/columns";
import { deactivateProvider, fetchActiveProviders } from "@/lib/services/supabase/provider";
import useSuccessErrorMutation from "@/lib/mutations";

export default function ProviderPage() {
  // State
  const [selectedProvider, setSelectedProvider] = useState<ProviderWithCountryType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Columns creation 
  const columns = createProviderColumns(
    (provider) => {
      setSelectedProvider(provider); // Set the provider to be deleted
      setIsDialogOpen(true); // Open the delete confirmation dialog
    },
    (provider) => {
      setSelectedProvider(provider); // Set the provider to be updated
      setIsUpdateDialogOpen(true); // Open the update dialog
    }
  );

  // Queries
  const {data, isLoading, isError} = useQuery('providers', fetchActiveProviders)
  const deleteMutation = useSuccessErrorMutation(
    deactivateProvider,
    'Proveedor',
    'delete',
    {
      queryKey: ['providers']
    }
  )

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Proveedores</h2>
      </div>
      {isLoading ? (
        <Stack>
          <Spinner size="xl" />
        </Stack>
      ) : isError ? (
        <p>Error cargando proveedores</p>
      ) : (
        <DataTable
          data={data ?? []}
          columns={columns}
          filterColumnId="name"
          collectionName="proveedor"
          formComponent={<ProviderForm onOpenChange={setIsFormOpen} />}
          onFormOpenChange={setIsFormOpen}
          isFormOpen={isFormOpen}
        />
      )}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proveedor de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate(selectedProvider?.id ?? 0)}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="w-full sm:w-1/2 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>
              Aquí puedes editar la información del proveedor. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <ProviderForm provider={selectedProvider} onOpenChange={() => setIsUpdateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
