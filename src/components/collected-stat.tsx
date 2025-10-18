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

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>نسبة الدفع</CardTitle>
        <CardDescription>
          عرض لنسبة الشقق التي دفعت مقابل الشقق التي لم تدفع حتى الآن هذا الشهر
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm"> */}
      {/*   <div className="flex items-center gap-2 leading-none font-medium"> */}
      {/*     Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
      {/*   </div> */}
      {/*   <div className="text-muted-foreground leading-none"> */}
      {/*     Showing total visitors for the last 6 months */}
      {/*   </div> */}
      {/* </CardFooter> */}
    </Card>
  );
}
