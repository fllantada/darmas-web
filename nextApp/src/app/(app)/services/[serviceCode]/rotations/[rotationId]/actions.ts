"use server";

import { Query, VoyageType } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";

import { getClient } from "@/lib/apiClient";
import { handleVesselStatePortId, sortPorts } from "@/lib/utils";

export async function getPageEssentials(
  rotationId: string,
  serviceCode: string,
) {
  const gqlClient = getClient();

  const [vesselCode, voyageNo] = rotationId.split("-");

  const pageEssencials = await gqlClient
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

        query Rotation(
          $voyageNo: String!
          $vesselCode: String!
          $serviceCode: String!
          $atTime: DateTime!
        ) {
          serviceByCode(serviceCode: $serviceCode) {
            serviceName
            serviceCode
            vessels {
              voyages(serviceCode: $serviceCode) {
                vesselCode
                voyageNo
                startDate
                endDate
              }
            }
          }
          vesselByCode(vesselCode: $vesselCode) {
            vesselCode
            vesselName
            operator
            capacity
            latestPosition {
              course
              latitude
              longitude
            }
            positionalState(atTime: $atTime) {
              statusTs
              status
              subStatus
              vesselCode
              voyageNumber
              departurePort
              arrivalPort
              estimatedDepartureTime
              estimatedArrivalTime
              atPort
              direction
              relativePositionValueTime
              relativePositionValue
            }
          }
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNo
            vesselCode: $vesselCode
          ) {
            voyageNo
            vesselCode
            proformaAvailability
            startDate
            endDate
            kpis {
              headerKpis {
                schedulePerformanceBase {
                  ...BasicKpiFields
                }
                commercialReliabilityBase {
                  ...BasicKpiFields
                }
                operationalEfficiencyBase {
                  kpiValue
                  comparison
                  bunkerDeltaPercentage
                  portCallsDeltaPercentage
                  voyageDaysDeltaPercentage
                }
                emissionsBase {
                  kpiValue
                  actual
                  proforma
                  comparison
                  delta
                  deltaPercentage
                }
              }
            }
            portCalls {
              portCode
              sequence
              direction
              changeStatus
              etaDate
              etbDate
              etdDate
              proEtaDate
              proEtbDate
              proEtdDate
            }
            vesselStates {
              status
              statusTs
              proformaTs
              subStatus
              departurePort
              arrivalPort
              estimatedDepartureTime
              atPort
              estimatedArrivalTime
            }
            voyageBlocks {
              vesselCode
              voyageNumber
              sequence
              atPort
              departurePort
              arrivalPort
              block
              startTime
              endTime
              proStartTime
              proEndTime
            }
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNo,
        serviceCode,
        atTime: DateTime.now().toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss"),
      },
    })
    .then(res => {
      // Tech debt: This should be done in the backend
      let vessel = res.data.vesselByCode;
      const thisRotation = res.data.rotationByVoyageNoAndVesselCode;

      if (vessel?.positionalState) {
        const ports = {
          atPort: vessel.positionalState.atPort,
          departurePort: vessel.positionalState.departurePort,
          arrivalPort: vessel.positionalState.arrivalPort,
        };

        if (vessel.positionalState?.atPort) {
          ports.atPort = handleVesselStatePortId(vessel.positionalState.atPort);
        }

        if (vessel.positionalState?.arrivalPort) {
          ports.arrivalPort = handleVesselStatePortId(
            vessel.positionalState.arrivalPort,
          );
        }

        if (vessel.positionalState?.departurePort) {
          ports.departurePort = handleVesselStatePortId(
            vessel.positionalState.departurePort,
          );
        }

        vessel = {
          ...vessel,
          positionalState: { ...vessel.positionalState, ...ports },
        };
      }

      // End Tech debt

      return {
        headerKpis: res.data.rotationByVoyageNoAndVesselCode?.kpis?.headerKpis,
        service: res.data.serviceByCode,
        selectedVesselVoyage: thisRotation, // rotationWithoutEndState,
        vessel,
      };
    });
  return pageEssencials;
}

export async function getSurroundingVoyages(
  allRotationsList: { name: string; id: string }[],
  rotationId: string,
): Promise<{
  prevVesselVoyage: VoyageType | undefined;
  nextVesselVoyage: VoyageType | undefined;
}> {
  const selectedVoyageIndex = allRotationsList.findIndex(
    allRotationElement => allRotationElement.name === rotationId,
  );

  const prevVoyageRotationIndex = allRotationsList[selectedVoyageIndex - 1];
  const nextVoyageRotationIndex = allRotationsList[selectedVoyageIndex + 1];

  const [prevVoyage, nextVoyage] = await Promise.all([
    getVoyageByRotationId(prevVoyageRotationIndex?.id),
    getVoyageByRotationId(nextVoyageRotationIndex?.id),
  ]);

  return {
    prevVesselVoyage: prevVoyage,
    nextVesselVoyage: nextVoyage,
  };
}

async function getVoyageByRotationId(
  rotationId: string | undefined,
): Promise<VoyageType | undefined> {
  if (!rotationId) return undefined;
  const gqlClient = getClient();
  const [vesselCode, voyageNo] = rotationId.split("-");
  const response = await gqlClient.query<Query>({
    query: gql`
      query Voyage($voyageNo: String!, $vesselCode: String!) {
        rotationByVoyageNoAndVesselCode(
          voyageNo: $voyageNo
          vesselCode: $vesselCode
        ) {
          voyageNo
          vesselCode
          startDate
          endDate
          vesselStates {
            status
            statusTs
            proformaTs
            subStatus
            departurePort
            arrivalPort
            estimatedDepartureTime
            atPort
            estimatedArrivalTime
          }
          voyageBlocks {
            vesselCode
            voyageNumber
            atPort
            departurePort
            arrivalPort
            block
            startTime
            endTime
            proStartTime
            proEndTime
          }
        }
      }
    `,
    variables: {
      voyageNo,
      vesselCode,
    },
  });
  const voyage = response?.data.rotationByVoyageNoAndVesselCode ?? undefined;

  return voyage;
}

export async function getPortsSchedulePerformance(
  voyageNo: string,
  vesselCode: string,
) {
  const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query RotationByVoyageNoAndVesselCode(
          $voyageNo: String!
          $vesselCode: String!
        ) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNo
            vesselCode: $vesselCode
          ) {
            kpis {
              headerKpis {
                portsSchedulePerformance {
                  port
                  delta
                  sequence
                  direction
                  proformaArrivalTime
                  calculationType
                  changeStatus
                }
              }
            }
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNo,
      },
    })
    .then(res => {
      const data =
        res.data.rotationByVoyageNoAndVesselCode?.kpis?.headerKpis
          ?.portsSchedulePerformance;

      return data ? sortPorts(data) : undefined;
    });
}

export async function getPortsCommercialReliability(
  voyageNo: string,
  vesselCode: string,
) {
  const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query RotationByVoyageNoAndVesselCode(
          $voyageNo: String!
          $vesselCode: String!
        ) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNo
            vesselCode: $vesselCode
          ) {
            kpis {
              headerKpis {
                portsCommercialReliability {
                  actualDays
                  proformaDays
                  delta
                  departurePort
                  arrivalPort
                  calculationType
                  sequenceDeparture
                  sequenceArrival
                  changeStatusArrival
                  changeStatusDeparture
                }
              }
            }
            portCalls {
              portCode
            }
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNo,
      },
    })
    .then(res => ({
      data: res.data.rotationByVoyageNoAndVesselCode?.kpis?.headerKpis
        ?.portsCommercialReliability,
      ports: res.data.rotationByVoyageNoAndVesselCode?.portCalls,
    }));
}

export async function getRotationOperationalEfficiency(
  voyageNo: string,
  vesselCode: string,
) {
  const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query RotationByVoyageNoAndVesselCode(
          $voyageNo: String!
          $vesselCode: String!
        ) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNo
            vesselCode: $vesselCode
          ) {
            kpis {
              headerKpis {
                operationalEfficiencyDetails {
                  vesselCode
                  voyageNumber
                  kpi
                  comparison
                  bunkerConsumption
                  modelConsumption
                  portCallsActual
                  portCallsForecast
                  voyageDaysActual
                  voyageDaysForecast
                  proformaBunkerConsumption
                  proformaPortCalls
                  proformaVoyageDays
                }
              }
            }
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNo,
      },
    })
    .then(
      res =>
        res.data.rotationByVoyageNoAndVesselCode?.kpis?.headerKpis
          ?.operationalEfficiencyDetails,
    );
}

export async function getRotationEmissions(
  voyageNo: string,
  vesselCode: string,
) {
  const gqlClient = getClient();

  return await gqlClient
    .query<Query>({
      query: gql`
        query RotationByVoyageNoAndVesselCode(
          $voyageNo: String!
          $vesselCode: String!
        ) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNo
            vesselCode: $vesselCode
          ) {
            kpis {
              headerKpis {
                emissionsDetails {
                  attainedCii
                  ciiRating
                  modelCii
                  modelCiiRating
                  proformaCii
                  proformaCiiRating
                }
              }
            }
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNo,
      },
    })
    .then(
      res =>
        res.data.rotationByVoyageNoAndVesselCode?.kpis?.headerKpis
          ?.emissionsDetails,
    );
}
