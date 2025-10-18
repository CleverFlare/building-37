import { type Dispatch, type SetStateAction } from "react";
import { PrinterIcon, QrCodeIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import QRCode from "react-qr-code";
import { api } from "@/trpc/react";
import { Spinner } from "./ui/spinner";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "./ui/credenza";

export default function QrDialog({
  open,
  setIsOpen,
  apartmentNumber,
}: {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  apartmentNumber: number;
}) {
  const { mutateAsync, isPending } = api.apartments.qrPdf.useMutation();

  async function handleQrPdfDownload(qrData: string) {
    const res = await mutateAsync([{ qrData: qrData, apartmentNumber }]);

    // Turn base64 back into a Blob
    const byteChars = atob(res.pdf);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Credenza open={open} onOpenChange={setIsOpen}>
      <CredenzaContent className="outline-none">
        <div className="flex h-full w-full flex-col items-center gap-5">
          <span className="border-input bg-input/50 relative flex size-12 items-center justify-center overflow-hidden rounded-full border dark:bg-[#0f0f0f] dark:text-white">
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
          <CredenzaHeader>
            <CredenzaTitle className="text-center text-2xl">
              رمز QR الخاص بالشقة
            </CredenzaTitle>
            <CredenzaDescription className="text-center">
              يمكنك طباعته او تحميله بصيغة PDF من ثم مسحه عند المعاملات المالية
              لتسجيل هذه المعاملات على النظام
            </CredenzaDescription>
          </CredenzaHeader>
          <div className="flex size-[250px] items-center justify-center rounded-lg border bg-white p-3 shadow-md">
            <QRCode value={String(apartmentNumber)} className="h-full w-full" />
          </div>
          <CredenzaFooter className="w-full">
            <Button
              className="w-full"
              onClick={() => handleQrPdfDownload(apartmentNumber + "")}
              disabled={isPending}
            >
              {isPending && <Spinner />}
              {!isPending && <PrinterIcon weight="fill" />}
              طباعة
            </Button>
          </CredenzaFooter>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
