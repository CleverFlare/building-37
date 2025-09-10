import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

export default function StatCard({
  children,
  title,
  value,
}: {
  children: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center gap-2">
        {children}
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="mt-4 text-4xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
