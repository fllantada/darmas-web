"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/app/plataform/lib/apiClient";
import { isNotNullOrUndefined } from "@/app/plataform/lib/utils";

import { serverToDomainArrivingVesselAdapter } from "./adapter";
import { TVesselArrivingPort } from "./domain/interfaces";

export async function getVesselArrivingPort(portId: string) {
  if (!portId) throw new Error("Port ID is required");
  const gqlClient = getClient();

  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      query ($portId: String!) {
        portById(portId: $portId) {
          portLineUp {
            arrivalTime
            departureTime
            proArrivalTime
            proDepartureTime
            service
            vesselName
            vesselType
            voyage
          }
        }
      }
    `,
    variables: {
      portId,
    },
  });

  const serverResponsePortEvents = isNotNullOrUndefined(
    serverResponse?.data?.portById?.portLineUp,
  )
    ? serverResponse?.data?.portById?.portLineUp
    : [];

  const vesselsArriving: TVesselArrivingPort[] =
    serverToDomainArrivingVesselAdapter(serverResponsePortEvents);
  return vesselsArriving;
}
