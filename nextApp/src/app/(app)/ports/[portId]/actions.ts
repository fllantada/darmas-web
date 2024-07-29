"use server";

import { PortType, Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/lib/apiClient";

export async function getPortHeaderKpis(portId: string) {
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

        query ($portId: String!) {
          portById(portId: $portId) {
            kpis {
              headerKpis {
                vesselTurnaround {
                  ...BasicKpiFields
                }

                portCongestionImpact {
                  ...BasicKpiFields
                }

                berthOnArrival {
                  ...BasicKpiFields
                }

                portEmission {
                  ...BasicKpiFields
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
    .then(res => res.data.portById?.kpis?.headerKpis);
}

type TPageEssencials = {
  ports: PortType[];
  activePort: PortType | undefined;
  countryCode: string;
};
export const getPageEssentials = async (
  portId: string,
): Promise<TPageEssencials | undefined> => {
  const gqlClient = getClient();
  const response = await gqlClient
    .query<Query>({
      query: gql`
        query ($portId: String!) {
          portList {
            id
            portName
            portCode
          }

          portById(portId: $portId) {
            id
            portName
            portCode
            countryCode
            country
            overview
            website
            timezone
            geometry
            contacts {
              name
              position
              telephone
              mobile
              email
            }
            terminals {
              id
              terminalName
              terminalCode
              center
              berths {
                berthLocation
                berthName
                depth
                depthUnit
                length
                lengthUnit
              }
            }
          }
        }
      `,
      variables: {
        portId,
      },
    })
    .then(res => {
      return {
        ports: res.data.portList as PortType[],
        activePort: res.data.portById as PortType | undefined,
        countryCode: res.data.portById?.countryCode,
      };
    })
    // eslint-disable-next-line no-console
    .catch(error => console.error("Error fetching port data", error));
  if (response)
    return {
      ports: response.ports,
      activePort: response.activePort,
      countryCode: response.countryCode ?? "",
    };
};
