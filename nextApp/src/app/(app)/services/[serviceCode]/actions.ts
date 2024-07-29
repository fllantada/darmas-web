"use server";

import {
  Query,
  QueryServiceByCodeArgs,
  ServiceType,
} from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/lib/apiClient";

export const getPageTitle = async (
  serviceCode: string,
): Promise<{ title: "string" } | object> => {
  const gqlClient = getClient();

  const { error, data } = await gqlClient.query<Query, QueryServiceByCodeArgs>({
    query: gql`
      query Service($serviceCode: String!) {
        serviceByCode(serviceCode: $serviceCode) {
          serviceName
          serviceCode
        }
      }
    `,
    variables: {
      serviceCode,
    },
  });

  if (!error && data.serviceByCode) {
    return {
      title: `[${data.serviceByCode.serviceCode}] ${data.serviceByCode.serviceName} | Services`,
    };
  }

  return {};
};

export const getServicesList = async (): Promise<ServiceType[]> => {
  const gqlClient = getClient();
  const { error, data } = await gqlClient.query<Query>({
    query: gql`
      query {
        dynamicServiceList {
          serviceName
          serviceCode
        }
      }
    `,
  });
  if (!error && data.dynamicServiceList) {
    return data.dynamicServiceList;
  }
  return [];
};

export const getServiceByCode = async (
  serviceCode: string,
): Promise<ServiceType | undefined> => {
  const gqlClient = getClient();

  const { error, data } = await gqlClient.query<Query, QueryServiceByCodeArgs>({
    query: gql`
      query ($serviceCode: String!) {
        serviceByCode(serviceCode: $serviceCode) {
          serviceName
          serviceCode
          vesselCount
          voyageLengthDays
          vessels {
            vesselCode
            vesselName
            operator
            latestPosition {
              course
              latitude
              longitude
            }
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
  });
  if (!error && data.serviceByCode) {
    const queryResponse = {
      ...data.serviceByCode,
      vessels: data.serviceByCode.vessels.map(vessel => ({
        ...vessel,
        voyages: vessel.voyages.filter(
          voyage => voyage.startDate && voyage.endDate,
        ),
      })),
    };

    return queryResponse;
  }

  return;
};
