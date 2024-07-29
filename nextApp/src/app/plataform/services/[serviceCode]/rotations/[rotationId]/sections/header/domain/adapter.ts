import {
  HeaderVoyageKpIs,
  SchedulePerformancePortType,
} from "@/generated/graphql";

import { isNotNullOrUndefined } from "@/app/plataform/lib/utils";

import { RotationHeaderKpis, ScheduleChangeStatus } from "./interfaces";

export const adaptServerKpisToDomainFormat = (
  headerKpis: HeaderVoyageKpIs,
): RotationHeaderKpis => {
  return {
    vesselCode: headerKpis.vesselCode,
    voyageNumber: headerKpis.voyageNumber,
    commercialReliability: {
      actual: headerKpis.commercialReliabilityBase?.actual ?? undefined,
      comparison: headerKpis.commercialReliabilityBase?.comparison ?? undefined,
      delta: headerKpis.commercialReliabilityBase?.delta ?? undefined,
      deltaPercentage:
        headerKpis.commercialReliabilityBase?.deltaPercentage ?? undefined,
      kpiValue: headerKpis.commercialReliabilityBase?.kpiValue ?? undefined,
      proforma: headerKpis.commercialReliabilityBase?.proforma ?? undefined,
    },
    emissions: {
      actual: headerKpis.emissionsBase?.actual ?? undefined,
      comparison: headerKpis.emissionsBase?.comparison ?? undefined,
      delta: headerKpis.emissionsBase?.delta ?? undefined,
      deltaPercentage: headerKpis.emissionsBase?.deltaPercentage ?? undefined,
      kpiValue:
        (() => {
          if (headerKpis.emissionsBase?.kpiValue) {
            const regex = /[\d.]+/;

            // Extract the number using the regex
            const match = headerKpis.emissionsBase?.kpiValue.match(regex);

            if (match) {
              const number = parseFloat(match[0]);
              return headerKpis.emissionsBase?.kpiValue.replace(
                regex,
                number.toFixed(1) + "%",
              );
            }
          }
        })() || undefined,
      proforma: headerKpis.emissionsBase?.proforma ?? undefined,
    },

    operationalEfficiency: {
      bunkerDeltaPercentage:
        headerKpis.operationalEfficiencyBase?.bunkerDeltaPercentage ??
        undefined,
      comparison: headerKpis.operationalEfficiencyBase?.comparison
        ? Math.round(headerKpis.operationalEfficiencyBase?.comparison)
        : undefined,
      kpiValue: isNotNullOrUndefined(
        headerKpis.operationalEfficiencyBase?.kpiValue,
      )
        ? headerKpis.operationalEfficiencyBase?.kpiValue
        : undefined,
      portCallsDeltaPercentage:
        headerKpis.operationalEfficiencyBase?.portCallsDeltaPercentage ??
        undefined,
      voyageDaysDeltaPercentage: isNotNullOrUndefined(
        headerKpis.operationalEfficiencyBase?.voyageDaysDeltaPercentage,
      )
        ? Math.round(
            headerKpis.operationalEfficiencyBase?.voyageDaysDeltaPercentage,
          )
        : undefined,
    },

    portsCommercialReliability:
      headerKpis?.portsCommercialReliability?.map(item => ({
        actualDays: item.actualDays ?? undefined,
        arrivalPort: item.arrivalPort ?? undefined,
        calculationType: item.calculationType ?? undefined,
        changeStatusArrival: mapToScheduleChangeStatus(
          item.changeStatusArrival,
        ),
        changeStatusDeparture: mapToScheduleChangeStatus(
          item.changeStatusDeparture,
        ),
        delta: item.delta ?? undefined,
        departurePort: item.departurePort ?? undefined,
        proformaDays: item.proformaDays ?? undefined,
        sequenceArrival: item.sequenceArrival ?? undefined,
        sequenceDeparture: item.sequenceDeparture ?? undefined,
      })) ?? [],

    portsSchedulePerformance:
      headerKpis?.portsSchedulePerformance?.map(
        (item: SchedulePerformancePortType) => ({
          vesselCode: headerKpis.vesselCode,
          voyageNumber: headerKpis.voyageNumber,
          actualArrivalTime: item?.actualArrivalTime ?? undefined,
          calculationType: item.calculationType ?? undefined,
          changeStatus: mapToScheduleChangeStatus(item.changeStatus),
          delta: item.delta ?? undefined,
          direction: item.direction ?? undefined,
          port: item.port ?? undefined,
          proformaArrivalTime: item.proformaArrivalTime ?? undefined,
          sequence: item.sequence ?? undefined,
        }),
      ) ?? [],

    schedulePerformance: {
      actual: headerKpis.schedulePerformanceBase?.actual ?? undefined,
      comparison: headerKpis.schedulePerformanceBase?.comparison ?? undefined,
      delta: headerKpis.schedulePerformanceBase?.delta ?? undefined,
      deltaPercentage:
        headerKpis.schedulePerformanceBase?.deltaPercentage ?? undefined,
      kpiValue: headerKpis.schedulePerformanceBase?.kpiValue ?? undefined,
      proforma: headerKpis.schedulePerformanceBase?.proforma ?? undefined,
    },
  };
};

export const mapToScheduleChangeStatus = (
  status: string | undefined | null,
): ScheduleChangeStatus | undefined => {
  if (!status) {
    return undefined;
  }
  switch (status) {
    case "A":
      return ScheduleChangeStatus.ADDITIONAL_CALLING;
    case "I":
      return ScheduleChangeStatus.PHASE_IN;
    case "O":
      return ScheduleChangeStatus.PHASE_OUT;

    case "S":
      return ScheduleChangeStatus.SKIP_CALLING;
    case "N":
      return ScheduleChangeStatus.NON_CARGO;

    case "B":
      return ScheduleChangeStatus.SKIP_CALLING;
    default:
      return undefined;
  }
};
