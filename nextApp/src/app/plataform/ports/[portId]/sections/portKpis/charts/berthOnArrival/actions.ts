"use server";

import { getClient } from "@/app/plataform/lib/apiClient";

export async function getBerthOnArrivalOverlay(portId: string) {
  /* const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query ($portId: String!) {
          portById(portId: $portId) {
            kpis {
              headerKpis {
                vesselBerthWaitTime {
                  target
                  data {
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
        }
      `,
      variables: {
        portId,
      },
    })
    .then(res => ({
      data: res.data.portById?.kpis?.headerKpis?.vesselBerthWaitTime?.data,
      target: res.data.portById?.kpis?.headerKpis?.vesselBerthWaitTime?.target,
    })); */
}
