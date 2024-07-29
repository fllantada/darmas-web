"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/app/plataform/lib/apiClient";

export async function getVesselTurnaroundOverlay(portId: string) {
  const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query ($portId: String!) {
          portById(portId: $portId) {
            kpis {
              headerKpis {
                vesselPortTime {
                  vesselName
                  vesselType
                  calculationType
                  actual
                  proforma
                }
              }
            }
          }
        }
      `,
      variables: {
        portId,
      },
    })
    .then(res => res.data.portById?.kpis?.headerKpis?.vesselPortTime);
}
