"use client";

import { useMemo, useState } from "react";
import { CommonKpiValues } from "@/globalDomain/commonKpiValues";
import { ROTATIONS_TEXT } from "@/text/rotations";
import { HeaderKpiTitles } from "@/text/services";

import {
  cn,
  isNotNullOrUndefined,
  numberToNoDecimalString,
  numberToNoDecimalStringPercentage,
} from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ComparisonTrend } from "@/components/ui/kpiCard/kpiCard";
import { TrendElement } from "@/components/ui/kpiCard/trendElement";
import InfoIcon from "@/components/icons/info";

interface IProps {
  schedulePerformance: CommonKpiValues;
  isSelected?: boolean;
  onClick?: () => void;
}

export function SchedulePerformanceKpiCard({
  schedulePerformance,
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
    <>
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
                {ROTATIONS_TEXT.HEADER_KPI.SCHEDULE_PERFORMANCE_INFO_TEXT}
              </HoverCardContent>
            </HoverCard>

            {HeaderKpiTitles.schedulePerformance}
          </span>
          {hover && (
            <div className="flex-none align-top mt-[-7px] h-[25px]">
              <span className="ml-1">
                <TrendElement
                  comparisonResult={numberToNoDecimalStringPercentage(
                    schedulePerformance?.comparison,
                  )}
                  comparisonTrend={
                    schedulePerformance?.comparison &&
                    schedulePerformance?.comparison >= 0
                      ? ComparisonTrend.UP
                      : ComparisonTrend.DOWN
                  }
                  hover={hover}
                />
              </span>
              <span className="text-lg ml-2 text-[#22242A] font-medium">
                {numberToNoDecimalStringPercentage(
                  schedulePerformance?.kpiValue,
                ) || "--"}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-row items-end mt-3">
          {!hover && (
            <>
              <div className="font-medium text-4xl basis-2/3">
                {numberToNoDecimalStringPercentage(
                  schedulePerformance?.kpiValue,
                ) || "--"}
              </div>
              <div className="basis-1/3 text-right">
                <TrendElement
                  comparisonResult={numberToNoDecimalStringPercentage(
                    schedulePerformance?.comparison,
                  )}
                  comparisonTrend={
                    schedulePerformance?.comparison &&
                    schedulePerformance?.comparison >= 0
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
                <div className="text-[#22242A] mb-1">Proforma</div>
                <span className="text-slate-400">
                  {numberToNoDecimalString(schedulePerformance?.proforma) ||
                    "--"}
                </span>
              </div>
              <div className="col-span-2 border-x-[1px] px-2">
                <div className="text-[#22242A] mb-1">Actual</div>
                <span className={"text-slate-400"}>
                  {numberToNoDecimalString(schedulePerformance?.actual) || "--"}
                </span>
              </div>
              <div className="col-span-3">
                <div className="text-[#22242A] mb-1">Delta</div>
                <span className={"text-slate-400"}>
                  {numberToNoDecimalString(schedulePerformance?.delta) || "--"}
                  {isNotNullOrUndefined(schedulePerformance?.deltaPercentage)
                    ? ` (${numberToNoDecimalStringPercentage(
                        schedulePerformance?.deltaPercentage,
                        1,
                      )})`
                    : "%"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}