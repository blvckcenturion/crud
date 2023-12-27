"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProviderType, ProviderInsertUpdateSchema } from "../../../lib/schemas/provider/schema"; // Adjust path as needed
import { useMutation, useQuery, useQueryClient } from "react-query";
import { supabase } from "@/lib/client/supabase";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import useSuccessErrorMutation from "@/lib/mutations";
import { addNewProvider, updateProvider } from "@/lib/services/supabase/provider";
import { fetchCountries } from "@/lib/services/supabase/country";

interface ProviderFormProps {
  provider?: ProviderType | null;
  onOpenChange: (isOpen: boolean) => void;
}

export function ProviderForm({ provider, onOpenChange }: ProviderFormProps) {
  // State
  const [isLoading, setIsLoading] = useState(false);

  // Form
  const form = useForm({
    resolver: zodResolver(ProviderInsertUpdateSchema.omit({
      id: true,
      active: true,
      created_at: true,
      updated_at: true,
    })),
    mode: "onChange",
    defaultValues: provider || {
      name: '',
      country_id: 1
    }
  });

  // Mutations
  const addMutation = useSuccessErrorMutation(
    addNewProvider,
    'Proveedor',
    'create',
    {
      queryKey: ['providers']
    }
  )
  const updateMutation = useSuccessErrorMutation(
    updateProvider,
    'Proveedor',
    'update',
    {
      queryKey: ['providers']
    }
  )

  //Queries
  const { data: countries, isLoading: isLoadingCountries } = useQuery("countries", fetchCountries);

  // Helper functions
  const onSubmit = async (data: ProviderType) => {
    try {
      setIsLoading(true)
      if (provider && provider.id) {
        updateMutation.mutate({ ...data, id: provider.id });
      } else {
        addMutation.mutate(data);
      }
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-2 space-y-8 overflow-y-auto max-h-[80vh]">
        {/* Name Field */}
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="name">Nombre</FormLabel>
            <FormControl>
              <Input {...field} id="name" name="name" value={field.value || ''} autoComplete="name"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Country Field */}
         <FormField control={form.control} name="country_id" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="country_id">País</FormLabel>
            <FormControl>
              <Select name="country_id" onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={isLoadingCountries}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un país" />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map(country => (
                    <SelectItem key={country.id} value={String(country.id)}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Espere por favor" : "Guardar"} 
        </Button>
      </form>
    </Form>
  );
}