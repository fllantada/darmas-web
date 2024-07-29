"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";

import { getClient } from "@/lib/apiClient";
import type { DateRange } from "@/lib/types";

import { VesselSchedulePerformance, VesselType } from "./interfaces";

export async function getPortsSchedulePerformance(
  serviceCode: string,
  timeRange: DateRange,
): Promise<VesselSchedulePerformance[]> {
  const gqlClient = getClient();

  const queryResult = await gqlClient.query<Query>({
    query: gql`
      query Service(
        $serviceCode: String!
        $fromTs: DateTime!
        $toTs: DateTime!
      ) {
        serviceByCode(serviceCode: $serviceCode) {
          kpis {
            activeRotationsSchedulePerformance(fromTs: $fromTs, toTs: $toTs) {
              voyageNo
              vesselCode
              vesselType
              onTimeActualPortCalls
              onTimeForecastPortCalls
              offTimeActualPortCalls
              offTimeForecastPortCalls
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
  });

  const serverData =
    queryResult?.data?.serviceByCode?.kpis.activeRotationsSchedulePerformance;

  if (!serverData) {
    return [];
  }

  const mappedData: VesselSchedulePerformance[] = serverData.map(item => {
    return {
      voyageNo: item.voyageNo,
      vesselCode: item.vesselCode,
      vesselType:
        item.vesselType === "Partner"
          ? VesselType.PARTNER
          : VesselType.OPERATED,
      onTimeActualPortCalls: item.onTimeActualPortCalls,
      onTimeForecastPortCalls: item.onTimeForecastPortCalls,
      offTimeActualPortCalls: item.offTimeActualPortCalls,
      offTimeForecastPortCalls: item.offTimeForecastPortCalls,
    };
  });

  return mappedData;
}
