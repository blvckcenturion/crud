"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { supabase } from "@/lib/client/supabase";
import { Spinner, Stack } from "@chakra-ui/react";
import { ProviderWithCountryType, ProviderInsertUpdateSchema } from "../../../lib/schemas/provider/schema";
import { DataTable } from "@/components/ui/data-table/data-table";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProviderForm } from "../../../components/forms/provider/provider-form";
import { useToast } from "@/components/ui/use-toast";
import { createProviderColumns } from "../../../lib/data/provider/columns";

export default function ProviderPage() {
  const [selectedProvider, setSelectedProvider] = useState<ProviderWithCountryType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const { data, isLoading, isError } = useQuery(
    "providers",
    async () => {
      const { data, error } = await supabase
        .from("providers")
        .select(`
          *,
          country:country_id (name)
        `)
        .eq("active", true)
        .order("id", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  );

  const deleteProviderMutation = useMutation(
    async (providerId: number) => {
      const { error } = await supabase
        .from('providers')
        .update({ active: false, updated_at: new Date().toISOString() })
        .match({ id: providerId });
      if (error) throw new Error(error.message);
    },
    {
      onSuccess: () => {
        toast({
          variant: "default",
          title: "Proveedor eliminado con éxito"
        });
        queryClient.invalidateQueries('providers');
        setIsDialogOpen(false);
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar proveedor"
        });
      }
    }
  );

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
        <p>Error loading providers</p>
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
            <AlertDialogAction onClick={() => deleteProviderMutation.mutate(selectedProvider?.id ?? 0)}>
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
