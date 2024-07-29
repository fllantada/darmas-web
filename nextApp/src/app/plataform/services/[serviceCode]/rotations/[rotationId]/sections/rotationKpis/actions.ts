"use server";

import { AtPortKpIsType, AtSeaKpIsType, Query } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";

import { getClient } from "@/app/plataform/lib/apiClient";

import {
  EndPortPrimaryKpis,
  EndPortSecondaryKpis,
  EndRotationKpis,
  EndSeaPrimaryKpis,
  EndSeaSecondaryKpis,
} from "./domain/interfaces";
import {
  getAtPortConsumptionDisplayValues,
  getAtSeaConsumptionDisplayValues,
  getCo2EmissionsDisplayValue,
  getContainerMovesDisplayValues,
  getDistanceDisplayValues,
  getEngineLoadDisplayValues,
  getGrossBerthProductivityDisplayValues,
  getGrossCraneIntensityDisplayValues,
  getGrossCraneProductivityDisplayValues,
  getIdleTimeDisplayValues,
  getPortStayDisplayValues,
  getRestowMovesDisplayValues,
  getRpmDisplayValues,
  getSecaDistanceDisplayValues,
  getServiceCiiDisplayValues,
  getSlipDisplayValues,
  getSpeedDisplayValues,
  getTimeLostDisplayValues,
  getWaitingTimeDisplayValues,
} from "./utils/kpi";

async function queryServerRotationKpis(endItemId: string): Promise<{
  atSeaRotationKpis?: AtSeaKpIsType;
  atPortRotationKpis?: AtPortKpIsType;
}> {
  const itemIdFragment = endItemId.split("-");
  const [vesselCode, voyageNo] = [itemIdFragment[0], itemIdFragment[1]];

  const gqlClient = getClient();

  const { data: serverEndKpiDataResponse } = await gqlClient.query<Query>({
    query: gql`
      fragment BasicKpiFields on BaseKPIType {
        actual
        comparison
        delta
        deltaPercentage
        kpiValue
        proforma
      }

      query ($vesselCode: String!, $voyageNo: String!) {
        rotationByVoyageNoAndVesselCode(
          vesselCode: $vesselCode
          voyageNo: $voyageNo
        ) {
          kpis {
            vesselCode
            voyageNumber
            atPortRotationKpis {
              consumption {
                ...BasicKpiFields
              }
              containerMoves {
                ...BasicKpiFields
              }
              grossBerthProductivity {
                ...BasicKpiFields
              }
              grossCraneIntensity {
                ...BasicKpiFields
              }
              grossCraneProductivity {
                ...BasicKpiFields
              }
              idleTime {
                ...BasicKpiFields
              }
              waitingTime {
                ...BasicKpiFields
              }
              portStay {
                ...BasicKpiFields
              }
              timeLost {
                ...BasicKpiFields
              }
              restowMoves {
                ...BasicKpiFields
              }
            }
            atSeaRotationKpis {
              speed {
                ...BasicKpiFields
              }
              distance {
                ...BasicKpiFields
              }
              consumption {
                ...BasicKpiFields
              }
              co2Emissions {
                ...BasicKpiFields
              }
              cargoOnboard {
                containerDryLadenActual
                containerDryLadenComparison
                containerDryEmptyActual
                containerDryEmptyComparison
                containerRefLadenActual
                containerRefLadenComparison
              }
              rpm {
                ...BasicKpiFields
              }
              secaDistance {
                ...BasicKpiFields
              }
              serviceCii {
                actual
                comparison
                delta
                deltaPercentage
                kpiValue
                proforma
              }
              slip {
                ...BasicKpiFields
              }
              engineLoad {
                ...BasicKpiFields
              }
            }
          }
        }
      }
    `,
    variables: {
      vesselCode: vesselCode,
      voyageNo: voyageNo,
    },
  });
  const { atSeaRotationKpis, atPortRotationKpis } =
    serverEndKpiDataResponse.rotationByVoyageNoAndVesselCode?.kpis ?? {};

  return {
    atSeaRotationKpis: atSeaRotationKpis ?? undefined,
    atPortRotationKpis: atPortRotationKpis ?? undefined,
  };
}

function createSeaPrimaryRotationKpis(
  atSeaRotationKpis: AtSeaKpIsType,
): EndSeaPrimaryKpis {
  if (!atSeaRotationKpis) return {} as EndSeaPrimaryKpis;

  const speedDisplayValues = getSpeedDisplayValues(atSeaRotationKpis.speed);
  const distanceDisplayValues = getDistanceDisplayValues(
    atSeaRotationKpis.distance,
  );
  const consumptionDisplayValues = getAtSeaConsumptionDisplayValues(
    atSeaRotationKpis.consumption,
  );
  const co2EmissionsDisplayValue = getCo2EmissionsDisplayValue(
    atSeaRotationKpis.co2Emissions,
  );

  const seaPrimaryRotationKpis: EndSeaPrimaryKpis = {
    speed: {
      kpiValue: speedDisplayValues.kpiValue ?? "",
      actual: speedDisplayValues.actual,
      comparison: speedDisplayValues.comparison,
      delta: speedDisplayValues.delta,
      deltaPercentage: speedDisplayValues.deltaPercentage,
      proforma: speedDisplayValues.proforma,
    },
    distance: {
      kpiValue: distanceDisplayValues.kpiValue ?? "",
      actual: distanceDisplayValues.actual,
      comparison: distanceDisplayValues.comparison,
      delta: distanceDisplayValues.delta,
      deltaPercentage: distanceDisplayValues.deltaPercentage,
      proforma: distanceDisplayValues.proforma,
    },
    cargoOnboard: {
      ladenDry: {
        kpiValue: atSeaRotationKpis?.cargoOnboard?.containerDryLadenActual ?? 0,
        variation:
          atSeaRotationKpis?.cargoOnboard?.containerDryLadenComparison ?? 0,
        isPositive: false,
      },
      ladenReefer: {
        kpiValue: atSeaRotationKpis?.cargoOnboard?.containerRefLadenActual ?? 0,
        variation:
          atSeaRotationKpis?.cargoOnboard?.containerRefLadenComparison ?? 0,
        isPositive: false,
      },
      emptyDry: {
        kpiValue: atSeaRotationKpis?.cargoOnboard?.containerDryEmptyActual ?? 0,
        variation:
          atSeaRotationKpis?.cargoOnboard?.containerDryEmptyComparison ?? 0,
        isPositive: false,
      },
    },
    consumption: {
      kpiValue: consumptionDisplayValues.kpiValue ?? "",
      actual: consumptionDisplayValues.actual,
      comparison: consumptionDisplayValues.comparison,
      delta: consumptionDisplayValues.delta,
      deltaPercentage: consumptionDisplayValues.deltaPercentage,
      proforma: consumptionDisplayValues.proforma,
    },
    emissions: {
      kpiValue: co2EmissionsDisplayValue.kpiValue ?? "",
      actual: co2EmissionsDisplayValue.actual,
      comparison: co2EmissionsDisplayValue.comparison,
      delta: co2EmissionsDisplayValue.delta,
      deltaPercentage: co2EmissionsDisplayValue.deltaPercentage,
      proforma: co2EmissionsDisplayValue.proforma,
    },
  };

  return seaPrimaryRotationKpis;
}
function createSeaSecondaryRotationKpis(
  atSeaRotationKpis: AtSeaKpIsType,
): EndSeaSecondaryKpis {
  if (!atSeaRotationKpis) return {} as EndSeaSecondaryKpis;

  const rpmDisplayValues = getRpmDisplayValues(atSeaRotationKpis.rpm);
  const secaDistanceDisplayValues = getSecaDistanceDisplayValues(
    atSeaRotationKpis.secaDistance,
  );
  const engineLoadDisplayValues = getEngineLoadDisplayValues(
    atSeaRotationKpis.engineLoad,
  );
  const slipDisplayValues = getSlipDisplayValues(atSeaRotationKpis.slip);
  const serviceCiiDisplayValues = getServiceCiiDisplayValues(
    atSeaRotationKpis.serviceCii,
  );

  const seaSecondaryRotationKpis: EndSeaSecondaryKpis = {
    rpm: {
      kpiValue: rpmDisplayValues.kpiValue ?? "",
      actual: rpmDisplayValues.actual,
      comparison: rpmDisplayValues.comparison,
      delta: rpmDisplayValues.delta,
      deltaPercentage: rpmDisplayValues.deltaPercentage,
      proforma: rpmDisplayValues.proforma,
    },
    secaDistance: {
      kpiValue: secaDistanceDisplayValues.kpiValue ?? "",
      actual: secaDistanceDisplayValues.actual,
      comparison: secaDistanceDisplayValues.comparison,
      delta: secaDistanceDisplayValues.delta,
      deltaPercentage: secaDistanceDisplayValues.deltaPercentage,
      proforma: secaDistanceDisplayValues.proforma,
    },
    engineLoad: {
      kpiValue: engineLoadDisplayValues.kpiValue ?? "",
      actual: engineLoadDisplayValues.actual,
      comparison: engineLoadDisplayValues.comparison,
      delta: engineLoadDisplayValues.delta,
      deltaPercentage: engineLoadDisplayValues.deltaPercentage,
      proforma: engineLoadDisplayValues.proforma,
    },
    slip: {
      kpiValue: slipDisplayValues.kpiValue ?? "",
      actual: slipDisplayValues.actual,
      comparison: slipDisplayValues.comparison,
      delta: slipDisplayValues.delta,
      deltaPercentage: slipDisplayValues.deltaPercentage,
      proforma: slipDisplayValues.proforma,
    },
    serviceCii: {
      kpiValue: serviceCiiDisplayValues.kpiValue ?? "",
      actual: serviceCiiDisplayValues.actual,
      comparison: serviceCiiDisplayValues.comparison,
      delta: serviceCiiDisplayValues.delta,
      deltaPercentage: serviceCiiDisplayValues.deltaPercentage,
      proforma: serviceCiiDisplayValues.proforma,
    },
  };
  return seaSecondaryRotationKpis;
}
function createPortPrimaryRotationKpis(
  atPortRotationKpis: AtPortKpIsType,
): EndPortPrimaryKpis {
  if (!atPortRotationKpis) return {} as EndPortPrimaryKpis;

  const waitingTimeDisplayValues = getWaitingTimeDisplayValues(
    atPortRotationKpis.waitingTime,
  );
  const portStayDisplayValues = getPortStayDisplayValues(
    atPortRotationKpis.portStay,
  );
  const grossBerthProductivityDisplayValues =
    getGrossBerthProductivityDisplayValues(
      atPortRotationKpis.grossBerthProductivity,
    );
  const containerMovesDisplayValues = getContainerMovesDisplayValues(
    atPortRotationKpis.containerMoves,
  );
  const restowMovesDisplayValues = getRestowMovesDisplayValues(
    atPortRotationKpis.restowMoves,
  );

  const portPrimaryRotationKpis: EndPortPrimaryKpis = {
    waitingTime: {
      kpiValue: waitingTimeDisplayValues.kpiValue ?? "",
      actual: waitingTimeDisplayValues.actual,
      comparison: waitingTimeDisplayValues.comparison,
      delta: waitingTimeDisplayValues.delta,
      deltaPercentage: waitingTimeDisplayValues.deltaPercentage,
      proforma: waitingTimeDisplayValues.proforma,
    },
    portStayTime: {
      kpiValue: portStayDisplayValues.kpiValue ?? "",
      actual: portStayDisplayValues.actual,
      comparison: portStayDisplayValues.comparison,
      delta: portStayDisplayValues.delta,
      deltaPercentage: portStayDisplayValues.deltaPercentage,
      proforma: portStayDisplayValues.proforma,
    },
    grossBerthProductivity: {
      kpiValue: grossBerthProductivityDisplayValues.kpiValue ?? "",
      actual: grossBerthProductivityDisplayValues.actual,
      comparison: grossBerthProductivityDisplayValues.comparison,
      delta: grossBerthProductivityDisplayValues.delta,
      deltaPercentage: grossBerthProductivityDisplayValues.deltaPercentage,
      proforma: grossBerthProductivityDisplayValues.proforma,
    },
    containerMoves: {
      kpiValue: containerMovesDisplayValues.kpiValue ?? "",
      actual: containerMovesDisplayValues.actual,
      comparison: containerMovesDisplayValues.comparison,
      delta: containerMovesDisplayValues.delta,
      deltaPercentage: containerMovesDisplayValues.deltaPercentage,
      proforma: containerMovesDisplayValues.proforma,
    },
    restowMoves: {
      kpiValue: restowMovesDisplayValues.kpiValue ?? "",
      actual: restowMovesDisplayValues.actual,
      comparison: restowMovesDisplayValues.comparison,
      delta: restowMovesDisplayValues.delta,
      deltaPercentage: restowMovesDisplayValues.deltaPercentage,
      proforma: restowMovesDisplayValues.proforma,
    },
  };
  return portPrimaryRotationKpis;
}
function createPortSecondaryRotationKpis(
  atPortRotationKpis: AtPortKpIsType,
): EndPortSecondaryKpis {
  if (!atPortRotationKpis) return {} as EndPortSecondaryKpis;

  const consumptionDisplayValues = getAtPortConsumptionDisplayValues(
    atPortRotationKpis.consumption,
  );
  const grossCraneProductivityDisplayValues =
    getGrossCraneProductivityDisplayValues(
      atPortRotationKpis.grossCraneProductivity,
    );
  const grossCraneIntensityDisplayValues = getGrossCraneIntensityDisplayValues(
    atPortRotationKpis.grossCraneIntensity,
  );
  const idleTimeDisplayValues = getIdleTimeDisplayValues(
    atPortRotationKpis.idleTime,
  );
  const timeLostDisplayValues = getTimeLostDisplayValues(
    atPortRotationKpis.timeLost,
  );

  const portSecondaryRotationKpis: EndPortSecondaryKpis = {
    consumption: {
      kpiValue: consumptionDisplayValues.kpiValue ?? "",
      actual: consumptionDisplayValues.actual,
      comparison: consumptionDisplayValues.comparison,
      delta: consumptionDisplayValues.delta,
      deltaPercentage: consumptionDisplayValues.deltaPercentage,
      proforma: consumptionDisplayValues.proforma,
    },
    grossCraneProductivity: {
      kpiValue: grossCraneProductivityDisplayValues.kpiValue ?? "",
      actual: grossCraneProductivityDisplayValues.actual,
      comparison: grossCraneProductivityDisplayValues.comparison,
      delta: grossCraneProductivityDisplayValues.delta,
      deltaPercentage: grossCraneProductivityDisplayValues.deltaPercentage,
      proforma: grossCraneProductivityDisplayValues.proforma,
    },
    grossCraneIntensity: {
      kpiValue: grossCraneIntensityDisplayValues.kpiValue ?? "",
      actual: grossCraneIntensityDisplayValues.actual,
      comparison: grossCraneIntensityDisplayValues.comparison,
      delta: grossCraneIntensityDisplayValues.delta,
      deltaPercentage: grossCraneIntensityDisplayValues.deltaPercentage,
      proforma: grossCraneIntensityDisplayValues.proforma,
    },
    idleTime: {
      kpiValue: idleTimeDisplayValues.kpiValue ?? "",
      actual: idleTimeDisplayValues.actual,
      comparison: idleTimeDisplayValues.comparison,
      delta: idleTimeDisplayValues.delta,
      deltaPercentage: idleTimeDisplayValues.deltaPercentage,
      proforma: idleTimeDisplayValues.proforma,
    },
    timeLostRestow: {
      kpiValue: timeLostDisplayValues.kpiValue ?? "",
      actual: timeLostDisplayValues.actual,
      comparison: timeLostDisplayValues.comparison,
      delta: timeLostDisplayValues.delta,
      deltaPercentage: timeLostDisplayValues.deltaPercentage,
      proforma: timeLostDisplayValues.proforma,
    },
  };
  return portSecondaryRotationKpis;
}
export async function getRotationEndKpis(
  endItemId: string,
): Promise<EndRotationKpis> {
  if (!endItemId) throw new Error("No endItemID provided");

  const { atSeaRotationKpis, atPortRotationKpis } =
    await queryServerRotationKpis(endItemId);

  if (!atSeaRotationKpis || !atPortRotationKpis) return {} as EndRotationKpis;

  const seaPrimaryRotationKpis =
    createSeaPrimaryRotationKpis(atSeaRotationKpis);

  const seaSecondaryRotationKpis =
    createSeaSecondaryRotationKpis(atSeaRotationKpis);

  const portPrimaryRotationKpis =
    createPortPrimaryRotationKpis(atPortRotationKpis);

  const portSecondaryRotationKpis =
    createPortSecondaryRotationKpis(atPortRotationKpis);

  const holeRotationKpiData = {
    seaPrimaryRotationKpis,
    seaSecondaryRotationKpis,
    portPrimaryRotationKpis,
    portSecondaryRotationKpis,
  };

  return holeRotationKpiData;
}

export async function getTimeDepedentKpis(
  voyageNo: string,
  vesselCode: string,
  atTime: Date,
) {
  const gqlClient = getClient();

  const formatedTime = DateTime.fromJSDate(atTime)
    .toUTC()
    .toFormat("yyyy-MM-dd'T'HH:mm:ss");

  const serverKpiPassage = await gqlClient
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
          $atTime: DateTime!
        ) {
          rotationByVoyageNoAndVesselCode(
            voyageNo: $voyageNo
            vesselCode: $vesselCode
          ) {
            kpis {
              locationSpecificKpis(atTime: $atTime) {
                ... on AtPortKPIsType {
                  kpisLocation
                  waitingTime {
                    ...BasicKpiFields
                  }
                  portStay {
                    ...BasicKpiFields
                  }
                  grossBerthProductivity {
                    ...BasicKpiFields
                  }
                  containerMoves {
                    ...BasicKpiFields
                  }
                  restowMoves {
                    ...BasicKpiFields
                  }
                  consumption {
                    ...BasicKpiFields
                  }
                  grossCraneProductivity {
                    ...BasicKpiFields
                  }
                  grossCraneIntensity {
                    ...BasicKpiFields
                  }
                  idleTime {
                    ...BasicKpiFields
                  }
                  timeLost {
                    ...BasicKpiFields
                  }
                }
                ... on AtSeaKPIsType {
                  kpisLocation
                  speed {
                    ...BasicKpiFields
                  }
                  distance {
                    ...BasicKpiFields
                  }
                  consumption {
                    ...BasicKpiFields
                  }
                  co2Emissions {
                    ...BasicKpiFields
                  }
                  cargoOnboard {
                    containerDryLadenActual
                    containerDryEmptyActual
                    containerRefLadenActual
                    containerDryLadenComparison
                    containerDryEmptyComparison
                    containerRefLadenComparison
                  }
                  rpm {
                    ...BasicKpiFields
                  }
                  secaDistance {
                    ...BasicKpiFields
                  }
                  engineLoad {
                    ...BasicKpiFields
                  }
                  slip {
                    ...BasicKpiFields
                  }
                  serviceCii {
                    kpiValue
                    actual
                    proforma
                    comparison
                    delta
                    deltaPercentage
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        vesselCode,
        voyageNo,
        atTime: formatedTime,
      },
    })
    .then(
      res =>
        res.data.rotationByVoyageNoAndVesselCode?.kpis?.locationSpecificKpis,
    );

  return serverKpiPassage;
}
