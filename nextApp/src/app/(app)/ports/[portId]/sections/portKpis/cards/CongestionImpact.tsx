"use client";

import { HeaderKpiTitles } from "@/text/ports";

import { LoadingState } from "@/lib/types";
import { isNotNullOrUndefined } from "@/lib/utils";
import { DeltaTrend } from "@/components/ui/kpiCard/kpiCard";

import { PortKpiCard } from "../components/PortKpiCard";
import { DisplayKpiDataItem } from "../PortHeaderKpis";
import { portInfoText } from "./defaultValues";

interface IProps {
  isSelected: boolean;
  loadingState: LoadingState;
  kpiData?: DisplayKpiDataItem;
  onClick?: (id: string) => void;
}

export function CongestionImpactKpiCard({
  isSelected,
  loadingState,
  kpiData,
  onClick,
}: IProps): JSX.Element {
  const handleClick = () => {
    onClick && onClick("congestion_impact");
  };
  return (
    <PortKpiCard
      loadingState={loadingState}
      id="congestion_impact"
      infoText={portInfoText.congestionImpact}
      selected={isSelected}
      className="basis-1/4"
      title={HeaderKpiTitles.congestionImpact}
      kpiResult={kpiData?.display.kpiValue}
      comparisonResult={kpiData?.display.comparison}
      proformaAbsolute={kpiData?.display.proforma}
      actualAbsolute={kpiData?.display.actual}
      flipOnHover={false}
      deltaTrend={
        isNotNullOrUndefined(kpiData?.data?.delta) && kpiData?.data.delta >= 0
          ? DeltaTrend.POSITIVE
          : DeltaTrend.NEGATIVE
      }
      deltaAbsolute={kpiData?.display.delta}
      deltaPercent={kpiData?.display.deltaPercentage}
      onClick={handleClick}
    />
  );
}
