'use client'

import { Button } from "@/components/ui/button"
import { Product, ProductWithProvider, classMapping, formatMapping, typeMapping } from "../schemas/product"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { format, parseISO } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

type EnumType = 'class' | 'format' | 'type';

const getEnumLabel = (type: EnumType, value: string | number) => {
  const mappings: Record<EnumType, Record<string, string>> = {
    class: classMapping,
    format: formatMapping,
    type: typeMapping
  };

  const mapping = mappings[type];
  const stringValue = typeof value === 'number' ? value.toString() : value;
  const label = Object.keys(mapping).find(key => mapping[key] === stringValue);

  return label || "Desconocido";
};

export const createProductColumns = (openDialog: (product: ProductWithProvider) => void, openUpdateDialog: (product: ProductWithProvider) => void): ColumnDef<ProductWithProvider>[] => [
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
    accessorKey: "image_url", // Assuming 'image_url' is the key for the image
    header: "Imagen",
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.original.image_url || ''} alt={row.original.name || ''} />
        <AvatarFallback>{(row.original.name || '').charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  {
      accessorKey: "name",
      header: "Nombre"
  },
  {
    accessorKey: "alias",
    header: "Lote"
  },
    {
        accessorKey: "description",
        header: "Descripcion"
  },
  {
    accessorKey: "provider.name",
    header: "Proveedor",
    cell: ({ row }) => row.original.provider?.name || 'Sin Proveedor'
  },
  {
    accessorKey: "class",
    header: "Linea",
    cell: ({ row }) => getEnumLabel("class", row.original.class || '')
  },
  {
    accessorKey: "format",
    header: "Formato",
    cell: ({ row }) => getEnumLabel("format", row.original.format || '')
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => getEnumLabel("type", row.original.type || '')
  },
  {
    accessorKey: "min_stock",
    header: "Cantidad Minima Stock"
  },
  {
    accessorKey: "max_stock",
    header: "Cantidad Minima Stock"
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
              <DropdownMenuItem onClick={() => openUpdateDialog(row.original)}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openDialog(row.original)}>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]
