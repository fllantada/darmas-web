import { CalculationType } from "@/globalDomain/calculationTypes";

export interface PortSnapshotSummary {
  totalAtPort: number;
  waitingVessels: number;
  atBerthVessels: number;
  arrivingVessels: number;
}

export type VesselInformation = {
  name: string;
  type: VesselType;
};

export enum VesselType {
  OPERATED = "Operated",
  PARTNER = "Partner",
  OTHERS = "Others",
}

export enum ValidPortEvent {
  ARRIVING = "Arriving",
  WAITING = "Waiting",
  AT_BERTH = "At Berth",
  DEPARTED = "Departed",
}

export interface PortSnapshot {
  summary: PortSnapshotSummary;
  portEvents: PortEvents[];
}

export interface PortEvents {
  vessel: VesselInformation;
  event: ValidPortEvent;

  arrivalTime: Date;
  arrivalTimeCalType: CalculationType;
  berthTime: Date | null;
  berthTimeCalType: CalculationType;
  departureTime: Date | null;
  departureTimeCalType: CalculationType;

  berthName: string;
  operator: string;
  waitTime: number;
  terminal: string;
}
