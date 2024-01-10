// storageColumns.ts

import { Button } from "@/components/ui/button";
import { StorageRow, BranchEnum } from "../schemas/storage"; // Adjust the import path to your storage schema

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox";
import validUrl from 'valid-url';

export const createStorageColumns = (
  openDialog: (storage: StorageRow) => void, 
  openUpdateDialog: (storage: StorageRow) => void
): ColumnDef<StorageRow>[] => [
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return `AC-${row.original.id}`
    }
  },
  {
    accessorKey: "name",
    header: "Nombre"
    },
  
  {
    accessorKey: "address",
    header: "Dirección"
  },
  {
    accessorKey: "phones",
    header: "Telefonos"
  },
  {
    accessorKey: "branch",
    header: "Sucursal",
    cell: ({ row }) => {
      console.log(row.original.branch)
      return BranchEnum.enum[row.original.branch] || "Desconocido"
    }
  },
  {
    accessorKey: "responsible",
    header: "Responsable"
    },
    {
      accessorKey: "location_url",
      header: "URL de ubicacion",
      cell: ({ row }) => {
        const text = row.original.location_url;
        const parts = text?.split(' '); // Split the text into parts
        return (
          <span>
            {parts?.map((part, index) => {
              if (validUrl.isUri(part)) {
                return (
                  <span key={index}>
                    <a href={part} className="hover:underline font-bold">{part}</a>{' '}
                  </span>
                ); // Render valid URLs as links with underline and bold
              } else {
                return <span key={index}>{part} </span>; // Render the rest of the text as regular with space
              }
            })}
          </span>
        );
      }
    },
    {
      accessorKey: "comment",
      header: "Comentario"
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
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => {
      return row.original.active ? "Habilitado" : "Deshabilitado"
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const storage = row.original;

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
            <DropdownMenuItem onClick={() => openUpdateDialog(storage)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog(storage)}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];