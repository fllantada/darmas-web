"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import AlertsIcon from "@/components/icons/alerts";
import DashboardIcon from "@/components/icons/dashboard";
import PortsIcon from "@/components/icons/ports";
import ReportsIcon from "@/components/icons/reports";
import ServicesIcon from "@/components/icons/services";
import SettingsIcon from "@/components/icons/settings";
import SlideLeft from "@/components/icons/slideLeft";
import VesselIcon from "@/components/icons/vessel";
import { cn } from "@/app/plataform/lib/utils";

import ChevronDownIcon from "./icons/chevronDown";

type SideBarProps = {
  version: string;
  commitId: string;
  className?: string;
};

export default function SideBar({
  version,
  commitId,
  className,
}: SideBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  function toggleCollapsed() {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setShowLabels(false);
    }
  }

  function onTransitionEnd() {
    if (!collapsed) {
      setShowLabels(true);
    }
  }

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      className={cn(
        "h-viewport min-h-screen bg-[#1A8479] text-white relative transition-[width] fixed",
        !collapsed ? "translate-x-0 w-[167px]" : "w-[60px]",
        className,
      )}
    >
      <div className="mx-2 mt-5 pb-2 flex justify-between min-h-[65px] border-b-2 border-[#04AA9E]">
        <div
          className={cn({
            hidden: !showLabels,
          })}
        >
          <Image
            src="/images/oneocean-white.png"
            width={100}
            height={30}
            alt="OneOcean"
          />
          <h2 className="text-xs italic mt-1">Reportes Darmas</h2>
        </div>
        <Button
          variant="link"
          className="mr-1 text-white"
          onClick={toggleCollapsed}
        >
          <SlideLeft className={cn({ "rotate-180": collapsed })} />
        </Button>
      </div>

      <div className="space-y-1 mt-4 mx-1 pb-3 border-b-2 border-[#04AA9E]">
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full"
          title={collapsed ? "Dashboard" : ""}
        >
          <Link href="/">
            <DashboardIcon />
            <div className={cn({ hidden: !showLabels }, "ml-2")}>Dashboard</div>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full"
          title={collapsed ? "Vessels" : ""}
        >
          <Link href="/vessels" className="justify-start w-full">
            <VesselIcon />
            <div className={cn({ hidden: !showLabels }, "ml-2")}>Vessels</div>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full"
          title={collapsed ? "Alerts" : ""}
        >
          <Link href="/alerts" className="justify-start w-full relative">
            <AlertsIcon />
            {!showLabels && (
              <span className="bg-[#00C5B7] text-black rounded-full py-1 px-2 text-xs font-normal absolute right-[4px]">
                4
              </span>
            )}
            <div
              className={cn(showLabels ? "flex w-[105px]" : "hidden", "ml-2")}
            >
              <span className="flex-none">Alerts</span>
              <span className="text-right inline-block flex-auto text-right">
                <span className="bg-[#00C5B7] text-black rounded-full py-1 px-2 text-xs font-normal">
                  4
                </span>
                <ChevronDownIcon className="inline" />
              </span>
            </div>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full"
          title={collapsed ? "Reports" : ""}
        >
          <Link href="/reports" className="justify-start w-full">
            <ReportsIcon />
            <div className={cn({ hidden: !showLabels }, "ml-2")}>Reports</div>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full"
          title={collapsed ? "Services" : ""}
        >
          <Link href="/services" className="justify-start w-full">
            <ServicesIcon />
            <div className={cn({ hidden: !showLabels }, "ml-2")}>Services</div>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full"
          title={collapsed ? "Ports" : ""}
        >
          <Link
            href="/ports/recnsaBXGL70HclOO"
            className="justify-start w-full"
          >
            <PortsIcon />
            <div className={cn({ hidden: !showLabels }, "ml-2")}>Ports</div>
          </Link>
        </Button>
      </div>
      <div className="px-1 mt-3">
        <Button
          asChild
          variant="ghost"
          className="justify-start w-full"
          title={collapsed ? "Settings" : ""}
        >
          <Link href="/settings" className="justify-start w-full">
            <SettingsIcon />
            <div className={cn({ hidden: !showLabels }, "ml-2")}>Settings</div>
          </Link>
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 p-2 ml-2 text-xs">
        v{version}
        {!collapsed && <>&nbsp;({commitId})</>}
      </div>
    </div>
  );
}
