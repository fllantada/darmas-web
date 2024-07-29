import { CommonKpiValues } from "@/globalDomain/commonKpiValues";

export interface TerminalHeaderKpis {
  vesselTurnaround: VesselTurnAround;
  berthOnArrival: BerthOnArrival;
  congestionImpact?: CongestionImpact;
  portEmission: PortEmission;
}

export interface VesselTurnAround extends CommonKpiValues {
  titleText: string;
  infoText: string;
}
export interface BerthOnArrival extends CommonKpiValues {
  titleText: string;
  infoText: string;
}
export interface CongestionImpact extends CommonKpiValues {
  titleText: string;
  infoText: string;
}
export interface PortEmission extends CommonKpiValues {
  titleText: string;
  infoText: string;
}
