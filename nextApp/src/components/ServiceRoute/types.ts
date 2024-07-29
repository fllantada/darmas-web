import { PortCall, VesselType } from "@/generated/graphql";

export enum VesselStatus {
  AT_PORT = "At Port",
  AT_SEA = "Sea Passage",
  WAITING_TIME = "Waiting Time",
}

export type PortWithVessel = PortCall & { vessel?: VesselType };