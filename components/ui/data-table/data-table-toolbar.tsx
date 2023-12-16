"use client"

import { Cross2Icon, FilePlusIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "../button"
import { Input } from "../input"
import { DataTableViewOptions } from "./data-table-view-options"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductForm } from "@/app/dashboard/product/product-form"
import { useState } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const [openDialog, setOpenDialog] = useState(false) 

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtar productos..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex">
              <FilePlusIcon className="mr-2 h-4 w-4"/> Agregar producto
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full sm:w-1/2 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar producto</DialogTitle>
              <DialogDescription>
                Agrega un nuevo producto aquí. Haz clic en guardar cuando hayas terminado.
              </DialogDescription>
            </DialogHeader>
            <ProductForm onOpenChange={setOpenDialog} />
          </DialogContent>
        </Dialog>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}