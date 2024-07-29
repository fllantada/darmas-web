"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/lib/apiClient";

export type TreeChartData = {
  name: string;
  children?: TreeChartData[];
};

export async function getDirectoryTree(
  portId: string,
  terminalId?: string,
): Promise<TreeChartData | undefined> {
  const gqlClient = getClient();

  const port = await gqlClient
    .query<Query>({
      query: gql`
        query ($portId: String!) {
          portById(portId: $portId) {
            id
            portName
            portCode
            country
            terminals {
              id
              terminalCode
              terminalName
              berths {
                berthName
              }
            }
          }
        }
      `,
      variables: {
        portId,
      },
    })
    .then(res => res.data.portById || null);

  if (port) {
    return {
      name: port.country,
      children: [
        {
          name: `${port.portCode}\n${port.portName}`,
          children:
            port.terminals?.map(terminal => ({
              name: `${terminal.terminalCode}\n${terminal.terminalName}`,
              collapsed: terminalId !== terminal.id,
              children: terminal.berths?.map(berth => ({
                name: `Code: ${berth.berthName}`,
              })),
            })) || [],
        },
      ],
    };
  }
}
