import StatCard from "@/components/stat-card";
import {
  MoneyIcon,
  UsersThreeIcon,
  VaultIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function Page() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold">مرحباً بك يا، محمد</h2>
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="المبلغ المحصل هذا الشهر" value="200 جنية">
          <MoneyIcon size={30} className="text-green-500" />
        </StatCard>
        <StatCard title="عدد الشقق التي دفعت هذا الشهر" value="10 شقق">
          <UsersThreeIcon size={30} />
        </StatCard>
        <StatCard title="إجمالي الديون المستحقة" value="200 جنية">
          <VaultIcon size={30} className="text-destructive" />
        </StatCard>
      </div>
    </div>
  );
}
