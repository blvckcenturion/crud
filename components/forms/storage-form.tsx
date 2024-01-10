"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { StorageRow, StorageInsertSchema, StorageUpdateSchema, BranchEnum, branchNumericalMapping } from "@/lib/schemas/storage";
import { addNewStorage, updateStorage } from "@/lib/services/supabase/storage";
import useSuccessErrorMutation from "@/lib/mutations";
import { ReloadIcon } from "@radix-ui/react-icons";

interface StorageFormProps {
  storage?: StorageRow | null; // Optional property for existing storage data
  onOpenChange: (isOpen: boolean) => void;
}

export function StorageForm({ storage, onOpenChange }: StorageFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(storage ? StorageUpdateSchema : StorageInsertSchema),
    mode: "onChange",
    defaultValues: storage || {
      name: '',
      address: '',
      branch: undefined,
      responsible: '',
      phones: '',
      location_url: '',
      comment:''
    },
  });

  // Mutations
  const addMutation = useSuccessErrorMutation(
    addNewStorage,
    'Almacén',
    'create',
    { queryKey: ['storage'] }
  );
  const updateMutation = useSuccessErrorMutation(
    updateStorage,
    'Almacén',
    'update',
    { queryKey: ['storage'] }
  );

  async function onSubmit(data: any) {
    try {
      setIsLoading(true);
  
      // Map branch name to its numerical value
      const mappedData = {
        ...data,
        branch: branchNumericalMapping[data.branch] || null,
      };
  
      if (storage && storage.id) {
        // If updating an existing storage location
        updateMutation.mutate({ storageData: mappedData, storageId: storage.id });
      } else {
        // If adding a new storage location
        addMutation.mutate(mappedData);
      }
  
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error in onSubmit function:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Nombre</FormLabel>
              <FormControl>
                <Input {...field} id="name" name="name" autoComplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Field */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="address">Dirección</FormLabel>
              <FormControl>
                <Input {...field} id="address" name="address" autoComplete="address" value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Branch Field */}
        <FormField control={form.control} name="branch" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="branch">Sucursal</FormLabel>
            <FormControl>
              <Select name="branch" onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {BranchEnum.options.map(branch => (
                    <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Responsible Field */}
        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="responsible">Responsable</FormLabel>
              <FormControl>
                <Input {...field} id="responsible" name="responsible" autoComplete="responsible" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phones Field */}
        <FormField
          control={form.control}
          name="phones"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phones">Teléfonos</FormLabel>
              <FormControl>
                <Input {...field} id="phones" name="phones" autoComplete="tel" value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location URL Field */}
        <FormField
          control={form.control}
          name="location_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="location_url">URL de ubicacion</FormLabel>
              <FormControl>
                <Input {...field} id="location_url" name="location_url" autoComplete="tel" value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comment Field */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="comment">Comentario</FormLabel>
              <FormControl>
                <Input {...field} id="comment" name="comment" autoComplete="tel" value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button disabled={isLoading}>
          {isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}