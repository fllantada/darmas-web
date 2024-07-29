"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";

import { getClient } from "@/app/plataform/lib/apiClient";
import type {
  BaseKpiDisplayValues,
  DateRange,
} from "@/app/plataform/lib/types";
import { HeaderKpiTitles } from "@/app/plataform/text/services";

import {
  getCommercialReliabilityDisplayValues,
  getSchedulePerformanceDisplayValues,
  getServiceEmissionsDisplayValues,
} from "../../../../rotations/[rotationId]/sections/rotationKpis/utils/kpi";
import { getTimeDepedentKpis } from "../../../serviceKpis/actions";

type StaticDetailsCsv = {
  "Service Name": string;
  "Voyage Days": string;
  Frequency: string;
};

export async function getStaticDetails(
  serviceCode: string,
): Promise<StaticDetailsCsv[]> {
  const gqlClient = getClient();

  const data = await gqlClient
    .query<Query>({
      query: gql`
        query Service($serviceCode: String!) {
          serviceByCode(serviceCode: $serviceCode) {
            serviceName
            serviceCode
            voyageLengthDays
            vesselCount
          }
        }
      `,
      variables: {
        serviceCode,
      },
    })
    .then(res => res.data.serviceByCode || null);

  if (data) {
    return [
      {
        "Service Name": `[${data.serviceCode}] ${data.serviceName}`,
        "Voyage Days": data.voyageLengthDays?.toFixed(0) || "",
        Frequency:
          data.voyageLengthDays && data.vesselCount
            ? (data.voyageLengthDays / data.vesselCount).toFixed(0)
            : "",
      },
    ];
  }

  return [
    {
      "Service Name": "",
      "Voyage Days": "",
      Frequency: "",
    },
  ];
}

type HeaderKpisCsv = {
  "Header KPI": string;
  "KPI Score": string;
  "Comparison Score": string;
  Proforma: string;
  Actual: string;
  "Delta - Absolute": string;
  "Delta - Percentage": string;
};

export async function getHeaderKpis(
  serviceCode: string,
  timeRange: DateRange,
): Promise<HeaderKpisCsv[]> {
  const processedData: Record<string, BaseKpiDisplayValues> =
    await getTimeDepedentKpis(serviceCode, timeRange).then(data => ({
      schedulePerformance: getSchedulePerformanceDisplayValues(
        data?.schedulePerformance,
      ),
      commercialReliability: getCommercialReliabilityDisplayValues(
        data?.commercialReliability,
      ),
      operationalEfficiency: getSchedulePerformanceDisplayValues(
        data?.operationalEfficiency,
      ),
      emissions: getServiceEmissionsDisplayValues(data?.serviceEmissionsKpi),
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

type ScheduleCsv = {
  Vessel: string;
  Voyage: string;
  Operator: string;
  State: string;
  "Proforma Timestamp": string;
  "Actual Timestamp": string;
};

export async function getSchedule(serviceCode: string): Promise<ScheduleCsv[]> {
  const gqlClient = getClient();

  const vessels = await gqlClient
    .query<Query>({
      query: gql`
        query ($serviceCode: String!) {
          serviceByCode(serviceCode: $serviceCode) {
            vessels {
              operator
              voyages(serviceCode: $serviceCode) {
                voyageNo
                vesselCode
                startDate
                endDate
                proformaEndDate
                proformaStartDate
              }
            }
          }
        }
      `,
      variables: {
        serviceCode,
      },
    })
    .then(res => {
      return res.data.serviceByCode?.vessels || [];
    });

  const tableItems: ScheduleCsv[] = [];

  vessels.forEach(vessel => {
    vessel.voyages.forEach(voyage => {
      const newCommenceItem = {
        Vessel: voyage.vesselCode,
        Voyage: voyage.vesselCode + voyage.voyageNo,
        Operator: vessel.operator || "",
        State: "Voyage Commence",
        "Proforma Timestamp": voyage.proformaStartDate
          ? DateTime.fromISO(voyage.proformaStartDate).toFormat(
              "dd/LL/yyyy HH:mm",
            )
          : "NA",
        "Actual Timestamp": voyage.startDate
          ? DateTime.fromISO(voyage.startDate).toFormat("dd/LL/yyyy HH:mm")
          : "NA",
      };
      const newEndItem = {
        Vessel: voyage.vesselCode,
        Voyage: voyage.vesselCode + voyage.voyageNo,
        Operator: vessel.operator || "",
        State: "Voyage End",
        "Proforma Timestamp": voyage.proformaEndDate
          ? DateTime.fromISO(voyage.proformaEndDate).toFormat(
              "dd/LL/yyyy HH:mm",
            )
          : "NA",
        "Actual Timestamp": voyage.endDate
          ? DateTime.fromISO(voyage.endDate).toFormat("dd/LL/yyyy HH:mm")
          : "NA",
      };
      tableItems.push(newCommenceItem, newEndItem);
    });
  });

  return tableItems;
}
