import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";

export default function StatCard({
  title,
  value,
  children,
  icon,
}: {
  children: ReactNode;
  title: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="w-full shadow-xs">
      <CardHeader>
        <span className="flex items-center gap-2">
          {icon}
          <CardDescription>{title}</CardDescription>
        </span>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter>{children}</CardFooter>
    </Card>
  );
}
