// src/app/(internal)/layout.tsx

import type { Metadata } from "next";
import { Roboto } from "next/font/google";

/* import LeftBar from "@/components/SideBar"; */
import TopBar from "@/components/TopBar/TopBar";
import { cn } from "@/app/plataform/lib/utils";

import packageJson from "../../../package.json";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["700", "500", "400"],
});

export const metadata: Metadata = {
  title: {
    default: "Darmas Salud - Interno",
    template: "%s - Interno",
  },
  description: "Plataforma interna de Darmas Salud",
  robots: "noindex, nofollow", // Importante para la sección interna
};

export default function InternalPlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(roboto.className, "overflow-y-hidden")}>
        <div className="flex h-screen overflow-y-hidden">
          {/*      <LeftBar
            className="min-h-screen  left-0 relative"
            version={packageJson.version}
            commitId={process.env.COMMIT_ID?.slice(0, 7) || "dev"}
          /> */}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-y-auto bg-[#F1F4F4]">
              <TopBar className="w-full sticky top-0 z-20" />
              <div className="p-8 max-w-[1600px] min-w-[1345px] mx-auto overflow-x-scroll">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
