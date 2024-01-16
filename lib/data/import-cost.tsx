// importCostsColumns.ts

import { Button } from "@/components/ui/button";
import {
  ImportCostsRow,
  ImportCostsWithDetailsAndProvider,
} from "../schemas/import-cost"; // Adjust the import path to your import cost schema

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

import { fetchActivePurchaseWithItemsById } from "@/lib/services/supabase/purchase";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { PurchaseWithItemsExtended } from "../schemas/purchase";
import { Nerko_One } from "next/font/google";

interface TransposedRow {
  Variable: string;
  [key: string]: any; // This allows any number of additional properties with string keys
}
interface ColumnNamesType {
  [key: string]: string;
}

interface RowType {
  [key: string]: any;
}

// Example column name mapping
const columnNames: ColumnNamesType = {
  id: "ID",
  order_id: "ID de Pedido",
  active: "Activo",
  created_at: "Fecha de Creación",
  updated_at: "Fecha de Actualización",
  productos: "Productos",
  cantidad: "Cantidad",
  precio: "Precio",
  FOB: "FOB",
  coefficient_value: "Coeficiente de Distribucion",
  maritime_transportation: "Transporte Marítimo",
  maritime_transportation_detail: "Detalle del Transporte Marítimo",
  land_transportation: "Transporte Terrestre",
  land_transportation_detail: "Detalle del Transporte Terrestre",
  foreign_insurance: "Seguro Extranjero",
  foreign_insurance_detail: "Detalle del Seguro Extranjero",
  aspb_port_expenses: "Gastos de Puerto ASPB",
  aspb_port_expenses_detail: "Detalle de Gastos de Puerto ASPB",
  intermediary_commissions: "Comisiones de Intermediarios",
  intermediary_commissions_detail: "Detalle de Comisiones de Intermediarios",
  other_expenses_i: "Otros Gastos I",
  other_expenses_i_detail: "Detalle de Otros Gastos I",
  consolidated_tax_duty: "Derecho de Impuesto Consolidado",
  consolidated_tax_duty_detail: "Detalle del Derecho de Impuesto Consolidado",
  value_added_tax_iva: "IVA (Impuesto al Valor Agregado)",
  value_added_tax_iva_detail: "Detalle del IVA",
  specific_consumption_tax_ice: "ICE (Impuesto al Consumo Específico)",
  specific_consumption_tax_ice_detail: "Detalle del ICE",
  other_penalties: "Otras Penalizaciones",
  other_penalties_detail: "Detalle de Otras Penalizaciones",
  albo_customs_storage: "Almacén Aduanero Albo",
  albo_customs_storage_detail: "Detalle del Almacén Aduanero Albo",
  albo_customs_logistics: "Logística Aduanera Albo",
  albo_customs_logistics_detail: "Detalle de la Logística Aduanera Albo",
  dui_forms: "Formularios DUI",
  dui_forms_detail: "Detalle de Formularios DUI",
  djv_forms: "Formularios DJV",
  djv_forms_detail: "Detalle de Formularios DJV",
  other_expenses_ii: "Otros Gastos II",
  other_expenses_ii_detail: "Detalle de Otros Gastos II",
  chamber_of_commerce: "Cámara de Comercio",
  chamber_of_commerce_detail: "Detalle de la Cámara de Comercio",
  senasag: "SENASAG",
  senasag_detail: "Detalle del SENASAG",
  custom_agent_commissions: "Comisiones del Agente Aduanal",
  custom_agent_commissions_detail: "Detalle de Comisiones del Agente Aduanal",
  financial_commissions: "Comisiones Financieras",
  financial_commissions_detail: "Detalle de Comisiones Financieras",
  other_commissions: "Otras Comisiones",
  other_commissions_detail: "Detalle de Otras Comisiones",
  national_transportation: "Transporte Nacional",
  national_transportation_detail: "Detalle del Transporte Nacional",
  insurance: "Seguro",
  insurance_detail: "Detalle del Seguro",
  handling_and_storage: "Manejo y Almacenamiento",
  handling_and_storage_detail: "Detalle de Manejo y Almacenamiento",
  other_expenses_iii: "Otros Gastos III",
  other_expenses_iii_detail: "Detalle de Otros Gastos III",
  optional_expense_1: "Gasto Opcional 1",
  optional_expense_1_detail: "Detalle del Gasto Opcional 1",
  optional_expense_2: "Gasto Opcional 2",
  optional_expense_2_detail: "Detalle del Gasto Opcional 2",
  optional_expense_3: "Gasto Opcional 3",
  optional_expense_3_detail: "Detalle del Gasto Opcional 3",
  optional_expense_4: "Gasto Opcional 4",
  optional_expense_4_detail: "Detalle del Gasto Opcional 4",
  optional_expense_5: "Gasto Opcional 5",
  optional_expense_5_detail: "Detalle del Gasto Opcional 5",
  fob_value: "Valor FOB",
  cif_value: "Valor CIF",
  total_warehouse_cost: "Costo Total de Almacenamiento",
  cf_iva: "CF IVA",
  net_total_warehouse_cost: "Costo Neto Total de Almacenamiento",
  import_costs_detail: "Detalle de Costos de Importación",
  providerName: "Nombre del Proveedor",
};

const calculoColumns: string[] = [
  "productos",
  "cantidad",
  "precio",
  "FOB",
  "coefficient_value",
  "maritime_transportation",
  "land_transportation",
  "foreign_insurance",
  "aspb_port_expenses",
  "intermediary_commissions",
  "other_expenses_i",
  "consolidated_tax_duty",
  "value_added_tax_iva",
  "specific_consumption_tax_ice",
  "other_penalties",
  "albo_customs_storage",
  "albo_customs_logistics",
  "dui_forms",
  "djv_forms",
  "other_expenses_ii",
  "chamber_of_commerce",
  "senasag",
  "custom_agent_commissions",
  "financial_commissions",
  "other_commissions",
  "national_transportation",
  "insurance",
  "handling_and_storage",
  "other_expenses_iii",
  "optional_expense_1",
  "optional_expense_2",
  "optional_expense_3",
  "optional_expense_4",
  "optional_expense_5",
];

const selectColumnsForCalculo = async (
  data: any[],
  columns: string[],
  columnNames: ColumnNamesType
) => {
  const formValues = data.map((row: any) => {
    const newRow: Record<string, any> = {};
    columns.forEach((column) => {
      const translatedColumnName = columnNames[column];
      if (translatedColumnName) {
        newRow[translatedColumnName] = row[column];
      }
    });
    console.log("formValues", newRow);
    return newRow;
  });

  console.log("data", data);

  const productsValues: PurchaseWithItemsExtended | null = await fetchActivePurchaseWithItemsById(data[0].order_id);
  console.log("productsValeus", productsValues);
  productsValues?.purchase_items?.forEach((item) => {
    const newRow: Record<string, any> = {};
    newRow["Productos"] = item.productName;
    newRow["Cantidad"] = item.qty;
    newRow["Precio"] = item.unitary_price;
    newRow["FOB"] = Number((Number(item.qty.toFixed(2)) * Number(item.unitary_price.toFixed(2))).toFixed(2));
    const coefficient_value = (Number(item.qty.toFixed(2)) * Number(item.unitary_price.toFixed(2)))/Number(data[0].fob_value.toFixed(2));
    newRow["Coeficiente de Distribucion"] = coefficient_value;
    newRow["Transporte Marítimo"] = Number((coefficient_value * Number(data[0].maritime_transportation)).toFixed(2)).toFixed(2);
    newRow["Transporte Terrestre"] = Number((coefficient_value * Number(data[0].land_transportation)).toFixed(2)).toFixed(2);
    newRow["Seguro Extranjero"] = Number((coefficient_value * Number(data[0].foreign_insurance)).toFixed(2)).toFixed(2);
    newRow["Gastos de Puerto ASPB"] = Number((coefficient_value * Number(data[0].aspb_port_expenses)).toFixed(2)).toFixed(2);
    newRow["Comisiones de Intermediarios"] = Number((coefficient_value * Number(data[0].intermediary_commissions)).toFixed(2)).toFixed(2);
    newRow["Otros Gastos I"] = Number((coefficient_value * Number(data[0].other_expenses_i)).toFixed(2)).toFixed(2);
    newRow["Derecho de Impuesto Consolidado"] = Number((coefficient_value * Number(data[0].consolidated_tax_duty)).toFixed(2)).toFixed(2);
    newRow["IVA (Impuesto al Valor Agregado)"] = Number((coefficient_value * Number(data[0].value_added_tax_iva)).toFixed(2)).toFixed(2);
    newRow["ICE (Impuesto al Consumo Específico)"] = Number((coefficient_value * Number(data[0].specific_consumption_tax_ice)).toFixed(2)).toFixed(2);
    newRow["Otras Penalizaciones"] = Number((coefficient_value * Number(data[0].other_penalties)).toFixed(2)).toFixed(2);
    newRow["Almacén Aduanero Albo"] = Number((coefficient_value * Number(data[0].albo_customs_storage)).toFixed(2)).toFixed(2);
    newRow["Logística Aduanera Albo"] = Number((coefficient_value * Number(data[0].albo_customs_logistics)).toFixed(2)).toFixed(2);
    newRow["Formularios DUI"] = Number((coefficient_value * Number(data[0].dui_forms)).toFixed(2)).toFixed(2);
    newRow["Formularios DJV"] = Number((coefficient_value * Number(data[0].djv_forms)).toFixed(2)).toFixed(2);
    newRow["Otros Gastos II"] = Number((coefficient_value * Number(data[0].other_expenses_ii)).toFixed(2)).toFixed(2);
    newRow["Cámara de Comercio"] = Number((coefficient_value * Number(data[0].chamber_of_commerce)).toFixed(2)).toFixed(2);
    newRow["SENASAG"] = Number((coefficient_value * Number(data[0].senasag)).toFixed(2)).toFixed(2);
    newRow["Comisiones del Agente Aduanal"] = Number((coefficient_value * Number(data[0].custom_agent_commissions)).toFixed(2)).toFixed(2);
    newRow["Comisiones Financieras"] = Number((coefficient_value * Number(data[0].financial_commissions)).toFixed(2)).toFixed(2);
    newRow["Otras Comisiones"] = Number((coefficient_value * Number(data[0].other_commissions)).toFixed(2)).toFixed(2);
    newRow["Transporte Nacional"] = Number((coefficient_value * Number(data[0].national_transportation)).toFixed(2)).toFixed(2);
    newRow["Seguro"] = Number((coefficient_value * Number(data[0].insurance)).toFixed(2)).toFixed(2);
    newRow["Manejo y Almacenamiento"] = Number((coefficient_value * Number(data[0].handling_and_storage)).toFixed(2)).toFixed(2);
    newRow["Otros Gastos III"] = Number((coefficient_value * Number(data[0].other_expenses_iii)).toFixed(2)).toFixed(2);
    newRow["Gasto Opcional 1"] = Number((coefficient_value * Number(data[0].optional_expense_1)).toFixed(2)).toFixed(2);
    newRow["Gasto Opcional 2"] = Number((coefficient_value * Number(data[0].optional_expense_2)).toFixed(2)).toFixed(2);
    newRow["Gasto Opcional 3"] = Number((coefficient_value * Number(data[0].optional_expense_3)).toFixed(2)).toFixed(2);
    newRow["Gasto Opcional 4"] = Number((coefficient_value * Number(data[0].optional_expense_4)).toFixed(2)).toFixed(2);
    newRow["Gasto Opcional 5"] = Number((coefficient_value * Number(data[0].optional_expense_5)).toFixed(2)).toFixed(2);

    formValues.push(newRow);
  }
  );
  console.log("formValues", formValues);

  return formValues;
};

const exportToExcel = async (
  data: any,
  fileName: string,
  columnNames: Record<string, string>,
  calculoColumns: string[] = []
) => {
  const transposedDataResolved = await transposeData(data, columnNames);
  const worksheet = XLSX.utils.json_to_sheet(transposedDataResolved);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Create the "Calculo" sheet with selected columns
  const calculoData = selectColumnsForCalculo(
    data,
    calculoColumns,
    columnNames
  );
  const calculoDataResolved = await calculoData;
  const calculoWorksheet = XLSX.utils.json_to_sheet(calculoDataResolved);
  XLSX.utils.book_append_sheet(workbook, calculoWorksheet, "Calculo");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const transposeData =  (
  data: any[],
  columnNames: Record<string, string>
): TransposedRow[] => {
  // Assuming 'data' is an array of objects

  // Create an array of column names based on the provided columnNames map
  let headers = Object.keys(columnNames);

  // Initialize the transposed data with headers
  let transposedData: TransposedRow[] = headers.map((header) => ({
    Variable: columnNames[header],
  }));

  // Transpose the data
  data.forEach((item, rowIndex) => {
    headers.forEach((header, colIndex) => {
      transposedData[colIndex][`Valor${rowIndex + 1}`] = item[header];
    });
  });

  return transposedData;
};

const exportPDF = (row: RowType) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  let x = 40; // Horizontal position (left margin)
  let y = 60; // Vertical position (top margin)

  const firstColumnWidth = 260;
  const secondColumnWidth = 220;
  const rowHeight = 20; // Height of each row
  const padding = -1; // Padding inside each cell

  // Draw table headers
  pdf.setFontSize(12);
  pdf.text("Concepto", x + padding, y + padding);
  pdf.text("Valor", x + firstColumnWidth + padding, y + padding);

  y += rowHeight; // Move to the next row

  // Draw rows
  Object.keys(columnNames).forEach((key) => {
    if (row[key] !== undefined) {
      pdf.text(columnNames[key], x + padding, y + padding);
      pdf.text(
        row[key].toString(),
        x + firstColumnWidth + padding,
        y + padding
      );
      y += rowHeight;
    }
  });

  // Draw grid lines
  const endY = y; // Y position after the last row
  y = 60; // Reset y to the start position of the table

  // Vertical lines
  pdf.lines([[0, endY - y]], x, y); // First column line
  pdf.lines([[0, endY - y]], x + firstColumnWidth, y); // Second column line
  pdf.lines([[0, endY - y]], x + firstColumnWidth + secondColumnWidth, y); // Rightmost line

  // Horizontal lines
  for (let currentY = y; currentY <= endY; currentY += rowHeight) {
    pdf.lines([[firstColumnWidth + secondColumnWidth, 0]], x, currentY); // Row line
  }

  pdf.save("exported-data.pdf");
};

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
    header: "ID de importacion",
  },
  {
    accessorKey: "order_id",
    header: "ID de Compra",
    cell: ({ row }) => {
      return `ORDEN-${row.original.id}`;
    },
  },
  {
    accessorKey: "cif_value",
    header: "Total Valor CIF",
    cell: ({ row }) => formatBOB(row.original.cif_value),
  },
  {
    accessorKey: "providerName",
    header: "Proveedor",
  },
  {
    accessorKey: "total_warehouse_cost",
    header: "Costo Total Almacenes",
    cell: ({ row }) => formatBOB(row.original.total_warehouse_cost),
  },
  {
    accessorKey: "net_total_warehouse_cost",
    header: "Costo Total Neto Almacenes",
    cell: ({ row }) => formatBOB(row.original.net_total_warehouse_cost),
  },
  {
    accessorKey: "net_total_warehouse_cost_calculated",
    header: "Costo Total Neto Almacenes CALCULADO",
    cell: ({ row }) =>
      formatBOB(row.original.net_total_warehouse_cost_calculated),
  },
  {
    id: "costos_unitarios",
    header: "Costos Unitarios",
    cell: ({ row }) =>
      renderCostUnitarios(row.original.import_costs_detail || []),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fecha de Creación
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original.created_at;
      if (!dateValue) {
        return "N/A";
      }
      try {
        const parsedDate = parseISO(dateValue); // parseISO is used for parsing ISO strings
        const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");
        return formattedDate;
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
      }
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Última Actualización
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.original.updated_at;
      if (!dateValue) {
        return "N/A";
      }
      try {
        const parsedDate = parseISO(dateValue); // parseISO is used for parsing ISO strings
        const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm:ss");
        return formattedDate;
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
      }
    },
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
            <DropdownMenuItem onClick={() => openUpdateDialog(row.original)}>
              Ver Detalles
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                exportToExcel(
                  [row.original],
                  "ExportData",
                  columnNames,
                  calculoColumns
                )
              }
            >
              Exportar Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportPDF(row.original)}>
              Exportar PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
