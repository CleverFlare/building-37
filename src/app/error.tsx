"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SmileyXEyesIcon } from "@phosphor-icons/react/dist/ssr";

export default function Error() {
  return (
    <article className="flex h-[100svh] w-[100svw] items-center justify-center p-4">
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="bg-background text-destructive"
              >
                <SmileyXEyesIcon />
              </EmptyMedia>
              <EmptyTitle>حدثت مشكلة</EmptyTitle>
              <EmptyDescription>
                حدثت مشكلة غير معروفة، قد تكون المشكلة من قاعدة البيانات، لذا
                تأكد من انها متصله بشكل صحيح.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </article>
  );
}
