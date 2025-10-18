"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export function BalanceChangeStat({
  balances = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}: {
  balances: number[];
}) {
  const chartData = balances
    .map((value, index) => ({
      month: format(new Date(new Date().getFullYear(), index, 1), "MMMM", {
        locale: ar,
      }),
      balance: value,
    }))
    .reverse();

  const chartConfig = {
    balance: {
      label: "الميزانية",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>التغير السنوي في الميزانية</CardTitle>
        <CardDescription>
          عرض لنسب الزيادة والنقصان في الميزانية خلال شهور السنة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 6 * 2,
              right: 6 * 2,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="balance"
              type="monotone"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm"> */}
      {/*   <div className="flex gap-2 leading-none font-medium"> */}
      {/*     Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
      {/*   </div> */}
      {/*   <div className="text-muted-foreground leading-none"> */}
      {/*     Showing total visitors for the last 6 months */}
      {/*   </div> */}
      {/* </CardFooter> */}
    </Card>
  );
}
