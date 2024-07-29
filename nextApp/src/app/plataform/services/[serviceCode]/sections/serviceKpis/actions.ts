"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";

import { getClient } from "@/app/plataform/lib/apiClient";
import type { DateRange } from "@/app/plataform/lib/types";

export async function getTimeDepedentKpis(
  serviceCode: string,
  timeRange: DateRange,
) {
  const gqlClient = getClient();

  return await gqlClient
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

        query Service(
          $serviceCode: String!
          $fromTs: DateTime!
          $toTs: DateTime!
        ) {
          serviceByCode(serviceCode: $serviceCode) {
            kpis {
              schedulePerformance(fromTs: $fromTs, toTs: $toTs) {
                ...BasicKpiFields
              }

              commercialReliability(fromTs: $fromTs, toTs: $toTs) {
                ...BasicKpiFields
              }

              operationalEfficiency(fromTs: $fromTs, toTs: $toTs) {
                ...BasicKpiFields
              }

              serviceEmissionsKpi(fromTs: $fromTs, toTs: $toTs) {
                vesselCode
                attainedCii
                ciiRating
                proformaCii
                modelCii
                modelCiiRating
                proformaCiiRating
              }
            }
          }
        }
      `,
      variables: {
        serviceCode,
        fromTs: DateTime.fromJSDate(timeRange.start)
          .toUTC()
          .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
        toTs: DateTime.fromJSDate(timeRange.end)
          .toUTC()
          .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      },
    })

    .then(res => {
      return res.data.serviceByCode?.kpis;
    });
}

export async function getTimeDependentPortsCommercialReliability(
  serviceCode: string,
  timeRange: DateRange,
) {
  const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query Service(
          $serviceCode: String!
          $fromTs: DateTime!
          $toTs: DateTime!
        ) {
          serviceByCode(serviceCode: $serviceCode) {
            kpis {
              activeRotationsCommercialReliability(
                fromTs: $fromTs
                toTs: $toTs
              ) {
                actualDays
                proformaDays
                delta
                departurePort
                arrivalPort
                calculationType
              }
            }

            activeRotationsUniquePortCalls(fromTs: $fromTs, toTs: $toTs) {
              portCode
            }
          }
        }
      `,
      variables: {
        serviceCode,
        fromTs: DateTime.fromJSDate(timeRange.start)
          .toUTC()
          .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
        toTs: DateTime.fromJSDate(timeRange.end)
          .toUTC()
          .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      },
    })
    .then(res => ({
      ports: res.data.serviceByCode?.activeRotationsUniquePortCalls,
      data: res.data.serviceByCode?.kpis?.activeRotationsCommercialReliability,
    }));
}

export async function getTimeDependentOperationalEfficiency(
  serviceCode: string,
  timeRange: DateRange,
) {
  const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query Service(
          $serviceCode: String!
          $fromTs: DateTime!
          $toTs: DateTime!
        ) {
          serviceByCode(serviceCode: $serviceCode) {
            kpis {
              activeRotationsOperationalEfficiency(
                fromTs: $fromTs
                toTs: $toTs
              ) {
                vesselCode
                voyageNumber
                kpi
                comparison
                bunkerConsumption
                modelConsumption
                portCallsForecast
                portCallsActual
                voyageDaysForecast
                voyageDaysActual
                proformaBunkerConsumption
                proformaPortCalls
                proformaVoyageDays
              }
            }
          }
        }
      `,
      variables: {
        serviceCode,
        fromTs: DateTime.fromJSDate(timeRange.start)
          .toUTC()
          .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
        toTs: DateTime.fromJSDate(timeRange.end)
          .toUTC()
          .toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      },
    })
    .then(
      res => res.data.serviceByCode?.kpis?.activeRotationsOperationalEfficiency,
    );
}
