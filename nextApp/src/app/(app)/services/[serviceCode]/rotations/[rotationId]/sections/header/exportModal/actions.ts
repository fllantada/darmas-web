"use server";

import { AtPortKpIsType, AtSeaKpIsType, Query } from "@/generated/graphql";
import { HeaderKpiTitles } from "@/text/services";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";

import { getClient } from "@/lib/apiClient";
import type { BaseKpiDisplayValues } from "@/lib/types";

import { getTimeDepedentKpis } from "../../rotationKpis/actions";
import {
  AtPortKpiTitles,
  AtSeaKpiTitles,
  getAtPortConsumptionDisplayValues,
  getAtSeaConsumptionDisplayValues,
  getCargoOnboardyDisplayValues,
  getCo2EmissionsDisplayValue,
  getCommercialReliabilityDisplayValues,
  getContainerMovesDisplayValues,
  getDistanceDisplayValues,
  getEngineLoadDisplayValues,
  getGrossBerthProductivityDisplayValues,
  getGrossCraneIntensityDisplayValues,
  getGrossCraneProductivityDisplayValues,
  getIdleTimeDisplayValues,
  getOperationalEfficiencyDisplayValues,
  getPortStayDisplayValues,
  getRestowMovesDisplayValues,
  getRotationEmissionsDisplayValues,
  getRpmDisplayValues,
  getSchedulePerformanceDisplayValues,
  getSecaDistanceDisplayValues,
  getServiceCiiDisplayValues,
  getSlipDisplayValues,
  getSpeedDisplayValues,
  getTimeLostDisplayValues,
  getWaitingTimeDisplayValues,
  OperationalEfficiencyKpiDisplayValues,
} from "../../rotationKpis/utils/kpi";

type StaticDetailsCsv = {
  "Voyage Code": string;
  "Vessel Name": string;
  "Proforma ID": string;
  Capacity: string;
  Operator: string;
};

export async function getStaticDetails(
  vesselCode: string,
  voyageNumber: string,
): Promise<StaticDetailsCsv> {
  const gqlClient = getClient();

  const { rotation, vessel } = await gqlClient
    .query<Query>({
      query: gql`
        query Rotation($vesselCode: String!, $voyageNumber: String!) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNumber
            vesselCode: $vesselCode
          ) {
            voyageNo
            vesselCode
            proformaAvailability
          }
          vesselByCode(vesselCode: $vesselCode) {
            operator
            vesselName
            capacity
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNumber,
      },
    })
    .then(res => ({
      rotation: res.data.rotationByVoyageNoAndVesselCode,
      vessel: res.data.vesselByCode,
    }));

  return {
    "Voyage Code": rotation ? rotation.vesselCode + rotation.voyageNo : "",
    "Vessel Name": vessel?.vesselName || "",
    Operator: vessel?.operator || "",
    Capacity: vessel?.capacity?.toString() || "",
    "Proforma ID": rotation?.proformaAvailability || "",
  };
}

type KpiHeaderCsv = {
  "Header KPI": string;
  "KPI Score": string;
  "Comparison Score": string;
  Proforma: string;
  Actual: string;
  "Delta - Absolute": string;
  "Delta - Percentage": string;
};

export async function getHeaderKpis(
  vesselCode: string,
  voyageNumber: string,
): Promise<KpiHeaderCsv[]> {
  const gqlClient = getClient();

  const processedData: Record<
    string,
    BaseKpiDisplayValues | OperationalEfficiencyKpiDisplayValues
  > = await gqlClient
    .query<Query>({
      query: gql`
        fragment BasicKpiFields on BaseKPIType {
          kpiValue
          actual
          proforma
          comparison
          delta
          deltaPercentage
        }

        query Rotation($vesselCode: String!, $voyageNumber: String!) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNumber
            vesselCode: $vesselCode
          ) {
            kpis {
              headerKpis {
                schedulePerformanceBase {
                  ...BasicKpiFields
                }
                commercialReliabilityBase {
                  ...BasicKpiFields
                }
                operationalEfficiencyBase {
                  kpiValue
                  comparison
                  bunkerDeltaPercentage
                  portCallsDeltaPercentage
                  voyageDaysDeltaPercentage
                }
                emissionsBase {
                  kpiValue
                  actual
                  proforma
                  comparison
                  delta
                  deltaPercentage
                }
              }
            }
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNumber,
      },
    })
    .then(res => ({
      schedulePerformance: getSchedulePerformanceDisplayValues(
        res.data.rotationByVoyageNoAndVesselCode?.kpis.headerKpis
          .schedulePerformanceBase,
      ),
      commercialReliability: getCommercialReliabilityDisplayValues(
        res.data.rotationByVoyageNoAndVesselCode?.kpis.headerKpis
          .commercialReliabilityBase,
      ),
      operationalEfficiency: getOperationalEfficiencyDisplayValues(
        res.data.rotationByVoyageNoAndVesselCode?.kpis.headerKpis
          .operationalEfficiencyBase,
      ),
      emissions: getRotationEmissionsDisplayValues(
        res.data.rotationByVoyageNoAndVesselCode?.kpis.headerKpis.emissionsBase,
      ),
    }));

  return Object.keys(processedData).map(key => ({
    "Header KPI": HeaderKpiTitles[key as keyof typeof HeaderKpiTitles],
    "KPI Score": processedData[key].kpiValue || "",
    "Comparison Score": processedData[key].comparison || "",
    Proforma: processedData[key].proforma || "",
    Actual: processedData[key].actual || "",
    "Delta - Absolute": processedData[key].delta || "",
    "Delta - Percentage": processedData[key].deltaPercentage || "",
  }));
}

export async function getKpiCards(
  vesselCode: string,
  voyageNumber: string,
  atTime: Date,
): Promise<KpiHeaderCsv[]> {
  const data = await getTimeDepedentKpis(voyageNumber, vesselCode, atTime);

  if (data) {
    if (data.kpisLocation === "At Sea") {
      const atSeaData = data as AtSeaKpIsType;

      const processedData: Record<string, BaseKpiDisplayValues> = {
        speed: getSpeedDisplayValues(atSeaData.speed),
        cargoOnboard: getCargoOnboardyDisplayValues(atSeaData.cargoOnboard),
        distance: getDistanceDisplayValues(atSeaData.distance),
        consumption: getAtSeaConsumptionDisplayValues(atSeaData.consumption),
        co2Emissions: getCo2EmissionsDisplayValue(atSeaData.co2Emissions),
        rpm: getRpmDisplayValues(atSeaData.rpm),
        secaDistance: getSecaDistanceDisplayValues(atSeaData.secaDistance),
        engineLoad: getEngineLoadDisplayValues(atSeaData.engineLoad),
        slip: getSlipDisplayValues(atSeaData.slip),
        serviceCii: getServiceCiiDisplayValues(atSeaData.serviceCii),
      };

      return Object.keys(processedData).map(key => ({
        "Header KPI": AtSeaKpiTitles[key as keyof typeof AtSeaKpiTitles],
        "KPI Score": processedData[key].kpiValue || "",
        "Comparison Score": processedData[key].comparison || "",
        Proforma: processedData[key].proforma || "",
        Actual: processedData[key].actual || "",
        "Delta - Absolute": processedData[key].delta || "",
        "Delta - Percentage": processedData[key].deltaPercentage || "",
      }));
    } else {
      const atPortData = data as AtPortKpIsType;

      const processedData: Record<string, BaseKpiDisplayValues> = {
        waitingTime: getWaitingTimeDisplayValues(atPortData.waitingTime),
        portStay: getPortStayDisplayValues(atPortData.portStay),
        grossBerthProductivity: getGrossBerthProductivityDisplayValues(
          atPortData.grossBerthProductivity,
        ),
        containerMoves: getContainerMovesDisplayValues(
          atPortData.containerMoves,
        ),
        restowMoves: getRestowMovesDisplayValues(atPortData.restowMoves),
        consumption: getAtPortConsumptionDisplayValues(data.consumption),
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
        "Header KPI": AtPortKpiTitles[key as keyof typeof AtPortKpiTitles],
        "KPI Score": processedData[key].kpiValue || "",
        "Comparison Score": processedData[key].comparison || "",
        Proforma: processedData[key].proforma || "",
        Actual: processedData[key].actual || "",
        "Delta - Absolute": processedData[key].delta || "",
        "Delta - Percentage": processedData[key].deltaPercentage || "",
      }));
    }
  }
  return [
    {
      "Header KPI": "",
      "KPI Score": "",
      "Comparison Score": "",
      Proforma: "",
      Actual: "",
      "Delta - Absolute": "",
      "Delta - Percentage": "",
    },
  ];
}

type ScheduleCsv = {
  "Voyage Code": string;
  Operator: string;
  Port: string;
  Block: string;
  State: string;
  "Proforma Timestamp": string;
  "Actual Timestamp": string;
};

export async function getSchedule(
  vesselCode: string,
  voyageNumber: string,
): Promise<ScheduleCsv[]> {
  const gqlClient = getClient();

  const { vesselStates, vesselOperator } = await gqlClient
    .query<Query>({
      query: gql`
        query ($vesselCode: String!, $voyageNumber: String!) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNumber
            vesselCode: $vesselCode
          ) {
            vesselStates {
              atPort
              arrivalPort
              statusTs
              status
              proformaTs
              subStatus
            }
          }

          vesselByCode(vesselCode: $vesselCode) {
            operator
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNumber,
      },
    })
    .then(res => ({
      vesselStates: res.data.rotationByVoyageNoAndVesselCode?.vesselStates.map(
        vesselState => ({
          ...vesselState,
          proformaTs: vesselState.proformaTs
            ? DateTime.fromISO(vesselState.proformaTs)
            : null,
          statusTs: vesselState.statusTs
            ? DateTime.fromISO(vesselState.statusTs)
            : null,
        }),
      ),
      vesselOperator: res.data.vesselByCode?.operator,
    }));

  vesselStates?.sort(
    (a, b) => (a.statusTs?.toMillis() || 0) - (b.statusTs?.toMillis() || 0),
  );

  return vesselStates && vesselStates.length > 0
    ? (vesselStates.map(vesselState => ({
        "Voyage Code": vesselCode + voyageNumber,
        Operator: vesselOperator || "NA",
        Port: vesselState.atPort,
        Block: vesselState.status,
        State: vesselState.subStatus,
        "Proforma Timestamp":
          vesselState.proformaTs?.toFormat("dd/LL/yyyy HH:mm") || "NA",
        "Actual Timestamp":
          vesselState.statusTs?.toFormat("dd/LL/yyyy HH:mm") || "NA",
      })) as ScheduleCsv[])
    : [
        {
          "Voyage Code": "",
          Operator: "",
          Port: "",
          Block: "",
          State: "",
          "Proforma Timestamp": "",
          "Actual Timestamp": "",
        },
      ];
}
