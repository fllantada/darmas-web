import moment from "moment";

export enum ViewMode {
  Timeline = "Timeline",
  Table = "Table",
}

export interface TService {
  serviceCode: string;
  serviceName: string;

  vessels: TServiceVessel[];
}

export interface TServiceVessel {
  vesselName: string;
  vesselCode: string;
  operator: string;
  voyages: TVesselVoyage[];
}

export interface TVesselVoyage {
  voyageCode: string;
  delta: number;
  start: Date;
  end: Date;
}

export enum ScheduleView {
  Timeline = "timeline",
  Table = "table",
}

export type SelectedDateRangeForKpis = Date;

export enum ViewTimeScale {
  Day = "day",
  Month = "month",
}

export const getDayVisibleWindow = (selectedDate: Date) => {
  const start = moment(selectedDate)
    .startOf("day")
    .subtract(3, "days")
    .toDate();
  const end = moment(start).add(13, "days").toDate();
  return { start, end };
};

export const getMonthVisibleWindow = (selectedDate: Date) => {
  const start = moment(selectedDate)
    .startOf("month")
    .subtract(3, "months")
    .subtract(1, "hour")
    .toDate();
  const end = moment(start).add(10, "months").add(12, "hour").toDate();
  return { start, end };
};

export const DEFAULT_KPI_INITIAL_DATE_RANGE = {
  start: moment().startOf("month").toDate(),
  end: moment().endOf("month").toDate(),
};
