import { LoadingState } from "@/lib/types";
import { ComparisonTrend } from "@/components/ui/kpiCard/kpiCard";

import { RotationKpiCard } from "../../components/CustomKpiCard";
import { EndSeaSecondaryKpis } from "../../domain/interfaces";
import { AtSeaKpiTitles } from "../../utils/kpi";

type IProps = {
  loadingState: LoadingState;
  seaSecondaryKpis: EndSeaSecondaryKpis;
};

export function AtSeaSecondaryKpiCards({
  loadingState,
  seaSecondaryKpis,
}: IProps): JSX.Element {
  return (
    <>
      <h3 className="text-sm font-medium text-[#454954] m-3">
        At Sea Secondary KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.rpm}
          kpiResult={seaSecondaryKpis.rpm.kpiValue.toString()}
          comparisonTrend={
            seaSecondaryKpis.rpm.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaSecondaryKpis.rpm.comparison}
          actualAbsolute={seaSecondaryKpis.rpm.actual?.toString()}
          proformaAbsolute={seaSecondaryKpis.rpm.proforma?.toString()}
          deltaAbsolute={seaSecondaryKpis.rpm.delta?.toString()}
          deltaPercent={seaSecondaryKpis.rpm.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.secaDistance}
          kpiResult={seaSecondaryKpis.secaDistance.kpiValue.toString()}
          comparisonTrend={
            seaSecondaryKpis.secaDistance.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaSecondaryKpis.secaDistance.comparison}
          actualAbsolute={seaSecondaryKpis.secaDistance.actual?.toString()}
          proformaAbsolute={seaSecondaryKpis.secaDistance.proforma?.toString()}
          deltaAbsolute={seaSecondaryKpis.secaDistance.delta?.toString()}
          deltaPercent={seaSecondaryKpis.secaDistance.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.engineLoad}
          kpiResult={seaSecondaryKpis.engineLoad.kpiValue.toString()}
          comparisonTrend={
            seaSecondaryKpis.engineLoad.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaSecondaryKpis.engineLoad.comparison}
          actualAbsolute={seaSecondaryKpis.engineLoad.actual?.toString()}
          proformaAbsolute={seaSecondaryKpis.engineLoad.proforma?.toString()}
          deltaAbsolute={seaSecondaryKpis.engineLoad.delta?.toString()}
          deltaPercent={seaSecondaryKpis.engineLoad.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.slip}
          kpiResult={seaSecondaryKpis.slip.kpiValue.toString()}
          comparisonTrend={
            seaSecondaryKpis.slip.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaSecondaryKpis.slip.comparison}
          actualAbsolute={seaSecondaryKpis.slip.actual?.toString()}
          proformaAbsolute={seaSecondaryKpis.slip.proforma?.toString()}
          deltaAbsolute={seaSecondaryKpis.slip.delta?.toString()}
          deltaPercent={seaSecondaryKpis.slip.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.serviceCii}
          kpiResult={seaSecondaryKpis.serviceCii.kpiValue.toString()}
          comparisonTrend={
            seaSecondaryKpis.serviceCii.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={seaSecondaryKpis.serviceCii.comparison}
          actualAbsolute={seaSecondaryKpis.serviceCii.actual?.toString()}
          proformaAbsolute={seaSecondaryKpis.serviceCii.proforma?.toString()}
          deltaAbsolute={seaSecondaryKpis.serviceCii.delta?.toString()}
          deltaPercent={seaSecondaryKpis.serviceCii.deltaPercentage?.toString()}
        />
      </div>
    </>
  );
}
