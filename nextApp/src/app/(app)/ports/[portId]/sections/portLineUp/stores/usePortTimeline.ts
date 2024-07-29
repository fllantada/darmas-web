import { RotationType } from "@/globalDomain/rotationTypes";
import moment from "moment";
import { create } from "zustand";

import { DateRange } from "@/lib/types";

import {
  FilterConditions,
  INITIAL_VISIBLE_WINDOW,
  TVesselArrivingPort,
  ViewMode,
} from "../domain/interfaces";

interface TStore {
  allVessels: TVesselArrivingPort[];
  filteredVessels: TVesselArrivingPort[];
  visibleVessels: TVesselArrivingPort[];
  visibleWindow: DateRange;
  goToTodayFlag: boolean;
  viewMode: ViewMode;
  proformaEnable: boolean;
}

interface TActions {
  initializePortTimelineStore: (items: TVesselArrivingPort[]) => void;
  moveTimelineToWindow: (range: DateRange) => void;
  moveToInitialWindow: () => void;
  doneGoToToday: () => void;
  changeViewMode: (mode: ViewMode) => void;
  enableProforma: () => void;
  disableProforma: () => void;
  filterVessels: (filter: FilterConditions) => void;
}

export const usePortTimeline = create<TStore & TActions>((set, get) => ({
  allVessels: [],
  filteredVessels: [],
  visibleVessels: [],
  viewMode: ViewMode.Timeline,
  goToTodayFlag: false,
  visibleWindow: INITIAL_VISIBLE_WINDOW,
  proformaEnable: false,

  initializePortTimelineStore: (allVessels: TVesselArrivingPort[]) => {
    const orderedVessels = allVessels.sort((a, b) =>
      moment(a.start).diff(moment(b.start)),
    );

    const visibleVessels = orderedVessels.filter(vessel => {
      return (
        moment(vessel.end) > moment(INITIAL_VISIBLE_WINDOW.start) &&
        moment(vessel.start) < moment(INITIAL_VISIBLE_WINDOW.end)
      );
    });

    set(state => ({
      ...state,
      allVessels: orderedVessels,
      filteredVessels: orderedVessels,
      visibleVessels: visibleVessels,
      goToTodayFlag: false,
      visibleWindow: INITIAL_VISIBLE_WINDOW,
      proformaEnable: false,
      viewMode: ViewMode.Timeline,
    }));
  },
  enableProforma: () => {
    set(state => ({ ...state, proformaEnable: true }));
  },
  disableProforma: () => {
    set(state => ({ ...state, proformaEnable: false }));
  },
  moveToInitialWindow: () => {
    get().moveTimelineToWindow(INITIAL_VISIBLE_WINDOW);
    set(state => ({
      ...state,
      goToTodayFlag: true,
    }));
  },

  doneGoToToday: () => {
    set(state => ({ ...state, goToTodayFlag: false }));
  },
  changeViewMode: mode => {
    set(state => ({ ...state, viewMode: mode }));
  },

  moveTimelineToWindow: ({ start: newStart, end: newEnd }) => {
    const { filteredVessels, visibleVessels } = get();

    const newVisibleItems = filteredVessels.filter(vessel => {
      return (
        moment(vessel.end) > moment(newStart) &&
        moment(vessel.start) < moment(newEnd)
      );
    });

    if (JSON.stringify(newVisibleItems) === JSON.stringify(visibleVessels))
      return;

    set(state => ({
      ...state,
      visibleVessels: newVisibleItems,
      visibleWindow: { start: newStart, end: newEnd },
    }));
  },
  filterVessels: (filter: FilterConditions) => {
    const { allVessels, visibleWindow } = get();
    const filteredVessels = allVessels.filter(vessel => {
      if (filter.Operated && vessel.vesselType === RotationType.OPERATED)
        return true;
      if (filter.Partner && vessel.vesselType === RotationType.PARTNER)
        return true;
      if (filter.Others && vessel.vesselType === RotationType.OTHERS)
        return true;
      return false;
    });

    set(state => ({
      ...state,
      filteredVessels: filteredVessels,
    }));
    get().moveTimelineToWindow(visibleWindow);
  },
}));
