import type {
  AtPortKpIsType,
  AtSeaKpIsType,
  BaseKpiType,
  CargoOnboardKpiType,
  EmissionsHeaderKpiType,
  OperationalEfficiencyHeaderKpiType,
  ServiceCiiKpiType,
  VesselEmissionsKpiType,
} from "@/generated/graphql";

import {
  calculateRotationType,
  RotationType,
} from "@/app/plataform/globalDomain/rotationTypes";
import { BaseKpiDisplayValues } from "@/app/plataform/lib/types";
import {
  isNotNullOrUndefined,
  numberToDecimalString,
  numberToNoDecimalString,
  numberToNoDecimalStringPercentage,
} from "@/app/plataform/lib/utils";

export function getSchedulePerformanceDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicHeaderKpi(data);
}

export function getCommercialReliabilityDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicHeaderKpi(data);
}
export type OperationalEfficiencyKpiDisplayValues = BaseKpiDisplayValues & {
  bunkerDeltaPercentage?: string;
  comparison?: string;
  kpiValue?: string;
  portCallsDeltaPercentage?: string;
  voyageDaysDeltaPercentage?: string;
};

export function getOperationalEfficiencyDisplayValues(
  data: OperationalEfficiencyHeaderKpiType | undefined | null,
): OperationalEfficiencyKpiDisplayValues {
  return {
    bunkerDeltaPercentage: isNotNullOrUndefined(data?.bunkerDeltaPercentage)
      ? `${numberToNoDecimalString(data.bunkerDeltaPercentage)}%`
      : undefined,
    comparison: isNotNullOrUndefined(data?.comparison)
      ? `${numberToNoDecimalString(data.comparison)}%`
      : undefined,
    kpiValue: isNotNullOrUndefined(data?.kpiValue)
      ? `${numberToNoDecimalString(data.kpiValue)}%`
      : undefined,
    portCallsDeltaPercentage: isNotNullOrUndefined(
      data?.portCallsDeltaPercentage,
    )
      ? `${numberToNoDecimalString(data.portCallsDeltaPercentage)}%`
      : undefined,
    voyageDaysDeltaPercentage: isNotNullOrUndefined(
      data?.voyageDaysDeltaPercentage,
    )
      ? `${numberToNoDecimalString(data.voyageDaysDeltaPercentage)}%`
      : undefined,
    actual: undefined,
    delta: undefined,
    deltaPercentage: undefined,
    proforma: undefined,
  };
}

export function getServiceEmissionsDisplayValues(
  data: VesselEmissionsKpiType[] | undefined | null,
): BaseKpiDisplayValues {
  const displayValue = {
    kpiValue: data
      ? data
          ?.map(vessel => {
            if (
              calculateRotationType(vessel.vesselCode) !== RotationType.OPERATED
            )
              return "";
            return `${vessel.vesselCode}: ${vessel.attainedCii ? numberToNoDecimalString(vessel.attainedCii) : "--"}% - ${
              vessel.ciiRating
            }`;
          })
          .join("\n")
      : undefined,
    comparison: undefined,
    delta: undefined,
    deltaPercentage: undefined,
    proforma: undefined,
    actual: undefined,
  };

  return displayValue;
}

export function getRotationEmissionsDisplayValues(
  data: EmissionsHeaderKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    kpiValue:
      (() => {
        if (data?.kpiValue) {
          const regex = /[\d.]+/;

          // Extract the number using the regex
          const match = data.kpiValue.match(regex);

          if (match) {
            const number = parseFloat(match[0]);
            return data.kpiValue.replace(regex, number.toFixed(1) + "%");
          }
        }
      })() || undefined,
    comparison: isNotNullOrUndefined(data?.comparison)
      ? numberToNoDecimalString(data.comparison)
      : undefined,
    delta: isNotNullOrUndefined(data?.delta)
      ? numberToNoDecimalString(data.delta)
      : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? numberToNoDecimalString(data.deltaPercentage)
      : undefined,
    proforma: data?.proforma || undefined,
    actual: data?.actual || undefined,
  };
}

function basicKpi(data: BaseKpiType | undefined | null): BaseKpiDisplayValues {
  const basicKP = {
    actual: isNotNullOrUndefined(data?.actual)
      ? numberToNoDecimalString(data.actual)
      : undefined,
    comparison: isNotNullOrUndefined(data?.comparison)
      ? `${numberToNoDecimalString(data.comparison)}%`
      : undefined,
    delta: data?.delta?.toFixed(0),
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,
    kpiValue: isNotNullOrUndefined(data?.kpiValue)
      ? numberToNoDecimalString(data.kpiValue)
      : undefined,
    proforma: isNotNullOrUndefined(data?.proforma)
      ? numberToNoDecimalString(data.proforma)
      : undefined,
  };
  return basicKP;
}

export function getCargoOnboardyDisplayValues(
  data: CargoOnboardKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: undefined,
    comparison: `Dry Empty: ${data?.containerDryEmptyComparison ? numberToNoDecimalString(data?.containerDryEmptyComparison) : "--"}
Dry Laden: ${data?.containerDryLadenComparison ? numberToNoDecimalString(data.containerDryLadenComparison) : "--"}
Ref Laden: ${data?.containerRefLadenComparison ? numberToNoDecimalString(data.containerRefLadenComparison) : "--"}`,
    delta: undefined,
    deltaPercentage: undefined,
    kpiValue: `Dry Empty: ${data?.containerDryEmptyActual ? numberToNoDecimalString(data.containerDryEmptyActual) : "--"}
Dry Laden: ${data?.containerDryLadenActual ? numberToNoDecimalString(data.containerDryLadenActual) : "--"}
Ref Laden: ${data?.containerRefLadenActual ? numberToNoDecimalString(data.containerRefLadenActual) : "--"}`,
    proforma: undefined,
  };
}

export function getCo2EmissionsDisplayValue(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getAtSeaConsumptionDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getDistanceDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getEngineLoadDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: data?.actual ? numberToNoDecimalString(data.actual) : undefined,
    comparison: data?.comparison
      ? numberToNoDecimalString(data.comparison)
      : undefined,
    delta: data?.delta ? numberToNoDecimalString(data.delta) : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,
    kpiValue: data?.kpiValue
      ? numberToNoDecimalString(data.kpiValue)
      : undefined,
    proforma: data?.proforma
      ? numberToNoDecimalString(data.proforma)
      : undefined,
  };
}

export function getRpmDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: data?.actual ? numberToNoDecimalString(data.actual) : undefined,
    comparison: data?.comparison
      ? numberToNoDecimalString(data.comparison)
      : undefined,
    delta: data?.delta ? numberToNoDecimalString(data.delta) : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,
    kpiValue: data?.kpiValue
      ? numberToNoDecimalString(data.kpiValue)
      : undefined,
    proforma: data?.proforma
      ? numberToNoDecimalString(data.proforma)
      : undefined,
  };
}

export function getSecaDistanceDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getServiceCiiDisplayValues(
  data: ServiceCiiKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: data?.actual ? numberToNoDecimalString(data.actual) + "%" : "--",
    comparison: data?.comparison
      ? numberToNoDecimalString(data.comparison)
      : undefined,
    delta: data?.delta ? numberToNoDecimalString(data.delta) : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,
    kpiValue: (() => {
      if (data?.kpiValue) {
        const regex = /[\d.]+/;

        // Extract the number using the regex
        const match = data.kpiValue.match(regex);

        if (match) {
          const number = parseFloat(match[0]);
          return data.kpiValue.replace(
            regex,
            numberToNoDecimalString(number) + "% -",
          );
        }
      }
    })(),
    proforma: data?.proforma
      ? numberToNoDecimalString(data.proforma) + "%"
      : undefined,
  };
}

export function getSlipDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getSpeedDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: data?.actual?.toFixed(1),
    comparison: isNotNullOrUndefined(data?.comparison)
      ? `${numberToNoDecimalString(data.comparison)}%`
      : undefined,
    delta: data?.delta ? data.delta.toFixed(1) : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,
    kpiValue: data?.kpiValue?.toFixed(1),
    proforma: data?.proforma?.toFixed(1),
  };
}

export const AtSeaKpiTitles: Omit<
  Record<keyof AtSeaKpIsType, string>,
  "__typename" | "kpisLocation"
> & {
  emissions: string;
} = {
  cargoOnboard: "Cargo Onboard (TEU)",
  co2Emissions: "Emissions (tons)",
  emissions: "Emissions (tons)",
  consumption: "Consumption (tons)",
  distance: "Distance (nM)",
  engineLoad: "Engine Load (kW)",
  rpm: "RPM (rpm)",
  secaDistance: "SECA, Distance (nM)",
  serviceCii: "Leg CII",
  slip: "Slip (%)",
  speed: "Speed (kts)",
};

export function getAtPortConsumptionDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getContainerMovesDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getGrossBerthProductivityDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getGrossCraneIntensityDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getGrossCraneProductivityDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getIdleTimeDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: data?.actual?.toFixed(1),
    comparison: isNotNullOrUndefined(data?.comparison)
      ? `${numberToNoDecimalString(data.comparison)}%`
      : undefined,
    delta: data?.delta ? data.delta.toFixed(1) : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,
    kpiValue: data?.kpiValue?.toFixed(1),
    proforma: data?.proforma?.toFixed(1),
  };
}

export function getPortStayDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getRestowMovesDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export function getTimeLostDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  const actual = isNotNullOrUndefined(data?.actual)
    ? numberToDecimalString(data.actual, 1)
    : undefined;
  const comparison = isNotNullOrUndefined(data?.comparison)
    ? numberToNoDecimalString(data.comparison)
    : undefined;
  const delta = isNotNullOrUndefined(data?.delta)
    ? numberToDecimalString(data.delta, 1)
    : undefined;
  const deltaPercentage = isNotNullOrUndefined(data?.deltaPercentage)
    ? numberToNoDecimalStringPercentage(data.deltaPercentage)
    : undefined;
  const kpiValue = isNotNullOrUndefined(data?.kpiValue)
    ? numberToDecimalString(data.kpiValue, 1)
    : undefined;
  const proforma = isNotNullOrUndefined(data?.proforma)
    ? numberToDecimalString(data.proforma, 1)
    : undefined;

  const formatedData = {
    actual,
    comparison,
    delta,
    deltaPercentage,
    kpiValue,
    proforma,
  };

  return formatedData;
}

export function getWaitingTimeDisplayValues(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return basicKpi(data);
}

export const AtPortKpiTitles: Omit<
  Record<keyof AtPortKpIsType, string>,
  "__typename" | "kpisLocation"
> & {
  timeLostRestow: string;
  portStayTime: string;
} = {
  consumption: "Consumption (tons)",
  containerMoves: "Container Moves (units)",
  grossBerthProductivity: "Gross Berth Productivity (mph)",
  grossCraneIntensity: "Gross Crane Intensity",
  grossCraneProductivity: "Gross Crane Productivity",
  idleTime: "Idle Time (hrs)",
  portStay: "Port Stay (hrs)",
  portStayTime: "Port Stay (hrs)",
  restowMoves: "Restow Moves (units)",
  timeLost: "Time Lost Due to Restow (hrs)",
  timeLostRestow: "Time Lost Due to Restow (hrs)",
  waitingTime: "Waiting Time (hrs)",
};

export function basicHeaderKpi(
  data: BaseKpiType | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: isNotNullOrUndefined(data?.actual)
      ? `${numberToNoDecimalString(data.actual)}%`
      : undefined,
    comparison: isNotNullOrUndefined(data?.comparison)
      ? `${numberToNoDecimalString(data.comparison)}%`
      : undefined,
    delta: data?.delta ? numberToNoDecimalString(data.delta) : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,
    kpiValue: isNotNullOrUndefined(data?.kpiValue)
      ? `${numberToNoDecimalString(data?.kpiValue)}%`
      : undefined,
    proforma: isNotNullOrUndefined(data?.proforma)
      ? numberToNoDecimalString(data.proforma)
      : undefined,
  };
}
