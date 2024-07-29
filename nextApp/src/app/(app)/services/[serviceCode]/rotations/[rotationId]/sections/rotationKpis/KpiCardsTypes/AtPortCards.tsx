import { useMemo } from "react";
import type { AtPortKpIsType, BaseKpiType } from "@/generated/graphql";

import { LoadingState, type BaseKpiDisplayValues } from "@/lib/types";
import { isNotNullOrUndefined } from "@/lib/utils";
import { ComparisonTrend, DeltaTrend } from "@/components/ui/kpiCard/kpiCard";

import { RotationKpiCard } from "../components/CustomKpiCard";
import {
  AtPortKpiTitles,
  getAtPortConsumptionDisplayValues,
  getContainerMovesDisplayValues,
  getGrossBerthProductivityDisplayValues,
  getGrossCraneIntensityDisplayValues,
  getGrossCraneProductivityDisplayValues,
  getIdleTimeDisplayValues,
  getPortStayDisplayValues,
  getRestowMovesDisplayValues,
  getTimeLostDisplayValues,
  getWaitingTimeDisplayValues,
} from "../utils/kpi";

type DisplayKpiDataItem = {
  display: BaseKpiDisplayValues;
  data: BaseKpiType | undefined | null;
};

type DisplayKpiData = {
  waitingTime: DisplayKpiDataItem;
  portStay: DisplayKpiDataItem;
  grossBerthProductivity: DisplayKpiDataItem;
  containerMoves: DisplayKpiDataItem;
  restowMoves: DisplayKpiDataItem;
  consumption: DisplayKpiDataItem;
  grossCraneProductivity: DisplayKpiDataItem;
  grossCraneIntensity: DisplayKpiDataItem;
  idleTime: DisplayKpiDataItem;
  timeLost: DisplayKpiDataItem;
};

type AtPortCardsProps = {
  loadingState: LoadingState;
  data: AtPortKpIsType;
};

export default function AtPortCards({
  loadingState,
  data,
}: AtPortCardsProps): JSX.Element {
  const {
    waitingTime,
    portStay,
    grossBerthProductivity,
    containerMoves,
    restowMoves,
    consumption,
    grossCraneProductivity,
    grossCraneIntensity,
    idleTime,
    timeLost,
  } = useMemo<DisplayKpiData>(
    () => ({
      waitingTime: {
        display: getWaitingTimeDisplayValues(data.waitingTime),
        data: data.waitingTime,
      },
      portStay: {
        display: getPortStayDisplayValues(data.portStay),
        data: data.portStay,
      },
      grossBerthProductivity: {
        display: getGrossBerthProductivityDisplayValues(
          data.grossBerthProductivity,
        ),
        data: data.grossBerthProductivity,
      },
      containerMoves: {
        display: getContainerMovesDisplayValues(data.containerMoves),
        data: data.containerMoves,
      },
      restowMoves: {
        display: getRestowMovesDisplayValues(data.restowMoves),
        data: data.restowMoves,
      },
      consumption: {
        display: getAtPortConsumptionDisplayValues(data.consumption),
        data: data.consumption,
      },
      grossCraneProductivity: {
        display: getGrossCraneProductivityDisplayValues(
          data.grossCraneProductivity,
        ),
        data: data.grossCraneProductivity,
      },
      grossCraneIntensity: {
        display: getGrossCraneIntensityDisplayValues(data.grossCraneIntensity),
        data: data.grossCraneIntensity,
      },
      idleTime: {
        display: getIdleTimeDisplayValues(data.idleTime),
        data: data.idleTime,
      },
      timeLost: {
        display: getTimeLostDisplayValues(data.timeLost),
        data: data.timeLost,
      },
    }),
    [data],
  );

  return (
    <>
      <h3 className="text-sm font-medium text-[#454954] mb-3">
        At Port Primary KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.waitingTime}
          kpiResult={waitingTime.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(waitingTime?.data?.comparison) &&
            waitingTime.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={waitingTime?.display?.comparison}
          proformaAbsolute={waitingTime?.display?.proforma}
          actualAbsolute={waitingTime?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(waitingTime?.data?.delta) &&
            waitingTime.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={waitingTime?.display?.delta}
          deltaPercent={waitingTime?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.portStay}
          kpiResult={portStay.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(portStay?.data?.comparison) &&
            portStay.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={portStay?.display?.comparison}
          proformaAbsolute={portStay?.display?.proforma}
          actualAbsolute={portStay?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(portStay?.data?.delta) &&
            portStay.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={portStay?.display?.delta}
          deltaPercent={portStay?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.grossBerthProductivity}
          kpiResult={grossBerthProductivity.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(grossBerthProductivity?.data?.comparison) &&
            grossBerthProductivity.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={grossBerthProductivity?.display?.comparison}
          proformaAbsolute={grossBerthProductivity?.display?.proforma}
          actualAbsolute={grossBerthProductivity?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(grossBerthProductivity?.data?.delta) &&
            grossBerthProductivity.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={grossBerthProductivity?.display?.delta}
          deltaPercent={grossBerthProductivity?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.containerMoves}
          kpiResult={containerMoves.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(containerMoves?.data?.comparison) &&
            containerMoves.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={containerMoves?.display?.comparison}
          proformaAbsolute={containerMoves?.display?.proforma}
          actualAbsolute={containerMoves?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(containerMoves?.data?.delta) &&
            containerMoves.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={containerMoves?.display?.delta}
          deltaPercent={containerMoves?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.restowMoves}
          kpiResult={restowMoves.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(restowMoves?.data?.comparison) &&
            restowMoves.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={restowMoves?.display?.comparison}
          proformaAbsolute={restowMoves?.display?.proforma}
          actualAbsolute={restowMoves?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(restowMoves?.data?.delta) &&
            restowMoves.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={restowMoves?.display?.delta}
          deltaPercent={restowMoves?.display?.deltaPercentage}
        />
      </div>
      <h3 className="text-sm font-medium text-[#454954] mt-3 mb-4">
        At Port Secondary KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.consumption}
          kpiResult={consumption.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(consumption?.data?.comparison) &&
            consumption.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={consumption?.display?.comparison}
          proformaAbsolute={consumption?.display?.proforma}
          actualAbsolute={consumption?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(consumption?.data?.delta) &&
            consumption.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={consumption?.display?.delta}
          deltaPercent={consumption?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.grossCraneProductivity}
          kpiResult={grossCraneProductivity.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(grossCraneProductivity?.data?.comparison) &&
            grossCraneProductivity.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={grossCraneProductivity?.display?.comparison}
          proformaAbsolute={grossCraneProductivity?.display?.proforma}
          actualAbsolute={grossCraneProductivity?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(grossCraneProductivity?.data?.delta) &&
            grossCraneProductivity.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={grossCraneProductivity?.display?.delta}
          deltaPercent={grossCraneProductivity?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.grossCraneIntensity}
          kpiResult={grossCraneIntensity.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(grossCraneIntensity?.data?.comparison) &&
            grossCraneIntensity.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={grossCraneIntensity?.display?.comparison}
          proformaAbsolute={grossCraneIntensity?.display?.proforma}
          actualAbsolute={grossCraneIntensity?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(grossCraneIntensity?.data?.delta) &&
            grossCraneIntensity.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={grossCraneIntensity?.display?.delta}
          deltaPercent={grossCraneIntensity?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.idleTime}
          kpiResult={idleTime.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(idleTime?.data?.comparison) &&
            idleTime.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={idleTime?.display?.comparison}
          proformaAbsolute={idleTime?.display?.proforma}
          actualAbsolute={idleTime?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(idleTime?.data?.delta) &&
            idleTime.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={idleTime?.display?.delta}
          deltaPercent={idleTime?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtPortKpiTitles.timeLost}
          kpiResult={timeLost.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(timeLost?.data?.comparison) &&
            timeLost.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={timeLost?.display?.comparison}
          proformaAbsolute={timeLost?.display?.proforma}
          actualAbsolute={timeLost?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(timeLost?.data?.delta) &&
            timeLost.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={timeLost?.display?.delta}
          deltaPercent={timeLost?.display?.deltaPercentage}
        />
      </div>
    </>
  );
}
