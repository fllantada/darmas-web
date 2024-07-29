"use client";

import { useEffect, useRef, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/app/plataform/lib/utils";

import { PortSnapshot } from "./interfaces";
import VesselActivitiesTable from "./VesselActivitiesTable";

type IProps = {
  className?: string;
  portActivities?: PortSnapshot;
};

const isDescendant = (child: Node | null, className: string) => {
  let node = child;
  while (node != null) {
    if (
      node instanceof HTMLElement &&
      node.classList &&
      node.classList.contains(className)
    ) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

export const PortActivitiesOverview = ({
  onClick,
  portActivities,
  className,
}: IProps & {
  onClick?: () => void;
}) => {
  return (
    <div className={cn("border-2 rounded mx-2  relative", className)}>
      <div className="flex flex-row cursor-pointer" onClick={onClick}>
        <div className="basis-1/4 py-1 px-4 border-r-2 my-1">
          <div className="text-sm font-normal">Total</div>
          <div className="text-sm font-medium">
            {portActivities ? portActivities.summary.totalAtPort : "-"}
          </div>
        </div>
        <div className="basis-1/4 py-1 px-4 border-r-2 my-1">
          <div className="text-sm font-normal">Waiting</div>
          <div className="text-sm font-medium">
            {portActivities ? portActivities.summary.waitingVessels : "-"}
          </div>
        </div>
        <div className="basis-1/4 py-1 px-4 border-r-2 my-1">
          <div className="text-sm font-normal">At Berth</div>
          <div className="text-sm font-medium">
            {portActivities ? portActivities.summary.atBerthVessels : "-"}
          </div>
        </div>
        <div className="basis-1/4 py-1 px-4 my-1">
          <div className="text-sm font-normal">Arriving</div>
          <div className="text-sm font-medium">
            {portActivities ? portActivities.summary.arrivingVessels : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VesselActivities({
  className,
  portActivities,
}: IProps) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleClickOutside(event: MouseEvent) {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node | null) &&
      !isDescendant(event.target as Node, "vessel-activities-popover")
    ) {
      setExpanded(false);
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setExpanded(false);
    }
  };

  useEffect(() => {
    // Attach global event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <PortActivitiesOverview
        portActivities={portActivities}
        onClick={() => setExpanded(true)}
        className={className}
      />

      <Dialog open={expanded} onOpenChange={() => setExpanded(false)}>
        <DialogContent
          size="full"
          showCloseButton={false}
          className="h-[90%] border-2 rounded shadow-lg"
        >
          <VesselActivitiesTable portActivities={portActivities} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
