"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { CalculationType } from "@/app/plataform/globalDomain/calculationTypes";
import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";
import { getClient } from "@/app/plataform/lib/apiClient";
import { isNotNullOrUndefined } from "@/app/plataform/lib/utils";

import {
  BerthOnArrivalTerminalOverlay,
  PortEmissionTerminalOverlay,
  VesselTurnarrondTerminalOverlay,
} from "./interfaces";

export async function getBerthOnArrivalOverlay(
  terminalId: string,
): Promise<BerthOnArrivalTerminalOverlay> {
  if (!terminalId) throw new Error("Terminal ID is required");

  const gqlClient = getClient();
  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      query ($terminalId: String!) {
        terminalById(terminalId: $terminalId) {
          kpis {
            headerKpis {
              vesselBerthWaitTime {
                target
                data {
                  actual
                  calculationType
                  proforma
                  vesselName
                  vesselType
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      terminalId,
    },
  });

  const serverTarget =
    serverResponse.data?.terminalById?.kpis?.headerKpis.vesselBerthWaitTime
      ?.target || 0;

  const serverVessels =
    serverResponse.data?.terminalById?.kpis?.headerKpis.vesselBerthWaitTime
      ?.data || [];

  const BerthOnArrivalOverlayData: BerthOnArrivalTerminalOverlay = {
    target: serverTarget,
    vessels: serverVessels.map(vessel => {
      return {
        actual: isNotNullOrUndefined(vessel.actual) ? vessel.actual : 0,
        calculationType: vessel.calculationType as CalculationType,
        proforma: isNotNullOrUndefined(vessel.proforma) ? vessel.proforma : 0,
        vesselName: vessel.vesselName,
        vesselType: vessel.vesselType?.toLowerCase() as RotationType,
      };
    }),
  };

  return BerthOnArrivalOverlayData;
}

export async function getVesselTurnaroundOverlay(
  terminalId: string,
): Promise<VesselTurnarrondTerminalOverlay[]> {
  if (!terminalId) throw new Error("Terminal ID is required");

  const gqlClient = getClient();
  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      query ($terminalId: String!) {
        terminalById(terminalId: $terminalId) {
          kpis {
            headerKpis {
              vesselTerminalTime {
                actual
                calculationType
                proforma
                vesselName
                vesselType
              }
            }
          }
        }
      }
    `,
    variables: {
      terminalId,
    },
  });

  const serverVessels =
    serverResponse.data?.terminalById?.kpis?.headerKpis.vesselTerminalTime ||
    [];

  const vesselTurnarround: VesselTurnarrondTerminalOverlay[] =
    serverVessels.map(vessel => {
      return {
        actual: isNotNullOrUndefined(vessel.actual) ? vessel.actual : 0,
        calculationType: vessel.calculationType as CalculationType,
        proforma: isNotNullOrUndefined(vessel.proforma) ? vessel.proforma : 0,
        vesselName: vessel.vesselName,
        vesselType: vessel.vesselType?.toLowerCase() as RotationType,
      };
    });

  return vesselTurnarround;
}

export async function getPortEmissionOverlay(
  terminalId: string,
): Promise<PortEmissionTerminalOverlay[]> {
  if (!terminalId) throw new Error("Terminal ID is required");

  const gqlClient = getClient();
  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      query ($terminalId: String!) {
        terminalById(terminalId: $terminalId) {
          kpis {
            headerKpis {
              vesselTerminalEmission {
                actual
                calculationType
                proforma
                vesselName
                vesselType
              }
            }
          }
        }
      }
    `,
    variables: {
      terminalId,
    },
  });

  const serverVessels =
    serverResponse.data?.terminalById?.kpis?.headerKpis
      .vesselTerminalEmission || [];

  const vesselEmissions: PortEmissionTerminalOverlay[] = serverVessels.map(
    vessel => {
      return {
        actual: isNotNullOrUndefined(vessel.actual) ? vessel.actual : 0,
        calculationType: vessel.calculationType as CalculationType,
        proforma: isNotNullOrUndefined(vessel.proforma) ? vessel.proforma : 0,
        vesselName: vessel.vesselName,
        vesselType: vessel.vesselType?.toLowerCase() as RotationType,
      };
    },
  );

  return vesselEmissions;
}
