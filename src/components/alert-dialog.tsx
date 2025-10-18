import type { ReactNode } from "react";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./ui/credenza";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function AlertDialog({
  children,
  open,
  onOpenChange,
  description,
  onYes,
  isPending,
}: {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  description: string;
  onYes: () => void;
  isPending?: boolean;
}) {
  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      {children && <CredenzaTrigger asChild>{children}</CredenzaTrigger>}

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>هل انت متأكد تماماً؟</CredenzaTitle>
          <CredenzaDescription>{description}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="outline">إلغاء</Button>
          </CredenzaClose>
          <Button
            variant="destructive"
            onClick={() => onYes()}
            disabled={isPending}
          >
            {isPending && <Spinner />}
            نعم
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
