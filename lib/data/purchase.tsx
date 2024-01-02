'use client';

import { Button } from "@/components/ui/button";
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
import { PurchaseWithItemsExtended, PurchaseTypeEnum, PurchaseTypeReverseMapping } from "../schemas/purchase";

const formatUSD = (value: number) => `$${value.toFixed(2)} USD`;

const renderPurchaseItemsDetails = (items: any[]) => (
  <ul>
    {items.map((item, index) => (
      <li key={index} className="font-semibold">
        {item.productName}: {item.qty} x {formatUSD(item.unitary_price)} = {formatUSD(item.qty * item.unitary_price)}
      </li>
    ))}
  </ul>
);

export const createPurchaseColumns = (openDialog: (purchase: PurchaseWithItemsExtended) => void, openUpdateDialog: (purchase: PurchaseWithItemsExtended) => void): ColumnDef<PurchaseWithItemsExtended>[] => [
  // Select column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: "ID"
  },
  {
    accessorKey: "storageName",
    header: "Almacen"
  },
  {
    accessorKey: "type",
    header: "Tipo de Compra",
    cell: ({ row }) => {
      return PurchaseTypeReverseMapping[Number(row.original.type)] || "Desconocido"
    }
  },
  {
    id: "purchase_items",
    header: "Detalles",
    cell: ({ row }) => renderPurchaseItemsDetails(row.original.purchase_items || [])
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    cell: ({ row }) => {
        const subtotal = row.original.purchase_items ? row.original.purchase_items.reduce((total, item) => total + (item.qty * item.unitary_price), 0) : 0;
        return formatUSD(subtotal);
      }
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
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const purchase = row.original;
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
            <DropdownMenuItem onClick={() => openUpdateDialog(purchase)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDialog(purchase)}>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];