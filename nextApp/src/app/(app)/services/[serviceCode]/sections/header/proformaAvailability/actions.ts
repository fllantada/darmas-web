"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";
import moment from "moment";

import { getClient } from "@/lib/apiClient";

import { proformaAvailabilityAdapter } from "./adapter";
import { ProformaAvailability } from "./interfaces";

export async function getProformaAvailability(
  serviceCode: string,
): Promise<ProformaAvailability> {
  if (!serviceCode) {
    throw new Error("serviceCode is required");
  }
  const gqlClient = getClient();

  const startDate = moment()
    .startOf("month")
    .subtract(11, "month")
    .subtract(1, "day")
    .toISOString();
  const endDate = moment()
    .endOf("month")
    .add(6, "month")
    .add(1, "day")
    .toISOString();

  const data = await gqlClient.query<Query>({
    query: gql`
      query Service(
        $serviceCode: String!
        $startDate: String!
        $endDate: String!
      ) {
        serviceByCode(serviceCode: $serviceCode) {
          proformaAvailabilityReport(startDate: $startDate, endDate: $endDate) {
            proformaAvailabilityPercent
            proformaAvailability {
              proforma
              scrubber
              vesselClass
              vesselName
              voyageCode
            }
          }
        }
      }
    `,
    variables: {
      serviceCode,
      startDate,
      endDate,
    },
  });

  const serverData = data.data.serviceByCode?.proformaAvailabilityReport;

  const proformaAvailability = proformaAvailabilityAdapter(serverData);

  return proformaAvailability;
}
