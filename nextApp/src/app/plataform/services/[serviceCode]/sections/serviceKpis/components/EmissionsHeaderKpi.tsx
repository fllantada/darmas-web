import { VesselEmissionsKpiType } from "@/generated/graphql";
import { AlertCircle } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import InfoIcon from "@/components/icons/info";
import { LoadingState } from "@/app/plataform/lib/types";
import { cn } from "@/app/plataform/lib/utils";
import { emissionsCiiColors } from "@/app/theme";

type EmissionsHeaderKpiProps = {
  id?: string;
  infoText?: string;
  loadingState?: LoadingState;
  selected?: boolean;
  title: string;
  className?: string;
  data?: VesselEmissionsKpiType[];
  onClick?: (id: string) => void;
};

export default function EmissionsHeaderKpi({
  id,
  infoText,
  loadingState,
  selected,
  title,
  className,
  data,
  onClick,
}: EmissionsHeaderKpiProps) {
  const containerClassName = cn(
    "rounded-md border-[1px] px-4 py-5 bg-white",
    selected ? "border-[#00C5B7]" : "border-[#DBDCDF]",
    { "cursor-pointer": onClick && loadingState === LoadingState.SUCCESS },
    className,
  );

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className={containerClassName}>
        <div className="align-bottom font-normal text-sm">{title}</div>
        <Skeleton className="w-full h-[45px] mt-5" />
      </div>
    );
  }

  if (loadingState === LoadingState.FAILED) {
    return (
      <div className={cn(containerClassName, "text-red-500")}>
        <div className="align-bottom font-normal text-sm">{title}</div>
        <div className="text-center mb-1 mt-2">
          <AlertCircle size={18} className="inline" />
          <br />
          <span className="text-xs">Error loading data</span>
        </div>
      </div>
    );
  }

  function onClickHandler() {
    if (onClick && id) {
      onClick(id);
    }
  }

  return (
    <div className={containerClassName} onClick={onClickHandler}>
      <div className="font-normal text-sm text-[#454954] border-b-[1px] pb-3 border-transparent">
        <span className="align-bottom">
          {infoText && (
            <HoverCard>
              <HoverCardTrigger className="px-2 cursor-help">
                <InfoIcon className="inline align-baseline" />
              </HoverCardTrigger>
              <HoverCardContent className="w-[500px] text-sm font-normal">
                {infoText}
              </HoverCardContent>
            </HoverCard>
          )}
          {title}
        </span>
      </div>
      <div className="flex flex-row items-end mt-3">
        <div className="font-medium text-4xl basis-2/3">
          {data && data.length > 0 ? (
            data?.map(v => (
              <div
                key={v.vesselCode}
                className="text-[#454954] text-xs pb-2 flex flex-column  items-center "
              >
                <div className={"w-[70px] "}>
                  {v.vesselCode}: {v.attainedCii?.toFixed(0)}%
                </div>
                <div className={"w-[10px] "}>-</div>
                <div
                  className="rounded px-2 py-1 ml-1 "
                  style={
                    emissionsCiiColors[
                      v.ciiRating as keyof typeof emissionsCiiColors
                    ]
                  }
                >
                  {v.ciiRating}
                </div>
              </div>
            ))
          ) : (
            <div className="text-[#454954]">--</div>
          )}
        </div>
      </div>
    </div>
  );
}
