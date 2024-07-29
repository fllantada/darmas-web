"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import InfoIcon from "@/components/icons/info";
import { LoadingState } from "@/app/plataform/lib/types";
import { cn, isNotNullOrUndefined } from "@/app/plataform/lib/utils";

import { Skeleton } from "../skeleton";
import { TrendElement } from "./trendElement";

export enum ComparisonTrend {
  UP,
  DOWN,
}

export enum DeltaTrend {
  POSITIVE,
  NEGATIVE,
}

type KpiCardProps = {
  id?: string;
  infoText?: string;
  loadingState?: LoadingState;
  selected?: boolean;
  className?: string;
  title: string;
  comparisonResult?: string | boolean | null;
  comparisonTrend?: ComparisonTrend;
  kpiResult?: string | JSX.Element | null;
  proformaAbsolute?: string | JSX.Element | null;
  actualAbsolute?: string | JSX.Element | null;
  deltaTrend?: DeltaTrend;
  deltaAbsolute?: string | null;
  deltaPercent?: string | null;
  flipOnHover?: boolean;
  onClick?: (id: string) => void;
};

export default function KpiCard({
  id,
  infoText,
  selected = false,
  className,
  title,
  comparisonResult,
  comparisonTrend,
  kpiResult,
  proformaAbsolute,
  actualAbsolute,
  deltaTrend,
  deltaAbsolute,
  deltaPercent,
  flipOnHover = true,
  loadingState = LoadingState.SUCCESS,
  onClick,
}: KpiCardProps): JSX.Element {
  const [hover, setHover] = useState(false);

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
    <div
      className={containerClassName}
      onMouseEnter={flipOnHover ? () => setHover(true) : undefined}
      onMouseLeave={flipOnHover ? () => setHover(false) : undefined}
      onClick={onClickHandler}
    >
      <div
        className={cn(
          "font-normal text-sm text-[#454954] border-b-[1px] pb-2 flex",
          hover ? "border-[#DBDCDF]" : "border-transparent",
        )}
      >
        <span className="flex-1 text-nowrap overflow-hidden text-ellipsis">
          {infoText && (
            <HoverCard>
              <HoverCardTrigger className="pr-2 cursor-help">
                <InfoIcon className="inline align-middle" />
              </HoverCardTrigger>
              <HoverCardContent className="w-[500px] text-sm font-normal white text-wrap">
                {infoText}
              </HoverCardContent>
            </HoverCard>
          )}
          {title}
        </span>
        {hover && (
          <div className="flex-none align-top mt-[-7px] h-[25px]">
            <span className="ml-1">
              <TrendElement
                comparisonResult={comparisonResult}
                comparisonTrend={comparisonTrend}
                hover={hover}
              />
            </span>
            <span className="text-lg ml-2 text-[#22242A] font-medium">
              {kpiResult || "--"}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-row items-end mt-3">
        {!hover && (
          <>
            <div className="font-medium text-4xl basis-2/3">
              {kpiResult || "--"}
            </div>
            <div className="basis-1/3 text-right">
              <TrendElement
                comparisonResult={comparisonResult}
                comparisonTrend={comparisonTrend}
                hover={hover}
              />
            </div>
          </>
        )}
        {hover && (
          <div className="grid grid-cols-7 gap-2 text-xs w-full">
            <div className="col-span-2">
              <div className="text-[#22242A] mb-1">Proforma</div>
              <span className="text-green-600">
                {isNotNullOrUndefined(proformaAbsolute)
                  ? proformaAbsolute
                  : "--"}
              </span>
            </div>
            <div className="col-span-2 border-x-[1px] px-2">
              <div className="text-[#22242A] mb-1">Actual</div>
              <span
                className={cn(
                  isNotNullOrUndefined(deltaAbsolute)
                    ? deltaTrend == DeltaTrend.NEGATIVE
                      ? "text-red-600"
                      : "text-green-600"
                    : "text-slate-400",
                )}
              >
                {isNotNullOrUndefined(actualAbsolute) ? actualAbsolute : "--"}
              </span>
            </div>
            <div className="col-span-3">
              <div className="text-[#22242A] mb-1">Delta</div>
              <span
                className={cn(
                  isNotNullOrUndefined(deltaAbsolute)
                    ? deltaTrend == DeltaTrend.NEGATIVE
                      ? "text-red-600"
                      : "text-green-600"
                    : "text-slate-400",
                )}
              >
                {isNotNullOrUndefined(deltaAbsolute) ? deltaAbsolute : "--"}
                {isNotNullOrUndefined(deltaPercent) ? ` (${deltaPercent})` : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
