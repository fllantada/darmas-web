import moment from "moment";
import { create } from "zustand";

import { DateRange } from "@/lib/types";

import {
  getDayVisibleWindow,
  getMonthVisibleWindow,
  TService,
  ViewTimeScale,
} from "../domain/interfaces";
import { formatServiceData, hasVisibleVoyage } from "../utils";
import { initialStore, TActions, TStore } from "./storeConfig";

export const useServiceTimeline = create<TStore & TActions>((set, get) => ({
  ...initialStore,

  initializeServiceTimelineStore: (service: TService) => {
    const allVessels = service.vessels;
    const visibleVessels = allVessels.filter(vessel => {
      return hasVisibleVoyage(vessel, get().visibleWindow);
    });
    const [timelineItems, timelineGroups] = formatServiceData(visibleVessels);

    set({
      ...initialStore,
      serviceName: service.serviceName,
      serviceCode: service.serviceCode,
      allVessels,
      visibleVessels,
      timelineItems,
      timelineGroups,
    });
  },

  selectKpiDate: (newSelectedRange: DateRange) => {
    set(state => ({ ...state, kpiSelectedDate: newSelectedRange }));
  },

  doneGoToSelected: () => {
    set(state => ({ ...state, goToSelectedFlag: false }));
  },
  changeViewMode: mode => {
    set(state => ({ ...state, viewMode: mode }));
  },

  moveTimelineToWindow: ({ start: newStart, end: newEnd }) => {
    const { allVessels } = get();

    const newVisibleItems = allVessels.filter(vessel =>
      hasVisibleVoyage(vessel, { start: newStart, end: newEnd }),
    );

    const [timelineItems, timelineGroups] = formatServiceData(newVisibleItems);

    set(state => ({
      ...state,
      visibleVessels: newVisibleItems,
      visibleWindow: { start: newStart, end: newEnd },
      timelineItems,
      timelineGroups,
    }));
  },
  changeTimeScaleToDay: () => {
    // change visible vessels
    const { viewTimeScale, kpiSelectedDate } = get();
    if (viewTimeScale === ViewTimeScale.Day) return;

    const newWindow = getDayVisibleWindow(kpiSelectedDate.start);

    const newKpiSelectedDate = {
      start: moment(kpiSelectedDate.start).startOf("day").toDate(),
      end: moment(kpiSelectedDate.start).endOf("day").toDate(),
    };

    set(state => ({
      ...state,
      visibleWindow: newWindow,
      viewTimeScale: ViewTimeScale.Day,
      kpiSelectedDate: newKpiSelectedDate,
    }));
  },

  changeTimeScaleToMonth: () => {
    // change visible vessels
    const { viewTimeScale } = get();
    if (viewTimeScale === ViewTimeScale.Month) return;
    const newWindow = getMonthVisibleWindow(get().kpiSelectedDate.start);
    const newKpiSelectedDate = {
      start: moment(get().kpiSelectedDate.start).startOf("month").toDate(),
      end: moment(get().kpiSelectedDate.end).endOf("month").toDate(),
    };

    set(state => ({
      ...state,
      viewTimeScale: ViewTimeScale.Month,
      visibleWindow: newWindow,
      kpiSelectedDate: newKpiSelectedDate,
    }));
  },
  moveToToday: () => {
    const { moveTimelineToWindow, viewTimeScale } = get();

    if (viewTimeScale === ViewTimeScale.Month) {
      const newWindowStart = moment(new Date())
        .startOf("month")
        .subtract(3, "months")
        .subtract(1, "hour")
        .toDate();
      const newWindowEnd = moment(newWindowStart)
        .add(10, "months")
        .add(12, "hour")
        .toDate();
      moveTimelineToWindow({ start: newWindowStart, end: newWindowEnd });
    }

    if (viewTimeScale === ViewTimeScale.Day) {
      const newWindowStart = moment(new Date())
        .startOf("day")
        .subtract(3, "days")
        .toDate();
      const newWindowEnd = moment(newWindowStart).add(13, "days").toDate();
      moveTimelineToWindow({ start: newWindowStart, end: newWindowEnd });
    }

    set(state => ({
      ...state,
      goToSelectedFlag: true,
    }));
  },
}));
