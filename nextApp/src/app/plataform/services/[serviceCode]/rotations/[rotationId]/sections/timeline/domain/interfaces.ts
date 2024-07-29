import { VesselStatus } from "@/app/plataform/globalDomain/vesselStatus";

export enum ScheduleView {
  Timeline = "timeline",
  Table = "table",
}

export enum ViewTimeScale {
  Day = "day",
  Month = "month",
}

export interface VoyageBlock {
  vesselCode: string;
  voyageNumber: string;
  blockNumber: number;
  status: VesselStatus;
  atPort: string;
  sequence: number;
  startTime: Date;
  endTime: Date;
  delta?: string;
}
