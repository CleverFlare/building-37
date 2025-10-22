import { type Table as TanstackTable } from "@tanstack/react-table";
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileDataTable } from "./mobile-data-table";
import { DesktopDataTable } from "./desktop-data-table";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  const isMobile = useIsMobile();

  if (isMobile === undefined) return null;

  if (isMobile) return <MobileDataTable {...props} />;

  return <DesktopDataTable {...props} />;
}
