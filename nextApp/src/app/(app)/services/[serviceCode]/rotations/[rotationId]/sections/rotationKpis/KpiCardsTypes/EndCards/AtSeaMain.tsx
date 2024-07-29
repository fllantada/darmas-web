import { LoadingState } from "@/lib/types";
import { ComparisonTrend } from "@/components/ui/kpiCard/kpiCard";

import { RotationKpiCard } from "../../components/CustomKpiCard";
import { EndSeaPrimaryKpis } from "../../domain/interfaces";
import { AtSeaKpiTitles } from "../../utils/kpi";
import CargoOnBoardKpiCard from "../CargoOnBoardKpiCard";

type IProps = {
  loadingState: LoadingState;
  seaPrimaryKpis: EndSeaPrimaryKpis;
};

export function AtSeaMainKpiCards({
  loadingState,
  seaPrimaryKpis,
}: IProps): JSX.Element {
  return (
    <>
      <h3 className="text-sm font-medium text-[#454954] mb-3">
        At Sea Main KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.speed}
          comparisonTrend={
            seaPrimaryKpis.speed.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaPrimaryKpis.speed.comparison}
          kpiResult={seaPrimaryKpis.speed.kpiValue.toString()}
          actualAbsolute={seaPrimaryKpis.speed.actual?.toString()}
          proformaAbsolute={seaPrimaryKpis.speed.proforma?.toString()}
          deltaAbsolute={seaPrimaryKpis.speed.delta?.toString()}
          deltaPercent={seaPrimaryKpis.speed.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.distance}
          comparisonTrend={
            seaPrimaryKpis.distance.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaPrimaryKpis.distance.comparison}
          kpiResult={seaPrimaryKpis.distance.kpiValue.toString()}
          actualAbsolute={seaPrimaryKpis.distance.actual?.toString()}
          proformaAbsolute={seaPrimaryKpis.distance.proforma?.toString()}
          deltaAbsolute={seaPrimaryKpis.distance.delta?.toString()}
          deltaPercent={seaPrimaryKpis.distance.deltaPercentage?.toString()}
        />
        <CargoOnBoardKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.cargoOnboard}
          containerDryLadenActual={
            seaPrimaryKpis.cargoOnboard.ladenDry.kpiValue
          }
          containerDryEmptyActual={
            seaPrimaryKpis.cargoOnboard.emptyDry.kpiValue
          }
          containerRefLadenActual={
            seaPrimaryKpis.cargoOnboard.ladenReefer.kpiValue
          }
          containerDryLadenComparison={
            seaPrimaryKpis.cargoOnboard.ladenDry.variation
          }
          containerRefLadenComparison={
            seaPrimaryKpis.cargoOnboard.ladenReefer.variation
          }
          containerDryEmptyComparison={
            seaPrimaryKpis.cargoOnboard.emptyDry.variation
          }
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.consumption}
          comparisonTrend={
            seaPrimaryKpis.consumption.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaPrimaryKpis.consumption.comparison}
          kpiResult={seaPrimaryKpis.consumption.kpiValue.toString()}
          actualAbsolute={seaPrimaryKpis.consumption.actual?.toString()}
          proformaAbsolute={seaPrimaryKpis.consumption.proforma?.toString()}
          deltaAbsolute={seaPrimaryKpis.consumption.delta?.toString()}
          deltaPercent={seaPrimaryKpis.consumption.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.co2Emissions}
          kpiResult={seaPrimaryKpis.emissions.kpiValue.toString()}
          comparisonTrend={
            seaPrimaryKpis.emissions.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaPrimaryKpis.emissions.comparison}
          actualAbsolute={seaPrimaryKpis.emissions.actual?.toString()}
          proformaAbsolute={seaPrimaryKpis.emissions.proforma?.toString()}
          deltaAbsolute={seaPrimaryKpis.emissions.delta?.toString()}
          deltaPercent={seaPrimaryKpis.emissions.deltaPercentage?.toString()}
        />
      </div>
    </>
  );
}
