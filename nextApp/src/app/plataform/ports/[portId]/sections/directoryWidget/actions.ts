"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/app/plataform/lib/apiClient";

import { TDirectoryTree } from "./interfaces";

export async function getDirectoryTree(
  countryCode: string,
  portCode: string,
): Promise<TDirectoryTree | undefined> {
  const gqlClient = getClient();

  const portItems = await gqlClient
    .query<Query>({
      query: gql`
        query ($countryCode: String!) {
          portsByCountryCode(countryCode: $countryCode) {
            portCode
            country
            portName

            terminals {
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
        countryCode: countryCode,
      },
    })
    .then(res => res.data.portsByCountryCode || null);
  let directoryTree: TDirectoryTree | undefined = undefined;

  if (portItems) {
    directoryTree = {
      country: portItems[0].country,
      selectedPort: portCode,
      ports: portItems.map(port => ({
        code: port.portCode,
        title: port.portName,
        terminals: port.terminals?.map(terminal => ({
          code: terminal.terminalCode,
          title: terminal.terminalName,
          berths: terminal.berths?.map(berth => ({
            title: berth.berthName,
          })),
        })),
      })),
    };
  }

  return directoryTree;
}
