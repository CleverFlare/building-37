import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import * as React from "react";

import { DataTablePagination } from "./data-table-pagination";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLongTap } from "@/hooks/use-long-tap";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
}

export function MobileDataTable<TData>({
  table,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const inSelectionMode = table.getSelectedRowModel().rows.length > 0;

  const longTap = useLongTap<() => void>((_, args) => args && args(), {
    onStart: (_, args) => inSelectionMode && args && args(),
  });

  return (
    <div className={cn("flex w-full flex-col gap-4", className)} {...props}>
      {children}
      <div className="flex flex-col gap-4">
        {table.getRowModel().rows.map((row) => {
          const title = row
            .getAllCells()
            .find((cell) => cell.column.columnDef.meta?.mobileType === "title");

          const description = row
            .getAllCells()
            .find(
              (cell) =>
                cell.column.columnDef.meta?.mobileType === "description",
            );

          const action = row
            .getAllCells()
            .find(
              (cell) => cell.column.columnDef.meta?.mobileType === "action",
            );

          return (
            <Card
              className="data-[state=selected]:bg-muted data-[state=selected]:ring-primary data-[state=selected]:border-primary cursor-pointer select-none data-[state=selected]:ring-4"
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              {...longTap(row.toggleSelected)}
            >
              {(title ?? description ?? action) && (
                <CardHeader>
                  {title && (
                    <CardTitle>
                      {flexRender(
                        title.column.columnDef.cell,
                        title.getContext(),
                      )}
                    </CardTitle>
                  )}

                  {description && (
                    <CardDescription>
                      {flexRender(
                        description.column.columnDef.cell,
                        description.getContext(),
                      )}
                    </CardDescription>
                  )}

                  {action && (
                    <CardAction>
                      {flexRender(
                        action.column.columnDef.cell,
                        action.getContext(),
                      )}
                    </CardAction>
                  )}
                </CardHeader>
              )}
              <CardContent className="flex flex-col">
                {row.getVisibleCells().map((cell) => {
                  const type = cell.column.columnDef.meta?.mobileType;
                  if (type !== "default" && type !== undefined) return null;

                  const header = table
                    .getFlatHeaders()
                    .find(
                      (header) =>
                        header.column.columnDef.header ===
                        cell.column.columnDef.header,
                    );

                  return (
                    <div
                      className="flex items-center justify-between py-2 text-sm"
                      key={cell.id}
                    >
                      <span className="text-muted-foreground flex items-center gap-2">
                        {
                          // eslint-disable-next-line
                          header && header.column.columnDef.meta?.icon && (
                            <header.column.columnDef.meta.icon />
                          )
                        }
                        {header &&
                          flexRender(
                            header?.column.columnDef.header,
                            header?.getContext(),
                          )}
                      </span>
                      <span className="text-muted-foreground">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
        {/* <Table> */}
        {/*   <TableHeader className="bg-muted sticky"> */}
        {/*     {table.getHeaderGroups().map((headerGroup) => ( */}
        {/*       <TableRow key={headerGroup.id}> */}
        {/*         {headerGroup.headers.map((header) => ( */}
        {/*           <TableHead */}
        {/*             key={header.id} */}
        {/*             colSpan={header.colSpan} */}
        {/*             style={{ */}
        {/*               ...getCommonPinningStyles({ column: header.column }), */}
        {/*             }} */}
        {/*             className="text-muted-foreground" */}
        {/*           > */}
        {/*             {header.isPlaceholder */}
        {/*               ? null */}
        {/*               : flexRender( */}
        {/*                   header.column.columnDef.header, */}
        {/*                   header.getContext(), */}
        {/*                 )} */}
        {/*           </TableHead> */}
        {/*         ))} */}
        {/*       </TableRow> */}
        {/*     ))} */}
        {/*   </TableHeader> */}
        {/*   <TableBody> */}
        {/*     {table.getRowModel().rows?.length ? ( */}
        {/*       table.getRowModel().rows.map((row) => ( */}
        {/*         <TableRow */}
        {/*           key={row.id} */}
        {/*           data-state={row.getIsSelected() && "selected"} */}
        {/*         > */}
        {/*           {row.getVisibleCells().map((cell) => ( */}
        {/*             <TableCell */}
        {/*               key={cell.id} */}
        {/*               style={{ */}
        {/*                 ...getCommonPinningStyles({ column: cell.column }), */}
        {/*               }} */}
        {/*             > */}
        {/*               {flexRender( */}
        {/*                 cell.column.columnDef.cell, */}
        {/*                 cell.getContext(), */}
        {/*               )} */}
        {/*             </TableCell> */}
        {/*           ))} */}
        {/*         </TableRow> */}
        {/*       )) */}
        {/*     ) : ( */}
        {/*       <TableRow> */}
        {/*         <TableCell */}
        {/*           colSpan={table.getAllColumns().length} */}
        {/*           className="h-24 text-center" */}
        {/*         > */}
        {/*           لا يوجد نتائج. */}
        {/*         </TableCell> */}
        {/*       </TableRow> */}
        {/*     )} */}
        {/*   </TableBody> */}
        {/* </Table> */}
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
