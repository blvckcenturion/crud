"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { Spinner, Stack } from "@chakra-ui/react";
import { ImportCostsRow } from "@/lib/schemas/import-cost";
import { DataTable } from "@/components/ui/data-table/data-table";
import { deactivateImportCost, fetchActiveImportCosts } from "@/lib/services/supabase/import-cost";
import useSuccessErrorMutation from "@/lib/mutations";
import AlertDialogComponent from "@/components/dialog/alert-dialog";
import UpdateFormDialogComponent from "@/components/dialog/update-dialog";
import { createImportCostsColumns } from "@/lib/data/import-cost";
import { ImportCostsForm } from "@/components/forms/import-cost-form";

export default function ImportCostsPage() {
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImportCost, setSelectedImportCost] = useState<ImportCostsRow | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Columns creation
  const columns = createImportCostsColumns(
    (importCost) => {
      setSelectedImportCost(importCost); // Set the import cost to be deleted
      setIsDialogOpen(true); // Open the deletion confirmation dialog
    },
    (importCost) => {
      setSelectedImportCost(importCost); // Set the import cost to be updated
      setIsUpdateDialogOpen(true); // Open the update dialog
    }
  );

  // Queries
  const { data, isLoading, isError } = useQuery('import-costs', fetchActiveImportCosts);

  // Mutations
  const deleteMutation = useSuccessErrorMutation(
    deactivateImportCost,
    'Costo de Importación',
    'delete',
    { queryKey: ['import-costs'] }
  );

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Costos de Importación</h2>
      </div>
      {isLoading ? (
        <Stack>
          <Spinner size="xl" />
        </Stack>
      ) : isError ? (
        <p>Error cargando costos de importación</p>
      ) : (
        <DataTable
          data={data ?? []}
          columns={columns}
          filterColumnId="id" // Adjust based on filter requirements
          collectionName="costo de importación"
          formComponent={<ImportCostsForm onOpenChange={setIsFormOpen} />}
          onFormOpenChange={setIsFormOpen}
          isFormOpen={isFormOpen}
        />
      )}
      <AlertDialogComponent
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={() => deleteMutation.mutate(selectedImportCost?.id ?? 0)} />
      <UpdateFormDialogComponent
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        title={"Editar Costo de Importación"}
        description={"Aquí puedes editar la información del costo de importación. Haz clic en guardar cuando hayas terminado."}
        formComponent={<ImportCostsForm importCost={selectedImportCost} onOpenChange={() => setIsUpdateDialogOpen(false)} />} />
    </div>
  );
}