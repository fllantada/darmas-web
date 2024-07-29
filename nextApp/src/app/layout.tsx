import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["700", "500", "400"],
});

export const metadata: Metadata = {
  title: {
    default: "OneOcean",
    template: "%s | OneOcean",
  },
  description: "Seaborne Insights",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(roboto.className, "overflow-y-hidden")}>
        {children}
      </body>
    </html>
  );
}
