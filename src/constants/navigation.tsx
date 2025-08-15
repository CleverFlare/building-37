import { BuildingApartmentIcon } from "@phosphor-icons/react/ssr";
import type { ElementType } from "react";

type Navlink = {
  id: string;
  label: string;
  href: string;
  icon: ElementType;
  activeOn?: (string | RegExp)[];
};

interface Navigation {
  navlinks: Navlink[];
}

export const navigation: Navigation = {
  navlinks: [
    {
      id: "apartments",
      label: "الشقق",
      href: "/apartments",
      icon: BuildingApartmentIcon,
    },
  ],
};
