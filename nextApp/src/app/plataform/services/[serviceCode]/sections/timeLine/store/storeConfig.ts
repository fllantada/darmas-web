import { TimelineGroup, TimelineItem } from "vis-timeline/standalone";

import { DateRange } from "@/app/plataform/lib/types";

import {
  DEFAULT_KPI_INITIAL_DATE_RANGE,
  getMonthVisibleWindow,
  TService,
  TServiceVessel,
  ViewMode,
  ViewTimeScale,
} from "../domain/interfaces";

export interface TStore {
  serviceName: string;
  serviceCode: string;
  allVessels: TServiceVessel[];
  visibleVessels: TServiceVessel[];
  visibleWindow: DateRange;
  kpiSelectedDate: DateRange;
  goToSelectedFlag: boolean;
  viewMode: ViewMode;
  viewTimeScale: ViewTimeScale;

  timelineItems: TimelineItem[];
  timelineGroups: TimelineGroup[];
}

export interface TActions {
  initializeServiceTimelineStore: (service: TService) => void;

  moveTimelineToWindow: (range: DateRange) => void;
  doneGoToSelected: () => void;
  changeViewMode: (mode: ViewMode) => void;
  changeTimeScaleToDay: () => void;
  changeTimeScaleToMonth: () => void;
  moveToToday: () => void;
  selectKpiDate: (newSelectedRange: DateRange) => void;
}
export const initialStore: TStore = {
  serviceName: "",
  serviceCode: "",
  visibleVessels: [],
  viewTimeScale: ViewTimeScale.Month,
  viewMode: ViewMode.Timeline,
  allVessels: [],
  goToSelectedFlag: false,
  visibleWindow: getMonthVisibleWindow(new Date()),
  timelineItems: [],
  timelineGroups: [],
  kpiSelectedDate: DEFAULT_KPI_INITIAL_DATE_RANGE,
};
