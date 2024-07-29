"use client";

import { useMemo, useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ComparisonTrend } from "@/components/ui/kpiCard/kpiCard";
import { TrendElement } from "@/components/ui/kpiCard/trendElement";
import InfoIcon from "@/components/icons/info";
import {
  cn,
  isNotNullOrUndefined,
  numberToNoDecimalStringPercentage,
} from "@/app/plataform/lib/utils";
import { ROTATIONS_TEXT } from "@/app/plataform/text/rotations";
import { HeaderKpiTitles } from "@/app/plataform/text/services";

import { OperationalEfficiencyKpiValues } from "../../domain/interfaces";

interface IProps {
  operationalEfficiency: OperationalEfficiencyKpiValues;
  isSelected?: boolean;
  onClick?: () => void;
}

export function OperationalEfficiencyKpiCard({
  operationalEfficiency,
  isSelected,
  onClick,
}: IProps): JSX.Element {
  const [hover, setHover] = useState(false);
  const containerClassName = useMemo(
    () =>
      cn(
        "rounded-md border-[1px] px-4 py-5 bg-white basis-1/4",
        isSelected ? "border-[#00C5B7]" : "border-[#DBDCDF]",
        { "cursor-pointer": true },
      ),
    [isSelected],
  );

  return (
    <div
      className={containerClassName}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <div
        className={cn(
          "font-normal text-sm text-[#454954] border-b-[1px] pb-2 flex",
          hover ? "border-[#DBDCDF]" : "border-transparent",
        )}
      >
        <span className="flex-1 text-nowrap overflow-hidden text-ellipsis">
          <HoverCard>
            <HoverCardTrigger className="pr-2 cursor-help">
              <InfoIcon className="inline align-middle" />
            </HoverCardTrigger>
            <HoverCardContent className="w-[500px] text-sm font-normal white text-wrap">
              {ROTATIONS_TEXT.HEADER_KPI.OPERATIONAL_EFFICIENCY_INFO_TEXT}
            </HoverCardContent>
          </HoverCard>

          {HeaderKpiTitles.operationalEfficiency}
        </span>
        {hover && (
          <div className="flex-none align-top mt-[-7px] h-[25px]">
            <span className="ml-1">
              <TrendElement
                comparisonResult={numberToNoDecimalStringPercentage(
                  operationalEfficiency?.comparison,
                  1,
                )}
                comparisonTrend={
                  isNotNullOrUndefined(operationalEfficiency?.comparison) &&
                  operationalEfficiency.comparison >= 0
                    ? ComparisonTrend.UP
                    : ComparisonTrend.DOWN
                }
                hover={hover}
              />
            </span>
            <span className="text-lg ml-2 text-[#22242A] font-medium">
              {numberToNoDecimalStringPercentage(
                operationalEfficiency?.kpiValue,
                1,
              )}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-end mt-3">
        {!hover && (
          <>
            <div className="font-medium text-4xl basis-2/3">
              {numberToNoDecimalStringPercentage(
                operationalEfficiency?.kpiValue,
                0,
              )}
            </div>
            <div className="basis-1/3 text-right">
              <TrendElement
                comparisonResult={numberToNoDecimalStringPercentage(
                  operationalEfficiency?.comparison,
                  1,
                )}
                comparisonTrend={
                  isNotNullOrUndefined(operationalEfficiency?.comparison) &&
                  operationalEfficiency.comparison >= 0
                    ? ComparisonTrend.UP
                    : ComparisonTrend.DOWN
                }
                hover={hover}
              />
            </div>
          </>
        )}
        {hover && (
          <div className="grid grid-cols-7 gap-2 text-xs w-full">
            <div className="col-span-2">
              <div className="text-[#22242A] mb-1">Bunker</div>
              <span className="text-slate-400">
                {numberToNoDecimalStringPercentage(
                  operationalEfficiency.bunkerDeltaPercentage,
                )}
              </span>
            </div>
            <div className="col-span-2 border-x-[1px] px-2">
              <div className="text-[#22242A] mb-1">Port Calls</div>
              <span className={cn("text-slate-400")}>
                {numberToNoDecimalStringPercentage(
                  operationalEfficiency.portCallsDeltaPercentage,
                ) ?? "--"}
              </span>
            </div>
            <div className="col-span-3">
              <div className="text-[#22242A] mb-1">Voyage Days</div>
              <span className={cn("text-slate-400")}>
                {numberToNoDecimalStringPercentage(
                  operationalEfficiency.voyageDaysDeltaPercentage,
                ) ?? "--"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
