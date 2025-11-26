import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { arabicStates } from "@/config/apartment-arabic-state";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "./ui/tabs";
import {
  DotsThreeVerticalIcon,
  ImageBrokenIcon,
  KeyIcon,
  UserIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";
import type { Owner, Renter, Status } from "@prisma/client";

interface ApartmentDetailsDrawerProps {
  open?: boolean;
  setIsOpen?: (state: boolean) => void;
  status: Status;
  owners: Owner[];
  renters: Renter[];
  apartmentNumber: number;
}

export default function ApartmentDetailsDrawer({
  open,
  setIsOpen,
  status,
  owners = [],
  renters = [],
  apartmentNumber,
}: ApartmentDetailsDrawerProps) {
  const currentOwner = [...owners].sort(
    (a, b) =>
      new Date(a.ownershipStartAt).getTime() -
      new Date(b.ownershipStartAt).getTime(),
  )[0];

  if (!currentOwner) {
    throw new Error("Apartment must have at least one owner.");
  }

  return (
    <Drawer direction="left" open={open} onOpenChange={setIsOpen}>
      <DrawerContent className="grid">
        <DrawerHeader hidden>
          <DrawerTitle>عنوان</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <div className="grid h-full max-h-full grid-cols-1 grid-rows-[auto_auto_1fr] gap-4 overflow-hidden p-6">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr] gap-4">
            <EmptyMedia
              variant="icon"
              className="text-primary text-xl font-bold not-dark:bg-gray-100"
            >
              {apartmentNumber}
            </EmptyMedia>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">{currentOwner.name}</h2>
              <p className="text-muted-foreground">{currentOwner.phone}</p>

              <Badge variant="outline" className="gap-2">
                <span className={cn("bg-primary size-2 rounded-full")} />
                {arabicStates[status]}
              </Badge>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Tabs */}
          <Tabs
            defaultValue="owners"
            className="grid h-full grid-rows-[auto_1fr] overflow-hidden"
          >
            <TabsList>
              <TabsTrigger value="owners">
                <KeyIcon />
                الملاك
              </TabsTrigger>
              <TabsTrigger value="renters">
                <UserIcon />
                المستأجرين
              </TabsTrigger>
            </TabsList>

            {/* Owners */}
            <TabsContent value="owners" className="grid h-full overflow-y-auto">
              <PersonTimeline
                people={owners}
                dateKey="ownershipStartAt"
                emptyMessage="لا يوجد ملاك للعرض"
              />
            </TabsContent>

            {/* Renters */}
            <TabsContent
              value="renters"
              className="grid h-full overflow-y-auto"
            >
              {renters.length === 0 ? (
                <Empty className="h-max md:p-4">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <UsersIcon />
                    </EmptyMedia>
                    <EmptyTitle>لا يوجد بيانات للعرض</EmptyTitle>
                    <EmptyDescription>
                      ليس هناك اي مستأجرين مسجلين في هذه الشقة.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <PersonTimeline
                  people={renters}
                  dateKey="rentStartAt"
                  dateEndKey="rentEndAt"
                  emptyMessage="لا يوجد مستأجرين للعرض"
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/* ---------------------- */
/* Reusable PersonTimeline */
/* ---------------------- */

interface PersonWithDate {
  id: string;
  name: string;
  phone: string | null;
  idPhoto?: string | null;
  [key: string]: any; // to allow dynamic date key
}

interface PersonTimelineProps {
  people: PersonWithDate[];
  dateKey: string;
  dateEndKey?: string;
  emptyMessage?: string;
}

function PersonTimeline({
  people,
  dateKey,
  emptyMessage,
  dateEndKey,
}: PersonTimelineProps) {
  if (people.length === 0) {
    return (
      <Empty className="md:p-4">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageBrokenIcon />
          </EmptyMedia>
          <EmptyTitle>{emptyMessage}</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="mt-4">
      {people.map((person, index) => (
        <div className="grid grid-cols-[auto_auto_1fr] gap-2" key={person.id}>
          <TimelineDate
            date={person[dateKey]}
            endDate={dateEndKey && person[dateEndKey]}
          />
          <TimelineLine last={index === people.length - 1} />
          <PersonCard {...person} />
        </div>
      ))}
    </div>
  );
}

/* ---------------------- */
/* Small Subcomponents */
/* ---------------------- */

function TimelineDate({ date, endDate }: { date: Date; endDate?: Date }) {
  return (
    <div className="text-muted-foreground flex flex-col items-center text-xs">
      <p>{format(date, "dd")}</p>
      <p className="text-primary font-bold">
        {format(date, "MMM", { locale: ar })}
      </p>
      <p className={cn(endDate ? "" : "mb-8")}>{format(date, "yy")}</p>
      {endDate && (
        <>
          <DotsThreeVerticalIcon />
          <p>{format(endDate, "dd")}</p>
          <p className="text-primary font-bold">
            {format(endDate, "MMM", { locale: ar })}
          </p>
          <p className="mb-8">{format(endDate, "yy")}</p>
        </>
      )}
    </div>
  );
}

function TimelineLine({ last }: { last?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-border size-2 rounded-full" />
      <span className="bg-border w-[1px] flex-1" />
      {last && <span className="bg-border size-2 rounded-full" />}
    </div>
  );
}

function PersonCard({
  name,
  phone,
  idPhoto,
}: {
  name: string;
  phone: string | null;
  idPhoto?: string | null;
}) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <p>{name}</p>
      <p className="text-muted-foreground">{phone || "-"}</p>

      {idPhoto ? (
        <Link
          href={idPhoto}
          target="_blank"
          className="bg-muted flex aspect-video w-[150px] items-center justify-center overflow-hidden rounded-lg"
        >
          <img
            src={idPhoto}
            alt="ID Photo"
            width={400}
            height={1000}
            className="h-full w-full object-cover"
          />
        </Link>
      ) : (
        <div className="bg-muted flex aspect-video w-[150px] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg">
          <ImageBrokenIcon />
          <p className="text-muted-foreground mx-4 text-sm">
            لا يوجد صورة بطاقة
          </p>
        </div>
      )}
    </div>
  );
}
