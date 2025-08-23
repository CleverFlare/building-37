import {
  BuildingApartmentIcon,
  CoinsIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";
import type { ElementType } from "react";

type Navlink = {
  id: string;
  label: string;
  href: string;
  icon: ElementType;
  activeOn?: (string | RegExp)[];
};

type NavlinksGroup = {
  title: string;
  links: Navlink[];
};

interface Navigation {
  groups: NavlinksGroup[];
}

export const navigation: Navigation = {
  groups: [
    {
      title: "إدارة الأموال",
      links: [
        {
          id: "monthly-fees",
          label: "المصروفات الشهرية",
          href: "/monthly-fees",
          icon: CoinsIcon,
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
          icon: BuildingApartmentIcon,
        },
      ],
    },
  ],
};
