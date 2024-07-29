"use client";

import { LoadingState } from "@/lib/types";
import { isNotNullOrUndefined } from "@/lib/utils";
import { DeltaTrend } from "@/components/ui/kpiCard/kpiCard";

import { TerminalKpiCard } from "../components/TerminalKpiCard";
import { PortEmission } from "../domain/interfaces";

interface IProps {
  kpiData: PortEmission;
  isSelected: boolean;
  loadingState: LoadingState;
  onClick: (id: string) => void;
}

export function PortEmissionKpiCard({
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
      infoText={kpiData?.infoText}
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
