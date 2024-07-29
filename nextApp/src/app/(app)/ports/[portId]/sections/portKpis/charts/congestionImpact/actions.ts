"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";
import moment from "moment";

import { getClient } from "@/lib/apiClient";

import { CongestionImpact } from "./interfaces";

export async function getCongestionImpactOverlay(
  portId: string,
): Promise<CongestionImpact> {
  if (!portId) {
    throw new Error("Port ID is required");
  }

  const gqlClient = getClient();
  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      query ($portId: String!) {
        portById(portId: $portId) {
          portCode
          kpis {
            headerKpis {
              portCongestionImpact {
                kpiValue
              }
              hourlyPortCongestion {
                timestamp
                numShips
                portCongestion
                calculationType
              }
            }
          }
        }
      }
    `,
    variables: {
      portId,
    },
  });

  const items =
    serverResponse?.data?.portById?.kpis?.headerKpis?.hourlyPortCongestion ??
    [];

  const congestionImpact: CongestionImpact = [];

  items.forEach(item => {
    const timeStamp = moment(item.timestamp);
    if (!timeStamp.isValid()) {
      return;
    }
    const congestionState = {
      time: timeStamp.toDate(),
      percentageUsed: item.portCongestion,
      numberOfShips: item.numShips,
    };
    congestionImpact.push(congestionState);
  });

  return congestionImpact;
}
