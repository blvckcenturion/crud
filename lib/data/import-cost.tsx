// importCostsColumns.ts

import { Button } from "@/components/ui/button";
import { ImportCostsRow } from "../schemas/import-cost"; // Adjust the import path to your import cost schema

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

export const createImportCostsColumns = (
  openDialog: (importCost: ImportCostsRow) => void, 
  openUpdateDialog: (importCost: ImportCostsRow) => void
): ColumnDef<ImportCostsRow>[] => [
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
      header: "ID de costo"
  },
  {
    accessorKey: "order_id",
    header: "ID de Orden"
  },
  {
    accessorKey: "providers.name",
    header: "Nombre del Proveedor",
    cell: ({ row }) => row.original.providers?.name || 'Desconocido'
  },
  {
    accessorKey: "fob_value",
    header: "Valor FOB"
  },
  {
    accessorKey: "maritime_transport_cost",
    header: "Costo de Transporte Marítimo"
  },
  {
    accessorKey: "land_transport_cost",
    header: "Costo de Transporte Terrestre"
  },
  {
    accessorKey: "tax_iva",
    header: "Impuesto IVA"
  },
  {
    accessorKey: "net_value",
    header: "Valor Neto"
  },
  {
    accessorKey: "additional_costs",
    header: "Costos Adicionales"
  },
  {
    accessorKey: "import_date",
    header: "Fecha de Importación",
    cell: ({ row }) => {
      const dateValue = row.original.import_date;
      return dateValue ? format(parseISO(dateValue), "yyyy-MM-dd") : 'N/A';
    }
  },
  {
    accessorKey: "additional_notes",
    header: "Notas Adicionales"
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
      const importCost = row.original;

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
            <DropdownMenuItem onClick={() => openUpdateDialog(importCost)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog(importCost)}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];
