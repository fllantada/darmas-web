"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/lib/apiClient";

import { vesselArrivingTerminalAdapter } from "./adapter";
import { TVesselArrivingTerminal } from "./domain/interfaces";

export async function getVesselArrivingTerminal(
  terminalId: string,
): Promise<TVesselArrivingTerminal[]> {
  const gqlClient = getClient();

  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      query ($terminalId: String!) {
        terminalById(terminalId: $terminalId) {
          terminalCode
          terminalLoa
          terminalLineup {
            terminalCode
            vesselName
            vesselType
            vesselLoa
            rotation
            service
            carrier
            arrivalTime
            berthTime
            departureTime
            proArrivalTime
            proDepartureTime
            berthStayHours
            berthDelayHours
            berthTimeCalType
            departureTimeCalType
          }
        }
      }
    `,
    variables: {
      terminalId: terminalId,
    },
  });
  const serverArrivngVessels = serverResponse?.data?.terminalById;

  if (!serverArrivngVessels) return [];

  const vesselsArriving: TVesselArrivingTerminal[] =
    vesselArrivingTerminalAdapter(serverArrivngVessels);

  return vesselsArriving;
}
