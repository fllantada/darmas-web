import { AtPortKpIsType, AtSeaKpIsType } from "@/generated/graphql";
import { DateTime } from "luxon";

import type { BaseKpiDisplayValues } from "@/lib/types";

import {
  EndPortPrimaryKpis,
  EndPortSecondaryKpis,
  EndRotationKpis,
  EndSeaPrimaryKpis,
  EndSeaSecondaryKpis,
} from "../../rotationKpis/domain/interfaces";
import {
  AtPortKpiTitles,
  AtSeaKpiTitles,
  getAtPortConsumptionDisplayValues,
  getAtSeaConsumptionDisplayValues,
  getCargoOnboardyDisplayValues,
  getCo2EmissionsDisplayValue,
  getContainerMovesDisplayValues,
  getDistanceDisplayValues,
  getEngineLoadDisplayValues,
  getGrossBerthProductivityDisplayValues,
  getGrossCraneIntensityDisplayValues,
  getGrossCraneProductivityDisplayValues,
  getIdleTimeDisplayValues,
  getPortStayDisplayValues,
  getRestowMovesDisplayValues,
  getRpmDisplayValues,
  getSecaDistanceDisplayValues,
  getServiceCiiDisplayValues,
  getSlipDisplayValues,
  getSpeedDisplayValues,
  getTimeLostDisplayValues,
  getWaitingTimeDisplayValues,
} from "../../rotationKpis/utils/kpi";

export function createEndKpiDownloadContent(
  endRotationKpis: EndRotationKpis,
  rotationNumber: string,
): Record<string, string>[] {
  const csvData: Record<string, string>[] = [];

  const allTitles = {
    ...AtSeaKpiTitles,
    ...AtPortKpiTitles,
  };

  const addBaseCardValues = (
    kpis:
      | EndSeaPrimaryKpis
      | EndSeaSecondaryKpis
      | EndPortPrimaryKpis
      | EndPortSecondaryKpis,
    title: string,
  ) => {
    for (const [key, value] of Object.entries(kpis)) {
      if (key === "cargoOnboard") {
        const kpiStringValue = `Laden/Dry: ${value.ladenDry.kpiValue}\nLaden/Reefer: ${value.ladenReefer.kpiValue}\nEmpty/Dry: ${value.emptyDry.kpiValue}`;
        const kpiComparisonValue = `Laden/Dry: ${value.ladenDry.variation.toFixed(0)}\nLaden/Reefer: ${value.ladenReefer.variation.toFixed(0)}\nEmpty/Dry: ${value.emptyDry.variation.toFixed(0)}\n`;
        csvData.push({
          [`${rotationNumber}`]: title,
          KPI: allTitles[key as keyof typeof allTitles],
          ["KPI Score"]: kpiStringValue,
          ["Comparison Score"]: kpiComparisonValue,
        });
      } else {
        csvData.push({
          [`${rotationNumber}`]: title,
          KPI: allTitles[key as keyof typeof allTitles],
          ["KPI Score"]: value.kpiValue,
          ["Comparison Score"]: value.comparison ?? "",
          Proforma: value.proforma ?? "",
          Actual: value.actual ?? "",
          ["Delta - Absolute"]: value.delta ?? "",
          ["Delta - Percentage"]: value.deltaPercentage ?? "",
        });
      }
    }
  };

  addBaseCardValues(endRotationKpis.seaPrimaryRotationKpis, "Sea Primary KPIs");

  csvData.push({ [`End KPIs for ${rotationNumber}`]: "" });

  addBaseCardValues(
    endRotationKpis.seaSecondaryRotationKpis,
    "Sea Secondary KPIs",
  );
  csvData.push({ [`End KPIs for ${rotationNumber}`]: "" });

  addBaseCardValues(
    endRotationKpis.portPrimaryRotationKpis,
    "Port Primary KPIs",
  );
  csvData.push({ [`End KPIs for ${rotationNumber}`]: "" });

  addBaseCardValues(
    endRotationKpis.portSecondaryRotationKpis,
    "Port Secondary KPIs",
  );

  return csvData;
}
export function createAtPortKpiDownloadContent(
  atPortData: AtPortKpIsType,
  date: Date,
) {
  const processedData: Record<string, BaseKpiDisplayValues> = {
    waitingTime: getWaitingTimeDisplayValues(atPortData.waitingTime),
    portStay: getPortStayDisplayValues(atPortData.portStay),
    grossBerthProductivity: getGrossBerthProductivityDisplayValues(
      atPortData.grossBerthProductivity,
    ),
    containerMoves: getContainerMovesDisplayValues(atPortData.containerMoves),
    restowMoves: getRestowMovesDisplayValues(atPortData.restowMoves),
    consumption: getAtPortConsumptionDisplayValues(atPortData.consumption),
    grossCraneProductivity: getGrossCraneProductivityDisplayValues(
      atPortData.grossCraneProductivity,
    ),
    grossCraneIntensity: getGrossCraneIntensityDisplayValues(
      atPortData.grossCraneIntensity,
    ),
    idleTime: getIdleTimeDisplayValues(atPortData.idleTime),
    timeLost: getTimeLostDisplayValues(atPortData.timeLost),
  };

  return Object.keys(processedData).map(key => ({
    [`At Port KPIs ${DateTime.fromJSDate(date).toFormat("dd-LL-yyyy HH:mm")}`]:
      AtPortKpiTitles[key as keyof typeof AtPortKpiTitles],

    "KPI Score": processedData[key].kpiValue || "",

    "Comparison Score": processedData[key].comparison || "",

    Proforma: processedData[key].proforma || "",

    Actual: processedData[key].actual || "",

    "Delta - Absolute": processedData[key].delta || "",

    "Delta - Percentage": processedData[key].deltaPercentage || "",
  }));
}

export function createAtSeaKpiDownloadContent(
  atSeaData: AtSeaKpIsType,
  date: Date,
) {
  const processedData: Record<string, BaseKpiDisplayValues> = {
    speed: getSpeedDisplayValues(atSeaData.speed),
    distance: getDistanceDisplayValues(atSeaData.distance),
    cargoOnboard: getCargoOnboardyDisplayValues(atSeaData.cargoOnboard),
    consumption: getAtSeaConsumptionDisplayValues(atSeaData.consumption),
    co2Emissions: getCo2EmissionsDisplayValue(atSeaData.co2Emissions),
    rpm: getRpmDisplayValues(atSeaData.rpm),
    secaDistance: getSecaDistanceDisplayValues(atSeaData.secaDistance),
    engineLoad: getEngineLoadDisplayValues(atSeaData.engineLoad),
    slip: getSlipDisplayValues(atSeaData.slip),
    serviceCii: getServiceCiiDisplayValues(atSeaData.serviceCii),
  };

  return Object.keys(processedData).map(key => ({
    [`At Sea KPIs ${DateTime.fromJSDate(date).toFormat("dd-LL-yyyy HH:mm")}`]:
      AtSeaKpiTitles[key as keyof typeof AtSeaKpiTitles],
    "KPI Score": processedData[key].kpiValue || "",
    "Comparison Score": processedData[key].comparison || "",
    Proforma: processedData[key].proforma || "",
    Actual: processedData[key].actual || "",
    "Delta - Absolute": processedData[key].delta || "",
    "Delta - Percentage": processedData[key].deltaPercentage || "",
  }));
}
