import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import {
  BuildingApartmentIcon,
  CoinsIcon,
  GearIcon,
  HouseLineIcon,
  ReceiptIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";

export type Navlink = {
  id: string;
  label: string;
  href: string;
  icon: Icon;
  activeOn?: (string | RegExp)[];
};

export type NavlinksGroup = {
  title: string;
  links: Navlink[];
};

export interface Navigation {
  groups: NavlinksGroup[];
}

export const navigation: Navigation = {
  groups: [
    {
      title: "إدارة الأموال",
      links: [
        {
          id: "home",
          label: "الرئيسية",
          href: "/",
          icon: HouseLineIcon,
        },
        {
          id: "monthly-fees",
          label: "التحصيلات الشهرية",
          href: "/monthly-fees",
          icon: CoinsIcon,
        },
        {
          id: "expenses",
          label: "المصروفات",
          href: "/expenses",
          icon: ReceiptIcon,
        },
      ],
    },
    {
      title: "إدارة النظام",
      links: [
        {
          id: "users",
          label: "المستخدمين",
          href: "/users",
          icon: UsersIcon,
        },
        {
          id: "apartments",
          label: "الشقق",
          href: "/apartments",
          activeOn: ["/apartments", /\/apartments\/(.*?)/gi],
          icon: BuildingApartmentIcon,
        },
        {
          id: "settings",
          label: "الإعدادات",
          href: "/settings",
          icon: GearIcon,
        },
      ],
    },
  ],
};
