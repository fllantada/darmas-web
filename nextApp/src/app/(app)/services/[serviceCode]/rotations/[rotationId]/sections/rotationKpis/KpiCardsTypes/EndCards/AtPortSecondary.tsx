import { LoadingState } from "@/lib/types";
import { ComparisonTrend } from "@/components/ui/kpiCard/kpiCard";

import { RotationKpiCard } from "../../components/CustomKpiCard";
import { EndPortSecondaryKpis } from "../../domain/interfaces";
import { AtPortKpiTitles } from "../../utils/kpi";

type IProps = {
  loadingState: LoadingState;
  portSecondaryKpis: EndPortSecondaryKpis;
};

export function AtPortSecondaryKpiCards({
  loadingState,
  portSecondaryKpis,
}: IProps): JSX.Element {
  return (
    <>
      <h3 className="text-sm font-medium text-[#454954] m-3 ">
        At Port Secondary KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.consumption}
          kpiResult={portSecondaryKpis.consumption.kpiValue.toString()}
          comparisonResult={portSecondaryKpis.consumption.comparison}
          comparisonTrend={
            portSecondaryKpis.consumption.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portSecondaryKpis.consumption.actual?.toString()}
          proformaAbsolute={portSecondaryKpis.consumption.proforma?.toString()}
          deltaAbsolute={portSecondaryKpis.consumption.delta?.toString()}
          deltaPercent={portSecondaryKpis.consumption.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.grossCraneProductivity}
          kpiResult={portSecondaryKpis.grossCraneProductivity.kpiValue.toString()}
          comparisonResult={portSecondaryKpis.grossCraneProductivity.comparison}
          comparisonTrend={
            portSecondaryKpis.grossCraneProductivity.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portSecondaryKpis.grossCraneProductivity.actual?.toString()}
          proformaAbsolute={portSecondaryKpis.grossCraneProductivity.proforma?.toString()}
          deltaAbsolute={portSecondaryKpis.grossCraneProductivity.delta?.toString()}
          deltaPercent={portSecondaryKpis.grossCraneProductivity.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.grossCraneIntensity}
          kpiResult={portSecondaryKpis.grossCraneIntensity.kpiValue.toString()}
          comparisonResult={portSecondaryKpis.grossCraneIntensity.comparison}
          comparisonTrend={
            portSecondaryKpis.grossCraneIntensity.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portSecondaryKpis.grossCraneIntensity.actual?.toString()}
          proformaAbsolute={portSecondaryKpis.grossCraneIntensity.proforma?.toString()}
          deltaAbsolute={portSecondaryKpis.grossCraneIntensity.delta?.toString()}
          deltaPercent={portSecondaryKpis.grossCraneIntensity.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.idleTime}
          kpiResult={portSecondaryKpis.idleTime.kpiValue.toString()}
          comparisonResult={portSecondaryKpis.idleTime.comparison}
          comparisonTrend={
            portSecondaryKpis.idleTime.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portSecondaryKpis.idleTime.actual?.toString()}
          proformaAbsolute={portSecondaryKpis.idleTime.proforma?.toString()}
          deltaAbsolute={portSecondaryKpis.idleTime.delta?.toString()}
          deltaPercent={portSecondaryKpis.idleTime.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.timeLost}
          kpiResult={portSecondaryKpis.timeLostRestow.kpiValue.toString()}
          comparisonResult={portSecondaryKpis.timeLostRestow.comparison}
          comparisonTrend={
            portSecondaryKpis.timeLostRestow.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portSecondaryKpis.timeLostRestow.actual?.toString()}
          proformaAbsolute={portSecondaryKpis.timeLostRestow.proforma?.toString()}
          deltaAbsolute={portSecondaryKpis.timeLostRestow.delta?.toString()}
          deltaPercent={portSecondaryKpis.timeLostRestow.deltaPercentage?.toString()}
        />
      </div>
    </>
  );
}
