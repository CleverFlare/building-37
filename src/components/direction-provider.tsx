"use client";
import { Provider } from "@radix-ui/react-direction";
import type { ComponentProps } from "react";

export function DirectionProvider(props: ComponentProps<typeof Provider>) {
  return <Provider {...props} />;
}
