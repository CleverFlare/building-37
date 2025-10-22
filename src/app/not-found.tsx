import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-[100svh] w-[100svw] flex-col items-center justify-center gap-4">
      <h2 className="text-6xl font-bold">404</h2>
      <p className="text-muted-foreground">
        اوف! يبدو ان الصفحة التي تبحث عنها غير موجودة.
      </p>
      <Button asChild>
        <Link href="/">العودة للصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}
