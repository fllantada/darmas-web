"use server";

import { Query } from "@/generated/graphql";
import { getCalculationType } from "@/globalDomain/calculationTypes";
import { gql } from "@apollo/client";

import { getClient } from "@/lib/apiClient";

import { PortEvents, PortSnapshot, ValidPortEvent } from "./interfaces";

export const getPortActivities = async (
  portId: string,
): Promise<PortSnapshot | undefined> => {
  const gqlClient = getClient();
  const query = await gqlClient.query<Query>({
    query: gql`
      query PortActivities($portId: String!) {
        portById(portId: $portId) {
          vesselActivities {
            portEvents {
              berth
              operator
              status
              terminal
              vesselName
              vesselType
              waitTimeHours
              arrivalTime
              arrivalTimeCalType
              berthTime
              berthTimeCalType
              departureTime
              departureTimeCalType
            }
            arriving
            atPort
            berthed
            waiting
          }
        }
      }
    `,
    variables: {
      portId,
    },
  });
  const serverResponse = query?.data?.portById?.vesselActivities;
  if (!serverResponse) return undefined;

  const portEvents: PortEvents[] | undefined = serverResponse?.portEvents?.map(
    event =>
      ({
        vessel: {
          name: event.vesselName,
          type: event.vesselType,
        },
        event: event.status as ValidPortEvent,
        arrivalTime: new Date(event.arrivalTime),
        arrivalTimeCalType: getCalculationType(
          event.arrivalTimeCalType ?? undefined,
        ),
        berthTime: event.berthTime ? new Date(event.berthTime) : null,
        berthTimeCalType: getCalculationType(
          event.berthTimeCalType ?? undefined,
        ),
        departureTime: event.departureTime
          ? new Date(event.departureTime)
          : null,
        departureTimeCalType: getCalculationType(
          event.departureTimeCalType ?? undefined,
        ),
        berthName: event.berth,
        operator: event.operator,
        waitTime: event.waitTimeHours,
        terminal: event.terminal,
      }) as PortEvents,
  );

  return {
    summary: {
      totalAtPort: serverResponse.atPort,
      waitingVessels: serverResponse.waiting,
      atBerthVessels: serverResponse.berthed,
      arrivingVessels: serverResponse.arriving,
    },
    portEvents: portEvents ?? [],
  };
};
