"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProviderType, ProviderInsertUpdateSchema, paymentNumericalMapping } from "../../lib/schemas/provider"; // Adjust path as needed
import { useQuery } from "react-query";
import { useState } from "react";
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
      country_id: 1, // Assuming '1' is a valid default country_id
      social_reason: '',
      nit: '',
      address: '',
      location: '',
      city: '',
      phones: '',
      fax: '',
      email: '',
      contact_person: '',
      website: '',
      payment: 1 // Assuming 'contado' as the default payment method
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
        updateMutation.mutate({providerToUpdate: data, providerId: provider.id});
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

        {/* Social Reason Field */}
        <FormField control={form.control} name="social_reason" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="social_reason">Razón Social</FormLabel>
            <FormControl>
              <Input {...field} id="social_reason" placeholder="Ingrese la razón social" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* NIT Field */}
        <FormField control={form.control} name="nit" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="nit">NIT</FormLabel>
            <FormControl>
              <Input {...field} id="nit" placeholder="Ingrese el NIT" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Address Field */}
        <FormField control={form.control} name="address" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="address">Dirección</FormLabel>
            <FormControl>
              <Input {...field} id="address" placeholder="Ingrese la dirección" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Location Field */}
        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="location">Localidad</FormLabel>
            <FormControl>
              <Input {...field} id="location" placeholder="Ingrese la localidad" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* City Field */}
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="city">Ciudad</FormLabel>
            <FormControl>
              <Input {...field} id="city" placeholder="Ingrese la ciudad" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Phones Field */}
        <FormField control={form.control} name="phones" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="phones">Teléfonos</FormLabel>
            <FormControl>
              <Input {...field} id="phones" placeholder="Ingrese los números de teléfono" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Fax Field */}
        <FormField control={form.control} name="fax" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="fax">Fax</FormLabel>
            <FormControl>
              <Input {...field} id="fax" placeholder="Ingrese el número de fax" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Email Field */}
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="email">Correo Electrónico</FormLabel>
            <FormControl>
              <Input {...field} id="email" placeholder="Ingrese el correo electrónico" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Contact Person Field */}
        <FormField control={form.control} name="contact_person" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="contact_person">Persona de Contacto</FormLabel>
            <FormControl>
              <Input {...field} id="contact_person" placeholder="Ingrese el nombre de la persona de contacto" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Website Field */}
        <FormField control={form.control} name="website" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="website">Sitio Web</FormLabel>
            <FormControl>
              <Input {...field} id="website" placeholder="Ingrese la URL del sitio web" value={field.value || ''}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Payment Field */}
        <FormField control={form.control} name="payment" render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="payment">Forma de Pago</FormLabel>
            <FormControl>
              <Select {...field} value={String(field.value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una forma de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Contado</SelectItem>
                  <SelectItem value="2">Crédito</SelectItem>
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