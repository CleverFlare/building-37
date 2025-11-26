"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./ui/credenza";
import { Button } from "./ui/button";
import { QrCodeIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr";
import { useIsClient } from "@uidotdev/usehooks";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QrScanDialog({ children }: { children: ReactNode }) {
  const [isCameraAvailable, setIsCameraAvailable] = useState(true);

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const isClient = useIsClient();

  useEffect(() => {
    async function checkCameraAvailability() {
      if (isClient) {
        try {
          const media = await navigator?.mediaDevices?.getUserMedia({
            video: true,
          });

          setIsCameraAvailable(media?.active);
        } catch {
          setIsCameraAvailable(false);
        }
      }
    }

    if (isClient) void checkCameraAvailability();
  }, [isClient]);

  const router = useRouter();

  const { mutateAsync } = api.monthlyFees.scanApartment.useMutation({
    onSuccess: () => {
      router.refresh();
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  async function scan(apartmentNumber: string) {
    await mutateAsync({ apartmentNumber });
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <span className="border-input bg-input/50 relative mx-auto mb-2 flex size-12 items-center justify-center overflow-hidden rounded-full border dark:bg-[#0f0f0f] dark:text-white">
            {/* Small Grid Pattern */}
            <div
              className="absolute inset-0 z-0 h-full w-full"
              style={{
                backgroundImage: `
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px)
      `,
                backgroundSize: "20px 20px",
              }}
            />
            {/* Your Content/Components */}
            <QrCodeIcon size={25} className="z-10" />
          </span>
          <CredenzaTitle className="text-center">مسح رمز QR</CredenzaTitle>
          <CredenzaDescription className="text-center">
            قم بمسح رمز QR الخاص بالشقة لتسجيل عملية الدفع
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="flex items-center justify-center">
          {!isCameraAvailable && (
            <div className="flex aspect-square h-[400px] w-[400px] flex-col items-center justify-center gap-4 rounded-lg bg-black">
              <span className="flex size-[50px] items-center justify-center rounded-full bg-yellow-100">
                <WarningIcon className="text-3xl text-yellow-500" />
              </span>
              <h2 className="text-center text-xl font-bold text-white">
                مشكلة بالكاميرا
              </h2>
              <p className="text-muted-foreground text-center text-balance">
                حدثت مشكلة في محاولة الوصول للكاميرا، الرجاء التأكد من وجود
                كاميرا.
              </p>
            </div>
          )}
          {isCameraAvailable && (
            <Scanner onScan={(result) => scan(result[0]!.rawValue)} />
          )}
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline" ref={closeRef} className="w-full">
              خروج
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
