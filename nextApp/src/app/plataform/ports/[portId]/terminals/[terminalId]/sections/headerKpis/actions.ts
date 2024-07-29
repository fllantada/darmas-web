"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/app/plataform/lib/apiClient";
import { isNullOrUndefined } from "@/app/plataform/lib/utils";

import { defaultTermnalHeaderKpis } from "./domain/defaultValues";
import { TerminalHeaderKpis, VesselTurnAround } from "./domain/interfaces";

export async function getTerminalHeaderKpis(
  terminalId: string,
): Promise<TerminalHeaderKpis | undefined> {
  if (!terminalId) throw new Error("Port ID is required");

  const gqlClient = getClient();

  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      fragment BasicKpiFields on BaseKPIType {
        kpiValue
        actual
        proforma
        comparison
        delta
        deltaPercentage
      }
      query ($terminalId: String!) {
        terminalById(terminalId: $terminalId) {
          kpis {
            headerKpis {
              vesselTurnaround {
                ...BasicKpiFields
              }
              berthOnArrival {
                ...BasicKpiFields
              }
              terminalEmission {
                ...BasicKpiFields
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

  if (isNullOrUndefined(serverResponse?.data)) return defaultTermnalHeaderKpis;

  const serverVesselTurnAround =
    serverResponse?.data?.terminalById?.kpis?.headerKpis.vesselTurnaround;
  const serverBerthOnArrival =
    serverResponse?.data?.terminalById?.kpis?.headerKpis.berthOnArrival;
  const serverTerminalEmission =
    serverResponse?.data?.terminalById?.kpis?.headerKpis.terminalEmission;

  const vesselTurnaround: VesselTurnAround = {
    ...defaultTermnalHeaderKpis.vesselTurnaround,
    actual: serverVesselTurnAround?.actual ?? undefined,
    comparison: serverVesselTurnAround?.comparison ?? undefined,
    delta: serverVesselTurnAround?.delta ?? undefined,
    deltaPercentage: serverVesselTurnAround?.deltaPercentage ?? undefined,
    kpiValue: serverVesselTurnAround?.kpiValue ?? undefined,
    proforma: serverVesselTurnAround?.proforma ?? undefined,
  };
  const berthOnArrival = {
    ...defaultTermnalHeaderKpis.berthOnArrival,
    actual: serverBerthOnArrival?.actual ?? undefined,
    comparison: serverBerthOnArrival?.comparison ?? undefined,
    delta: serverBerthOnArrival?.delta ?? undefined,
    deltaPercentage: serverBerthOnArrival?.deltaPercentage ?? undefined,
    kpiValue: serverBerthOnArrival?.kpiValue ?? undefined,
    proforma: serverBerthOnArrival?.proforma ?? undefined,
  };

  const portEmission = {
    ...defaultTermnalHeaderKpis.portEmission,
    actual: serverTerminalEmission?.actual ?? undefined,
    comparison: serverTerminalEmission?.comparison ?? undefined,
    delta: serverTerminalEmission?.delta ?? undefined,
    deltaPercentage: serverTerminalEmission?.deltaPercentage ?? undefined,
    kpiValue: serverTerminalEmission?.kpiValue ?? undefined,
    proforma: serverTerminalEmission?.proforma ?? undefined,
  };

  const headerKpis = {
    ...defaultTermnalHeaderKpis,
    vesselTurnaround,
    berthOnArrival,
    portEmission,
  };

  return headerKpis;
}
