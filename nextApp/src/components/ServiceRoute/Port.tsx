import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import type { PortWithVessel } from "./types";
import Vessel from "./Vessel";

type PortProps = {
  port: PortWithVessel;
  position: "top" | "bottom";
};

export default function Port({ port, position }: PortProps) {
  return (
    <div className="relative w-full text-center">
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <Link href={`/ports/${port.portCode}`}>
            <div className="px-2 py-1 bg-[#D9E1E0] text-[#454954] text-sm font-normal rounded inline">
              {port.portCode}
            </div>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent
          className="w-[300px] text-left"
          side="bottom"
          sideOffset={10}
        >
          <h3 className="text-xs font-medium mb-2">{port.portCode}</h3>
          <div className="text-[0.70rem] grid grid-cols-2">
            <div className="font-medium">Rotation at Port, if any:</div>
            <div className="font-normal">--</div>
            <div className="font-medium">Operator:</div>
            <div className="font-normal">--</div>
            <div className="font-medium">State:</div>
            <div className="font-normal">--</div>
          </div>
        </HoverCardContent>
      </HoverCard>
      {port.vessel && (
        <Vessel className="z-10" vessel={port.vessel} position={position} />
      )}
      <div
        className={cn(
          "absolute text-center w-full pointer-events-none z-20",
          position === "top" ? "-bottom-[20px]" : "-top-[23px]",
        )}
      >
        <div className="w-2 h-2 bg-[#D9E1E0] rounded-full inline-block" />
      </div>
    </div>
  );
}
