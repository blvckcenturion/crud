"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Spinner, Stack } from "@chakra-ui/react";
import { StorageRow } from "@/lib/schemas/storage";
import { DataTable } from "@/components/ui/data-table/data-table";
import { createStorageColumns } from "@/lib/data/storage"; // Modify this to suit storage column creation
import { StorageForm } from "@/components/forms/storage-form"; // Create a similar form for storage
import { deactivateStorage, fetchActiveStorage } from "@/lib/services/supabase/storage";
import useSuccessErrorMutation from "@/lib/mutations";
import AlertDialogComponent from "@/components/dialog/alert-dialog";
import UpdateFormDialogComponent from "@/components/dialog/update-dialog";

export default function StoragePage() {
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<StorageRow | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Columns creation
  const columns = createStorageColumns(
    (storage) => {
      setSelectedStorage(storage); // Set the storage to be deleted
      setIsDialogOpen(true); // Open the deletion confirmation dialog
    },
    (storage) => {
      setSelectedStorage(storage); // Set the storage to be updated
      setIsUpdateDialogOpen(true); // Open the update dialog
    }
  );

  // Queries
  const { data, isLoading, isError } = useQuery('storage', fetchActiveStorage);

  // Mutations
  const deleteMutation = useSuccessErrorMutation(
    deactivateStorage,
    'Almacén',
    'delete',
    { queryKey: ['storage'] }
  );

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Almacenes</h2>
      </div>
      {isLoading ? (
        <Stack>
          <Spinner size="xl" />
        </Stack>
      ) : isError ? (
        <p>Error cargando almacenes</p>
      ) : (
        <DataTable
          data={data ?? []}
          columns={columns}
          filterColumnId="name"
          collectionName="almacén"
          formComponent={<StorageForm onOpenChange={setIsFormOpen} />}
          onFormOpenChange={setIsFormOpen}
          isFormOpen={isFormOpen}
        />
      )}
      <AlertDialogComponent
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={() => deleteMutation.mutate(selectedStorage?.id ?? 0)} />
      <UpdateFormDialogComponent
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        title={"Editar Almacén"}
        description={"Aquí puedes editar la información del almacén. Haz clic en guardar cuando hayas terminado."}
        formComponent={<StorageForm storage={selectedStorage} onOpenChange={() => setIsUpdateDialogOpen(false)} />} />
    </div>
  );
}
