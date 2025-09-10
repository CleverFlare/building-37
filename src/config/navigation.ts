import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import {
  BuildingApartmentIcon,
  CoinsIcon,
  HouseLineIcon,
  UsersIcon,
} from "@phosphor-icons/react/ssr";

type Navlink = {
  id: string;
  label: string;
  href: string;
  icon: Icon;
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
          id: "home",
          label: "الرئيسية",
          href: "/",
          icon: HouseLineIcon,
        },
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
          activeOn: ["/apartments", /\/apartments\/(.*?)/gi],
          icon: BuildingApartmentIcon,
        },
      ],
    },
  ],
};
