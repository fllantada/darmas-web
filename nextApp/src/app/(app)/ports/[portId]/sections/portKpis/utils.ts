import type { BaseKpiType } from "@/generated/graphql";

import { BaseKpiDisplayValues } from "@/lib/types";
import { isNotNullOrUndefined, numberToNoDecimalString } from "@/lib/utils";

export function getVesselTurnaroundDisplayValues(
  data: BaseKpiType | undefined | null,
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
  data: BaseKpiType | undefined | null,
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
  data: BaseKpiType | undefined | null,
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
  data: BaseKpiType | undefined | null,
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
