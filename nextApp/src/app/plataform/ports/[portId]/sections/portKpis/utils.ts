import { BaseKpiDisplayValues } from "@/app/plataform/lib/types";
import {
  isNotNullOrUndefined,
  numberToNoDecimalString,
} from "@/app/plataform/lib/utils";

export function getVesselTurnaroundDisplayValues(
  data: any | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: isNotNullOrUndefined(data?.actual)
      ? `${numberToNoDecimalString(data.actual)}`
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

export function getBerthOnArrivalDisplayValues(
  data: any | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: isNotNullOrUndefined(data?.actual)
      ? `${numberToNoDecimalString(data.actual)}`
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

export function getCongestionImpactDisplayValues(
  data: any | undefined | null,
): BaseKpiDisplayValues {
  return {
    actual: isNotNullOrUndefined(data?.actual)
      ? `${numberToNoDecimalString(data.actual)}`
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

export function getPortEmissionDisplayValues(
  data: any | undefined | null,
): BaseKpiDisplayValues {
  return {
    comparison: isNotNullOrUndefined(data?.comparison)
      ? `${numberToNoDecimalString(data.comparison)}%`
      : undefined,
    delta: data?.delta ? numberToNoDecimalString(data.delta) : undefined,
    deltaPercentage: isNotNullOrUndefined(data?.deltaPercentage)
      ? `${numberToNoDecimalString(data.deltaPercentage)}%`
      : undefined,

    proforma: isNotNullOrUndefined(data?.proforma)
      ? numberToNoDecimalString(data.proforma)
      : undefined,

    kpiValue: isNotNullOrUndefined(data?.kpiValue)
      ? numberToNoDecimalString(data?.kpiValue)
      : undefined,
    actual: isNotNullOrUndefined(data?.actual)
      ? numberToNoDecimalString(data.actual)
      : undefined,
  };
}
