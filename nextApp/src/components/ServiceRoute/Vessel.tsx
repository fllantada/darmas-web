import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/app/plataform/lib/utils";

import VesselTopViewIcon from "../icons/vesselTopView";

type VesselProps = {
  position: "top" | "bottom";
  vessel: any;
  className?: string;
};

export default function Vessel({ vessel, position, className }: VesselProps) {
  const travelPercentComplete = vessel.positionalState?.relativePositionValue
    ? Math.round(vessel.positionalState.relativePositionValue * 1000) / 10
    : vessel.positionalState?.status == "Sea Passage"
      ? 50.0
      : 100.0;

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <VesselTopViewIcon
          className={cn(
            !vessel.positionalState?.relativePositionValue &&
              vessel.positionalState?.status == "Sea Passage"
              ? "text-[#454954]" // color indicates that the vessel possition is unknown
              : "text-[#00C5B7]",
            "absolute",
            position == "top" ? "-bottom-[27px]" : "-top-[27px] rotate-180",
            className,
          )}
          style={{
            width: 35,
            height: 35,
            [position === "top" ? "left" : "right"]: `calc(${
              travelPercentComplete - 50.0
            }% - 17px)`,
          }}
        />
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[200px] text-left"
        side="bottom"
        sideOffset={25}
      >
        <h3 className="text-xs font-medium mb-2">{vessel.vesselName}</h3>
        <div className="text-[0.70rem] grid grid-cols-2">
          <div className="font-medium">Operator:</div>
          <div className="font-normal">{vessel.operator}</div>
          <div className="font-medium">State:</div>
          <div className="font-normal">{vessel.positionalState?.status}</div>
          {vessel.positionalState?.arrivalPort && (
            <>
              <div className="font-medium">Next Port:</div>
              <div className="font-normal">
                {vessel.positionalState?.arrivalPort}
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
