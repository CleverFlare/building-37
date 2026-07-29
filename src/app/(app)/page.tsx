import { BalanceChangeStat } from "@/components/balance-change-stat";
import { CollectedStat } from "@/components/collected-stat";
import StatCard from "@/components/stat-card";
import { cumulative } from "@/lib/cumulative-map";
import { getGlobalValue } from "@/lib/global-values";
import { db } from "@/server/db";
import {
  BankIcon,
  BuildingIcon,
  CoinsIcon,
  ReceiptIcon,
} from "@phosphor-icons/react/dist/ssr";
import { endOfDay, startOfDay } from "date-fns";

export default async function Page() {
  const monthlyFee = await getGlobalValue("monthlyFee");

  const today = new Date();

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [monthlyFees, monthExpenseAggregate, yearExpenseAggregate] =
    await Promise.all([
      db.monthlyFee.findMany({
        where: {
          createdAt: {
            gt: startOfDay(thisMonthStart),
            lt: endOfDay(thisMonthEnd),
          },
        },
      }),
      db.expense.aggregate({
        where: { month: today.getMonth(), year: today.getFullYear() },
        _sum: { amount: true },
      }),
      db.expense.aggregate({
        where: { year: today.getFullYear() },
        _sum: { amount: true },
      }),
    ]);

  const totalMonthlyExpenses = monthExpenseAggregate._sum.amount ?? 0;
  const totalYearExpenses = yearExpenseAggregate._sum.amount ?? 0;

  const totalMonthlyFees = monthlyFees.reduce(
    (prev, next) => prev + next.paidAmount,
    0,
  );

  const apartmentsCount = await db.apartment.count();

  const balances = await db.balance.findMany({
    where: { year: new Date().getFullYear() },
  });

  const totalBalance = balances.reduce((prev, next) => prev + next.amount, 0);

  const cumulativeBalances = cumulative(
    balances.map((balance) => balance.amount),
  );

  const monthlyBalances = new Array(12).fill(0).map((_, index) => {
    const balanceIndex = balances.findIndex(
      (balance) => balance.month === index,
    );

    if (balanceIndex === -1) return 0;

    return cumulativeBalances[balanceIndex];
  });

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">مرحباً بك يا، محمد</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="الميزانية الحالية"
          value={`${totalBalance - totalYearExpenses} جنية`}
          icon={<BankIcon />}
        >
          <p className="text-muted-foreground text-sm">
            إجمالي التحصيلات بعد خصم المصروفات هذا العام
          </p>
        </StatCard>
        <StatCard
          title="المصروف الشهري للشقة"
          value={`${monthlyFee} جنية`}
          icon={<CoinsIcon />}
        >
          <p className="text-muted-foreground text-sm">
            المبلغ المطلوب من الشقة الواحدة كل شهر
          </p>
        </StatCard>
        <StatCard
          title="مصروفات الشهر"
          value={`${totalMonthlyExpenses} جنية`}
          icon={<ReceiptIcon />}
        >
          <p className="text-muted-foreground text-sm">
            إجمالي المصروفات المسجلة هذا الشهر
          </p>
        </StatCard>
        <StatCard
          title="الشقق المحصله"
          value={`${monthlyFees.length} شقق`}
          icon={<BuildingIcon />}
        >
          <p className="text-muted-foreground text-sm">
            الشقق التي دفعت المصروف الشهري هذا الشهر
          </p>
        </StatCard>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_2fr]">
        <CollectedStat
          collected={monthlyFees.length}
          uncollected={apartmentsCount - monthlyFees.length}
        />
        <BalanceChangeStat balances={cumulative(monthlyBalances as number[])} />
      </div>
    </div>
  );
}
