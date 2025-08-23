import "@/styles/globals.css";

import { type Metadata } from "next";
import { Almarai } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { DirectionProvider } from "@/components/direction-provider";
import { ThemeProvider } from "@/components/theme-provider";

import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "37 Building System",
  description: "A system design for all 37 building needs.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const font = Almarai({
  weight: ["800", "700", "400", "300"],
  subsets: ["latin", "arabic"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      className={`${font.className}`}
      dir="rtl"
      suppressHydrationWarning
    >
      <body>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DirectionProvider dir="rtl">
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </DirectionProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
