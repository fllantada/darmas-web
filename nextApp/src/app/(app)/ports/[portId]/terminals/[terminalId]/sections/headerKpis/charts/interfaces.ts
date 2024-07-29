import { CalculationType } from "@/globalDomain/calculationTypes";
import { RotationType } from "@/globalDomain/rotationTypes";

export interface PortEmissionTerminalOverlay extends TerminalChartVesselType {}
export interface VesselTurnarrondTerminalOverlay
  extends TerminalChartVesselType {}

export interface TerminalChartVesselType {
  vesselName: string;
  vesselType: RotationType;
  actual: number;
  proforma: number;
  calculationType?: CalculationType;
}
export interface BerthOnArrivalTerminalOverlay {
  target: number;
  vessels: TerminalChartVesselType[];
}
