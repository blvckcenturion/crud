'use client'

import { Button } from "@/components/ui/button"
import { Product } from "./schema"

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
import { ProductSchema } from "./schema"
import { format } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox"

export const createColumns = (openDialog: (product: Product) => void): ColumnDef<Product>[] => [
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
        accessorKey: "description",
        header: "Descripcion"
    },
    {
        accessorKey: "unit",
        header: "Unidad"
    },
    {
        accessorKey: "unit_x_measure_unit",
        header: "unit_x_measure_unit"
    },
    {
        accessorKey: "measure_unit_description",
        header: "measure_unit_description"
    },
    {
        accessorKey: "unit_x_max_unit",
        header: "unit_x_max_unit"
    },
    {
        accessorKey: "max_unit_description",
        header: "max_unit_description"
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha de Creacion
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      )
    },
    cell: ({ row }) => format(new Date(row.original.created_at!), "yyyy-MM-dd HH:mm:ss")
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Ultima Actualizacion
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
      )
    },
    cell: ({ row }) => format(new Date(row.original.updated_at!), "yyyy-MM-dd HH:mm:ss")
  },
  {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original
    
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => console.log('copiar')}
              >
                Copiar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver</DropdownMenuItem>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDialog(row.original)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
