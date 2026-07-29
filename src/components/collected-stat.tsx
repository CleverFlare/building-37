"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function CollectedStat({
  collected = 0,
  uncollected = 1,
}: {
  collected: number;
  uncollected: number;
}) {
  const chartData = [
    { type: "collected", value: collected, fill: "var(--color-blue-500)" },
    { type: "uncollected", value: uncollected, fill: "var(--color-blue-400)" },
  ];

  const chartConfig = {
    value: {
      label: "عدد الشقق",
    },
    collected: {
      label: "دفعت",
      color: "var(--chart-1)",
    },
    uncollected: {
      label: "لم تدفع",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const isEmpty = collected === 0 && uncollected === 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>نسبة الدفع</CardTitle>
        <CardDescription>
          عرض لنسبة الشقق التي دفعت مقابل الشقق التي لم تدفع حتى الآن هذا الشهر
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className={`mx-auto aspect-square max-h-[350px] ${isEmpty ? "opacity-20" : ""}`}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={
                  isEmpty
                    ? [
                        {
                          type: "empty",
                          value: 1,
                          fill: "var(--muted-foreground)",
                        },
                      ]
                    : chartData
                }
                dataKey="value"
                nameKey="type"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                لا توجد بيانات
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
