"use client";

import { DeltaTrend } from "@/components/ui/kpiCard/kpiCard";
import { LoadingState } from "@/app/plataform/lib/types";
import { isNotNullOrUndefined } from "@/app/plataform/lib/utils";
import { HeaderKpiTitles } from "@/app/plataform/text/ports";

import { PortKpiCard } from "../components/PortKpiCard";
import { DisplayKpiDataItem } from "../PortHeaderKpis";
import { portInfoText } from "./defaultValues";

interface IProps {
  isSelected: boolean;
  loadingState: LoadingState;
  kpiData?: DisplayKpiDataItem;
  onClick?: (id: string) => void;
}

export function BerthOnArrivalKpiCard({
  isSelected,
  loadingState,
  kpiData,
  onClick,
}: IProps): JSX.Element {
  const handleClick = () => {
    onClick && onClick("berth_on_arrival");
  };
  return (
    <PortKpiCard
      loadingState={loadingState}
      id="berth_on_arrival"
      infoText={portInfoText.berthOnArrival}
      selected={isSelected}
      className="basis-1/4"
      title={HeaderKpiTitles.berthOnArrival}
      kpiResult={kpiData?.display.kpiValue}
      comparisonResult={kpiData?.display.comparison}
      proformaAbsolute={kpiData?.display.proforma}
      actualAbsolute={kpiData?.display.actual}
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
