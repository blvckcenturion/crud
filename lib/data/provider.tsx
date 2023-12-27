'use client'

import { Button } from "@/components/ui/button"
ProviderWithCountrySchema

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format, parseISO } from 'date-fns';
import { ProviderWithCountrySchema, ProviderWithCountryType } from "../schemas/provider"
import { Checkbox } from "@/components/ui/checkbox"

export const createProviderColumns = (openDialog: (provider: ProviderWithCountryType) => void, openUpdateDialog: (provider: ProviderWithCountryType) => void): ColumnDef<ProviderWithCountryType>[] => [
    {
    id: "select",
    header: ({ table }) => (
        <Checkbox
        checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
        />
    ),
    enableSorting: false,
    enableHiding: false,
    },
  {
    accessorKey: "name",
    header: "Nombre"
  },
  {
    accessorKey: "country.name",
    header: "País",
    cell: ({ row }) => row.original?.country?.name || "Sin País"
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha de Creación
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original.created_at;
    
      if (!dateValue) {
        return 'N/A';
      }
    
      try {
        const parsedDate = parseISO(dateValue); // parseISO is used for parsing ISO strings
        const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");
        return formattedDate;
      } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
      }
    }
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Última Actualización
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original.updated_at;
    
      if (!dateValue) {
        return 'N/A';
      }
    
      try {
        const parsedDate = parseISO(dateValue); // parseISO is used for parsing ISO strings
        const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");
        return formattedDate;
      } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
      }
    }
  },
    {
        id: "actions",
        cell: ({ row }) => {
            const provider = row.original
    
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openUpdateDialog(provider)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(provider)}>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
