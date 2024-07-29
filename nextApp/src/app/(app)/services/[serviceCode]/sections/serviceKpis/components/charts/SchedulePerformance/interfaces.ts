export enum VesselType {
  PARTNER = "Partner",
  OPERATED = "Operated",
}

export interface VesselSchedulePerformance {
  voyageNo: string;
  vesselCode: string;
  vesselType: VesselType;
  onTimeActualPortCalls: number;
  onTimeForecastPortCalls: number;
  offTimeActualPortCalls: number;
  offTimeForecastPortCalls: number;
}

export type ServiceSchedulePerformaceGraphProps = {
  rotations: string[];
  onTimeActualPortCalls: DatasetItem[];
  onTimeForecastPortCalls: DatasetItem[];
  offTimePortCalls: DatasetItem[];
};

type DatasetItem = {
  value: number | null;
  itemStyle?: {
    color: string;
  };
};
