"use client";

import { DeltaTrend } from "@/components/ui/kpiCard/kpiCard";
import { LoadingState } from "@/app/plataform/lib/types";
import { isNotNullOrUndefined } from "@/app/plataform/lib/utils";

import { TerminalKpiCard } from "../components/TerminalKpiCard";
import { BerthOnArrival } from "../domain/interfaces";

interface IProps {
  kpiData: BerthOnArrival;
  isSelected: boolean;
  loadingState: LoadingState;
  onClick: (id: string) => void;
}

export function BerthOnArrivalKpiCard({
  kpiData,
  isSelected,
  loadingState,
  onClick,
}: IProps) {
  const handleClickOnCard = () => {
    onClick(kpiData?.titleText ?? "");
  };

  return (
    <TerminalKpiCard
      title={kpiData?.titleText ?? ""}
      actualAbsolute={kpiData?.actual?.toFixed(1)}
      loadingState={loadingState ?? LoadingState.LOADING}
      id={kpiData?.titleText ?? ""}
      infoText={kpiData?.infoText ?? ""}
      selected={isSelected}
      className="basis-1/3"
      kpiResult={
        isNotNullOrUndefined(kpiData?.kpiValue)
          ? `${kpiData?.kpiValue?.toFixed(1)}%`
          : "--"
      }
      comparisonResult={kpiData.comparison?.toFixed(1)}
      proformaAbsolute={kpiData?.proforma?.toFixed(1)}
      deltaTrend={
        kpiData?.delta && kpiData?.delta >= 0
          ? DeltaTrend.POSITIVE
          : DeltaTrend.NEGATIVE
      }
      deltaAbsolute={kpiData?.delta?.toFixed(1)}
      deltaPercent={
        kpiData?.deltaPercentage
          ? `${kpiData?.deltaPercentage?.toFixed(1)}%`
          : "--"
      }
      onClick={handleClickOnCard}
    />
  );
}
