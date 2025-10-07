import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 [&>svg]:size-3 [&>svg]:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 overflow-hidden",
  {
    variants: {
      color: {
        primary: "",
        success: "",
        destructive: "",
        warning: "",
        neutral: "",
      },
      variant: {
        heavy: "",
        medium: "",
        light: "",
      },
    },
    compoundVariants: [
      // === PRIMARY ===
      {
        color: "primary",
        variant: "heavy",
        class: "bg-primary text-primary-foreground border border-primary",
      },
      {
        color: "primary",
        variant: "medium",
        class: "bg-primary/20 text-primary border border-transparent",
      },
      {
        color: "primary",
        variant: "light",
        class: "bg-transparent text-primary border border-primary/40",
      },

      // === SUCCESS ===
      {
        color: "success",
        variant: "heavy",
        class: "bg-green-600 text-white border border-green-600",
      },
      {
        color: "success",
        variant: "medium",
        class:
          "bg-green-500/20 text-green-700 dark:text-green-400 border border-transparent",
      },
      {
        color: "success",
        variant: "light",
        class:
          "bg-transparent text-green-600 dark:text-green-400 border border-green-500/40",
      },

      // === DESTRUCTIVE ===
      {
        color: "destructive",
        variant: "heavy",
        class:
          "bg-destructive text-destructive-foreground border border-destructive",
      },
      {
        color: "destructive",
        variant: "medium",
        class: "bg-destructive/20 text-destructive border border-transparent",
      },
      {
        color: "destructive",
        variant: "light",
        class: "bg-transparent text-destructive border border-destructive/40",
      },

      // === WARNING ===
      {
        color: "warning",
        variant: "heavy",
        class: "bg-amber-500 text-amber-950 border border-amber-500",
      },
      {
        color: "warning",
        variant: "medium",
        class:
          "bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-transparent",
      },
      {
        color: "warning",
        variant: "light",
        class:
          "bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/40",
      },

      // === NEUTRAL ===
      {
        color: "neutral",
        variant: "heavy",
        class:
          "bg-muted-foreground/80 text-background border border-muted-foreground/80",
      },
      {
        color: "neutral",
        variant: "medium",
        class: "bg-muted text-muted-foreground border border-transparent",
      },
      {
        color: "neutral",
        variant: "light",
        class: "bg-transparent text-muted-foreground border border-muted/40",
      },
    ],
    defaultVariants: {
      variant: "heavy",
      color: "primary",
    },
  },
);

function Chip({
  className,
  color,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="chip"
      className={cn(chipVariants({ color, variant }), className)}
      {...props}
    />
  );
}

export { Chip, chipVariants };
