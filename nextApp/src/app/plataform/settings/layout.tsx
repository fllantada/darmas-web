"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/app/plataform/lib/utils";

const settingsMenu = [
  {
    title: "Account Settings",
    href: "/settings/account",
  },
  {
    title: "Roles & Permissions",
    href: "/settings/permissions",
  },
  {
    title: "Alerts & Notifications",
    href: "/settings/alerts",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-10">
        {settingsMenu.map((item, idx) => (
          <Link
            href={item.href}
            key={idx}
            className={cn(
              "py-2 px-4 mr-2 rounded-full",
              pathname == item.href && "bg-slate-200",
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
      {children}
    </>
  );
}
