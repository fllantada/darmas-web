import { ComparisonTrend } from "@/components/ui/kpiCard/kpiCard";
import { LoadingState } from "@/app/plataform/lib/types";

import { RotationKpiCard } from "../../components/CustomKpiCard";
import { EndPortPrimaryKpis } from "../../domain/interfaces";
import { AtPortKpiTitles } from "../../utils/kpi";

type IProps = {
  loadingState: LoadingState;
  portPrimaryKpis: EndPortPrimaryKpis;
};

export function AtPortMainKpiCards({
  loadingState,
  portPrimaryKpis,
}: IProps): JSX.Element {
  return (
    <>
      <h3 className="text-sm font-medium text-[#454954] m-3">
        At Port Main KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5 "
          title={AtPortKpiTitles.waitingTime}
          kpiResult={portPrimaryKpis.waitingTime.kpiValue.toString()}
          comparisonResult={portPrimaryKpis.waitingTime.comparison}
          comparisonTrend={
            portPrimaryKpis.waitingTime.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portPrimaryKpis.waitingTime.actual?.toString()}
          proformaAbsolute={portPrimaryKpis.waitingTime.proforma?.toString()}
          deltaAbsolute={portPrimaryKpis.waitingTime.delta?.toString()}
          deltaPercent={portPrimaryKpis.waitingTime.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.portStay}
          kpiResult={portPrimaryKpis.portStayTime.kpiValue.toString()}
          comparisonResult={portPrimaryKpis.portStayTime.comparison}
          comparisonTrend={
            portPrimaryKpis.portStayTime.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portPrimaryKpis.portStayTime.actual?.toString()}
          proformaAbsolute={portPrimaryKpis.portStayTime.proforma?.toString()}
          deltaAbsolute={portPrimaryKpis.portStayTime.delta?.toString()}
          deltaPercent={portPrimaryKpis.portStayTime.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.grossBerthProductivity}
          kpiResult={portPrimaryKpis.grossBerthProductivity.kpiValue.toString()}
          comparisonResult={portPrimaryKpis.grossBerthProductivity.comparison}
          comparisonTrend={
            portPrimaryKpis.grossBerthProductivity.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portPrimaryKpis.grossBerthProductivity.actual?.toString()}
          proformaAbsolute={portPrimaryKpis.grossBerthProductivity.proforma?.toString()}
          deltaAbsolute={portPrimaryKpis.grossBerthProductivity.delta?.toString()}
          deltaPercent={portPrimaryKpis.grossBerthProductivity.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.containerMoves}
          kpiResult={portPrimaryKpis.containerMoves.kpiValue.toString()}
          comparisonResult={portPrimaryKpis.containerMoves.comparison}
          comparisonTrend={
            portPrimaryKpis.containerMoves.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portPrimaryKpis.containerMoves.actual?.toString()}
          proformaAbsolute={portPrimaryKpis.containerMoves.proforma?.toString()}
          deltaAbsolute={portPrimaryKpis.containerMoves.delta?.toString()}
          deltaPercent={portPrimaryKpis.containerMoves.deltaPercentage?.toString()}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.restowMoves}
          kpiResult={portPrimaryKpis.restowMoves.kpiValue.toString()}
          comparisonResult={portPrimaryKpis.restowMoves.comparison}
          comparisonTrend={
            portPrimaryKpis.restowMoves.isPositive
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          actualAbsolute={portPrimaryKpis.restowMoves.actual?.toString()}
          proformaAbsolute={portPrimaryKpis.restowMoves.proforma?.toString()}
          deltaAbsolute={portPrimaryKpis.restowMoves.delta?.toString()}
          deltaPercent={portPrimaryKpis.restowMoves.deltaPercentage?.toString()}
        />
      </div>
    </>
  );
}
