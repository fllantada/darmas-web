import { CommonKpiValues } from "@/app/plataform/globalDomain/commonKpiValues";

export interface RotationHeaderKpis extends SharedDetails {
  commercialReliability?: CommonKpiValues;
  emissions?: EmissionKpiValues;
  operationalEfficiency?: OperationalEfficiencyKpiValues;
  portsCommercialReliability: PortComercialReliability[];
  portsSchedulePerformance: PortSchedulePerformance[];
  schedulePerformance?: CommonKpiValues;
}

export enum ScheduleChangeStatus {
  ADDITIONAL_CALLING = "A",
  PHASE_IN = "I",
  PHASE_OUT = "O",
  SKIP_CALLING = "S",
  NON_CARGO = "N",
}
export interface EmissionKpiValues {
  actual?: string;
  comparison?: number;
  delta?: number;
  deltaPercentage?: number;
  kpiValue?: string;
  proforma?: string;
}

export interface OperationalEfficiencyKpiValues {
  bunkerDeltaPercentage?: number;
  comparison?: number;
  kpiValue?: number;
  portCallsDeltaPercentage?: number;
  voyageDaysDeltaPercentage?: number;
}
interface SharedDetails {
  vesselCode: string;
  voyageNumber: string;
}

export interface OperationalEfficiencyDetails extends SharedDetails {
  bunkerConsumption?: number;
  comparison?: number;
  kpi?: number;
  modelConsumption?: number;
  portCalls?: number;
  portCallsActual?: number;
  portCallsForecast?: number;
  proformaBunkerConsumption?: number;
  proformaPortCalls?: number;
  proformaVoyageDays?: number;
  voyageDays?: number;
  voyageDaysActual?: number;
  voyageDaysForecast?: number;
}

export interface EmissionDetails extends SharedDetails {
  attainedCii?: number;
  ciiRating?: string;
  modelCii?: number;
  modelCiiRating?: string;
  proformaCii?: number;
  proformaCiiRating?: string;
}

export type PortComercialReliability = {
  actualDays?: number;
  arrivalPort?: string;
  calculationType?: string;
  changeStatusArrival?: ScheduleChangeStatus;
  changeStatusDeparture?: ScheduleChangeStatus;
  delta?: number;
  departurePort?: string;
  proformaDays?: number;
  sequenceArrival?: number;
  sequenceDeparture?: number;
};

export interface PortSchedulePerformance extends SharedDetails {
  actualArrivalTime?: Date;
  calculationType?: string;
  changeStatus?: ScheduleChangeStatus;
  delta?: number;
  direction?: string;
  port: string;
  proformaArrivalTime?: Date;
  sequence?: number;
}
