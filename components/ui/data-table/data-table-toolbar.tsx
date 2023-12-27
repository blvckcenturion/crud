"use client"

import { Cross2Icon, FilePlusIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "../button"
import { Input } from "../input"
import { DataTableViewOptions } from "./data-table-view-options"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useState, ReactNode, useEffect } from "react"


interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumnId?: string; // Optional filtering column id
  collectionName: string; // Text for the add button
  formComponent: React.ReactNode;
  isFormOpen: boolean; // State indicating whether the form dialog is open
  onFormOpenChange: (isOpen: boolean) => void; // Function to toggle the form dialog
}

export function DataTableToolbar<TData>({
  table,
  filterColumnId,
  collectionName,
  formComponent,
  onFormOpenChange,
  isFormOpen,
}: DataTableToolbarProps<TData>) {

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterColumnId && (
          <>
            <Input
              placeholder={`Filtrar ${collectionName.toLowerCase()}...`}
              value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(filterColumnId)?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Resetear
                <Cross2Icon className="ml-2 h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
          <DialogTrigger asChild>
            <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex">
              <FilePlusIcon className="mr-2 h-4 w-4"/> {`Agregar ${collectionName}`}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full sm:w-1/2 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{`Agregar ${collectionName}`}</DialogTitle>
              <DialogDescription>
                {`Agrega un nuevo ${collectionName} aqui. Haz clic en guardar cuando hayas terminado.`}
              </DialogDescription>
            </DialogHeader>
            {isFormOpen && formComponent}
          </DialogContent>
        </Dialog>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}