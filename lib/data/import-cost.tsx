// importCostsColumns.ts

import { Button } from "@/components/ui/button";
import { ImportCostsRow, ImportCostsWithDetailsAndProvider } from "../schemas/import-cost"; // Adjust the import path to your import cost schema

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

const formatBOB = (value: number) => `$${value.toFixed(2)} BOB`;

// Function to render unit costs details
const renderCostUnitarios = (details: any[]) => (
  <ul>
    {details.map((detail, index) => (
      <li key={index} className="font-semibold">
        {detail.productName}: {formatBOB(detail.unit_cost)}
      </li>
    ))}
  </ul>
);


export const createImportCostsColumns = (
  openDialog: (importCost: ImportCostsRow) => void, 
  openUpdateDialog: (importCost: ImportCostsRow) => void
): ColumnDef<ImportCostsWithDetailsAndProvider>[] => [
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
      header: "ID de importacion"
  },
  {
    accessorKey: "order_id",
    header: "ID de Compra",
    cell: ({ row }) => {
      return `ORDEN-${row.original.id}`
    }
    },
    {
    accessorKey: "cif_value",
      header: "Total Valor CIF",
    cell: ({row}) => formatBOB(row.original.cif_value)
    },
  {
    accessorKey: "providerName",
    header: "Proveedor"
  }, 
  {
  accessorKey: "net_total_warehouse_cost",
    header: "Costo total Neto Almacenes",
    cell: ({row}) => formatBOB(row.original.net_total_warehouse_cost)
    },
    {
      id: "costos_unitarios",
      header: "Costos Unitarios",
      cell: ({ row }) => renderCostUnitarios(row.original.import_costs_detail || [])
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
              <DropdownMenuItem onClick={() => openUpdateDialog(row.original)}>Ver Detalles</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
];
