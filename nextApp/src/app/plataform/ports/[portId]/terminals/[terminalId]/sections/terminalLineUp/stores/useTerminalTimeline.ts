import moment from "moment";
import { create } from "zustand";

import { DateRange } from "@/app/plataform/lib/types";

import {
  INITIAL_VISIBLE_WINDOW,
  TVesselArrivingTerminal,
  ViewMode,
} from "../domain/interfaces";

interface TStore {
  visibleVessels: TVesselArrivingTerminal[];
  visibleWindow: DateRange;
  allVessels: TVesselArrivingTerminal[];
  goToTodayFlag: boolean;
  viewMode: ViewMode;
}
const defaultState: TStore = {
  visibleVessels: [],
  allVessels: [],
  visibleWindow: INITIAL_VISIBLE_WINDOW,
  goToTodayFlag: false,
  viewMode: ViewMode.Timeline,
};

interface TActions {
  initializePortTimelineStore: (items: TVesselArrivingTerminal[]) => void;
  moveTimelineToWindow: (range: DateRange) => void;
  moveToInitialWindow: () => void;
  doneGoToToday: () => void;
  changeViewMode: (mode: ViewMode) => void;
  resetPortTimelineStore: () => void;
}

export const useTerminalTimeline = create<TStore & TActions>((set, get) => ({
  visibleVessels: [],
  allVessels: [],
  viewMode: ViewMode.Timeline,
  goToTodayFlag: false,
  visibleWindow: INITIAL_VISIBLE_WINDOW,

  initializePortTimelineStore: (allVessels: TVesselArrivingTerminal[]) => {
    const orderedVessels = allVessels.sort((a, b) =>
      moment(a.start).diff(moment(b.start)),
    );

    const visibleVessels = allVessels.filter(vessel => {
      return (
        moment(vessel.end) > moment(INITIAL_VISIBLE_WINDOW.start) &&
        moment(vessel.start) < moment(INITIAL_VISIBLE_WINDOW.end)
      );
    });

    set(state => ({
      ...state,
      allVessels: orderedVessels,
      visibleVessels,
    }));
  },
  moveToInitialWindow: () => {
    get().moveTimelineToWindow(INITIAL_VISIBLE_WINDOW);
    set(state => ({
      ...state,
      goToTodayFlag: true,
    }));
  },
  resetPortTimelineStore: () => {
    set(defaultState);
  },

  doneGoToToday: () => {
    set(state => ({ ...state, goToTodayFlag: false }));
  },
  changeViewMode: mode => {
    set(state => ({ ...state, viewMode: mode }));
  },

  moveTimelineToWindow: ({ start: newStart, end: newEnd }) => {
    const { allVessels, visibleVessels } = get();

    const newVisibleItems = allVessels.filter(vessel => {
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
}));
