import Logo from "@/components/logo";
import { OtpForm } from "@/components/otp-form";

export default async function Page({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Logo />
          مصاريفنا
        </a>
        <OtpForm email={decodeURIComponent(email)} />
      </div>
    </div>
  );
}
