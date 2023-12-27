"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Spinner, Stack } from "@chakra-ui/react";
import { ProviderWithCountryType } from "@/lib/schemas/provider";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ProviderForm } from "@/components/forms/provider/provider-form";
import { createProviderColumns } from "@/lib/data/provider";
import { deactivateProvider, fetchActiveProviders } from "@/lib/services/supabase/provider";
import AlertDialogComponent from "@/components/dialog/alert-dialog";
import useSuccessErrorMutation from "@/lib/mutations";
import UpdateFormDialogComponent from "@/components/dialog/update-dialog";

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
  const { data, isLoading, isError } = useQuery('providers', fetchActiveProviders)
  
  // Mutations
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
      <AlertDialogComponent
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={() => deleteMutation.mutate(selectedProvider?.id ?? 0)}
      />
      <UpdateFormDialogComponent
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        title={"Editar Proveedor"}
        description={"Aquí puedes editar la información del proveedor. Haz clic en guardar cuando hayas terminado."}
        formComponent={<ProviderForm provider={selectedProvider} onOpenChange={() => setIsUpdateDialogOpen(false)} />}/>
    </div>
  );
}
