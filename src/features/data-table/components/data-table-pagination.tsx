"use client";
import { type Table } from "@tanstack/react-table";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-2">
      <div className="text-muted-foreground min-w-max flex-1 text-sm max-lg:hidden">
        {table.getFilteredSelectedRowModel().rows.length} من{" "}
        {table.getFilteredRowModel().rows.length} صف/صفوف محددة.
      </div>
      <div className="flex flex-1 flex-col items-center justify-between gap-4 min-[460px]:flex-row lg:justify-end lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="min-w-max text-sm font-medium">صفوف في الصفحة</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]" size="sm">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="flex gap-4">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            صفحة {table.getState().pagination.pageIndex + 1} من{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">الذهاب لأول صفحة</span>
              <ChevronsRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">الذهاب للصفحة السابقة</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">الذهاب للصفحة التالية</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">الذهاب للصفحة الآخيرة</span>
              <ChevronsLeft />
            </Button>
          </div>
        </span>
      </div>
    </div>
  );
}
