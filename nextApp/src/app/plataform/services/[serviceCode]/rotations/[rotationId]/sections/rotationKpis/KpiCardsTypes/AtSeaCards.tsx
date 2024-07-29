import { useMemo } from "react";
import type {
  AtSeaKpIsType,
  BaseKpiType,
  CargoOnboardKpiType,
  ServiceCiiKpiType,
} from "@/generated/graphql";

import { ComparisonTrend, DeltaTrend } from "@/components/ui/kpiCard/kpiCard";
import {
  LoadingState,
  type BaseKpiDisplayValues,
} from "@/app/plataform/lib/types";
import { isNotNullOrUndefined } from "@/app/plataform/lib/utils";

import { RotationKpiCard } from "../components/CustomKpiCard";
import {
  AtSeaKpiTitles,
  getAtSeaConsumptionDisplayValues,
  getCargoOnboardyDisplayValues,
  getCo2EmissionsDisplayValue,
  getDistanceDisplayValues,
  getEngineLoadDisplayValues,
  getRpmDisplayValues,
  getSecaDistanceDisplayValues,
  getServiceCiiDisplayValues,
  getSlipDisplayValues,
  getSpeedDisplayValues,
} from "../utils/kpi";
import CargoOnBoardKpiCard from "./CargoOnBoardKpiCard";

type DisplayKpiDataItem = {
  display: BaseKpiDisplayValues;
  data: BaseKpiType | undefined | null;
};

type DisplayKpiData = {
  speed: DisplayKpiDataItem;
  distance: DisplayKpiDataItem;
  cargoOnboard: {
    display: BaseKpiDisplayValues;
    data: CargoOnboardKpiType | undefined | null;
  };
  consumption: DisplayKpiDataItem;
  co2Emissions: DisplayKpiDataItem;
  rpm: DisplayKpiDataItem;
  secaDistance: DisplayKpiDataItem;
  engineLoad: DisplayKpiDataItem;
  slip: DisplayKpiDataItem;
  serviceCii: {
    display: BaseKpiDisplayValues;
    data: ServiceCiiKpiType | undefined | null;
  };
};

type AtSeaCardsProps = {
  loadingState: LoadingState;
  data: AtSeaKpIsType;
};

export default function AtSeaCards({
  loadingState,
  data,
}: AtSeaCardsProps): JSX.Element {
  const {
    speed,
    distance,
    cargoOnboard,
    consumption,
    co2Emissions,
    rpm,
    secaDistance,
    engineLoad,
    slip,
    serviceCii,
  } = useMemo<DisplayKpiData>(
    () => ({
      speed: { display: getSpeedDisplayValues(data.speed), data: data.speed },
      distance: {
        display: getDistanceDisplayValues(data.distance),
        data: data.distance,
      },
      cargoOnboard: {
        display: getCargoOnboardyDisplayValues(data.cargoOnboard),
        data: data.cargoOnboard,
      },
      consumption: {
        display: getAtSeaConsumptionDisplayValues(data.consumption),
        data: data.consumption,
      },
      co2Emissions: {
        display: getCo2EmissionsDisplayValue(data.co2Emissions),
        data: data.co2Emissions,
      },
      rpm: { display: getRpmDisplayValues(data.rpm), data: data.rpm },
      secaDistance: {
        display: getSecaDistanceDisplayValues(data.secaDistance),
        data: data.secaDistance,
      },
      engineLoad: {
        display: getEngineLoadDisplayValues(data.engineLoad),
        data: data.engineLoad,
      },
      slip: { display: getSlipDisplayValues(data.slip), data: data.slip },
      serviceCii: {
        display: getServiceCiiDisplayValues(data.serviceCii),
        data: data.serviceCii,
      },
    }),
    [data],
  );

  return (
    <>
      <h3 className="text-sm font-medium text-[#454954] mb-3">
        At Sea Primary KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.speed}
          kpiResult={speed.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(speed?.data?.comparison) &&
            speed.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={speed?.display?.comparison}
          proformaAbsolute={speed?.display?.proforma}
          actualAbsolute={speed?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(speed?.data?.delta) && speed.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={speed?.display?.delta}
          deltaPercent={speed?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.distance}
          kpiResult={distance.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(distance?.data?.comparison) &&
            distance.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={distance?.display?.comparison}
          proformaAbsolute={distance?.display?.proforma}
          actualAbsolute={distance?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(distance?.data?.delta) &&
            distance.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={distance?.display?.delta}
          deltaPercent={distance?.display?.deltaPercentage}
        />
        <CargoOnBoardKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.cargoOnboard}
          containerDryLadenActual={cargoOnboard?.data?.containerDryLadenActual}
          containerDryEmptyActual={cargoOnboard?.data?.containerDryEmptyActual}
          containerRefLadenActual={cargoOnboard?.data?.containerRefLadenActual}
          containerDryLadenComparison={
            cargoOnboard?.data?.containerDryLadenComparison
          }
          containerDryEmptyComparison={
            cargoOnboard?.data?.containerDryEmptyComparison
          }
          containerRefLadenComparison={
            cargoOnboard?.data?.containerRefLadenComparison
          }
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.consumption}
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
          title={AtSeaKpiTitles.co2Emissions}
          kpiResult={co2Emissions.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(co2Emissions?.data?.comparison) &&
            co2Emissions.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={co2Emissions?.display?.comparison}
          proformaAbsolute={co2Emissions?.display?.proforma}
          actualAbsolute={co2Emissions?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(co2Emissions?.data?.delta) &&
            co2Emissions.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={co2Emissions?.display?.delta}
          deltaPercent={co2Emissions?.display?.deltaPercentage}
        />
      </div>
      <h3 className="text-sm font-medium text-[#454954] mt-3 mb-4">
        At Sea Secondary KPIs
      </h3>
      <div className="flex flex-row space-x-2">
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.rpm}
          kpiResult={rpm.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(rpm?.data?.comparison) &&
            rpm.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={rpm?.display?.comparison}
          proformaAbsolute={rpm?.display?.proforma}
          actualAbsolute={rpm?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(rpm?.data?.delta) && rpm.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={rpm?.display?.delta}
          deltaPercent={rpm?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.secaDistance}
          kpiResult={secaDistance.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(secaDistance?.data?.comparison) &&
            secaDistance.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={secaDistance?.display?.comparison}
          proformaAbsolute={secaDistance?.display?.proforma}
          actualAbsolute={secaDistance?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(secaDistance?.data?.delta) &&
            secaDistance.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={secaDistance?.display?.delta}
          deltaPercent={secaDistance?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.engineLoad}
          kpiResult={engineLoad.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(engineLoad?.data?.comparison) &&
            engineLoad.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={engineLoad?.display?.comparison}
          proformaAbsolute={engineLoad?.display?.proforma}
          actualAbsolute={engineLoad?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(engineLoad?.data?.delta) &&
            engineLoad.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={engineLoad?.display?.delta}
          deltaPercent={engineLoad?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.slip}
          kpiResult={slip.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(slip?.data?.comparison) &&
            slip.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={slip?.display?.comparison}
          proformaAbsolute={slip?.display?.proforma}
          actualAbsolute={slip?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(slip?.data?.delta) && slip.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={slip?.display?.delta}
          deltaPercent={slip?.display?.deltaPercentage}
        />
        <RotationKpiCard
          loadingState={loadingState}
          className="basis-1/5"
          title={AtSeaKpiTitles.serviceCii}
          kpiResult={serviceCii.display.kpiValue}
          comparisonTrend={
            isNotNullOrUndefined(serviceCii?.data?.comparison) &&
            serviceCii.data.comparison >= 0
              ? ComparisonTrend.UP
              : ComparisonTrend.DOWN
          }
          comparisonResult={serviceCii?.display?.comparison}
          proformaAbsolute={serviceCii?.display?.proforma}
          actualAbsolute={serviceCii?.display?.actual}
          deltaTrend={
            isNotNullOrUndefined(serviceCii?.data?.delta) &&
            serviceCii.data.delta >= 0
              ? DeltaTrend.POSITIVE
              : DeltaTrend.NEGATIVE
          }
          deltaAbsolute={serviceCii?.display?.delta}
          deltaPercent={serviceCii?.display?.deltaPercentage}
        />
      </div>
    </>
  );
}
