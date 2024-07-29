import { AtPortKpIsType, AtSeaKpIsType, VoyageType } from "@/generated/graphql";
import moment from "moment";
import { TimelineGroup, TimelineItem } from "vis-timeline/standalone";
import { create } from "zustand";

import {
  calculateRotationType,
  RotationType,
} from "@/app/plataform/globalDomain/rotationTypes";
import { DateRange, LoadingState } from "@/app/plataform/lib/types";

import {
  getRotationEndKpis,
  getTimeDepedentKpis,
} from "../sections/rotationKpis/actions";
import { EndRotationKpis } from "../sections/rotationKpis/domain/interfaces";
import {
  ScheduleView,
  ViewTimeScale,
  VoyageBlock,
} from "../sections/timeline/domain/interfaces";
import { voyageBlockAdapter } from "../sections/timeline/domain/voyageBlockAdapter";
import {
  calculateDayWindowRange,
  calculateMonthWindowRange,
  createEndItem,
  createItemFromBlocks,
  createStartItem,
  getMiddleDateBetween,
} from "./createItemsHelper";

interface TStore {
  timeScale: ViewTimeScale;
  timelineItems: TimelineItem[];
  monthViewItems: TimelineItem[];
  monthWindowRange: DateRange;
  dayWindowRange: DateRange;
  isPartnerSelected: boolean;
  isFutureSelected: boolean;
  timelineGroups: TimelineGroup[];
  kpiTimeSelected: Date;
  selectedItem: TimelineItem;
  loadingKpiStatus: LoadingState;
  seaRotationKpis?: AtSeaKpIsType;
  portRotationKpis?: AtPortKpIsType;
  endRotationKpis?: EndRotationKpis;
  selectedDate: Date;
  allVoyages: VoyageType[];
  vesselVoyage?: VoyageType;
  vesselCode: string;
  prevVesselVoyage?: VoyageType;
  nextVesselVoyage?: VoyageType;
  rotationHasEnd: boolean;
  rotationHasStart: boolean;
  rotationType?: RotationType;
  scheduleView: ScheduleView;
  actualVoyageBlocks: VoyageBlock[];
}

interface TActions {
  selectItem(port: string): Promise<void>;
  unSelectItem(): void;
  changeTimeScaleToDay: () => void;
  changeTimeScaleToMonth: () => void;
  initializeRotationStore(
    vesselVoyage: VoyageType,
    prevVesselVoyage?: VoyageType,
    nextVesselVoyage?: VoyageType,
  ): void;
  cleanRotationStore(): void;
  startLoadingKpi(): void;
  changeSelectedDate(date: Date): void;
  changeView(view: ScheduleView): void;
}

const initialState = {
  timeScale: ViewTimeScale.Month,
  selectedItem: {} as TimelineItem,
  scheduleView: ScheduleView.Timeline,
  actualVoyageBlocks: [],
  kpiTimeSelected: new Date(),
  selectedDate: new Date(),
  rotationHasStart: false,
  isFutureSelected: false,
  monthWindowRange: { start: new Date(), end: new Date() },
  monthViewItems: [],
  dayWindowRange: { start: new Date(), end: new Date() },
  rotationHasEnd: false,
  vesselVoyage: undefined,
  allVoyages: [],
  timelineItems: [],
  vesselCode: "",
  isPartnerSelected: false,
  timelineGroups: [],
  loadingKpiStatus: LoadingState.SUCCESS,
  rotationType: undefined,
  seaRotationKpis: undefined,
  portRotationKpis: undefined,
  endRotationKpis: undefined,
  prevVesselVoyage: undefined,
  nextVesselVoyage: undefined,
};

export const useRotationStore = create<TStore & TActions>((set, get) => ({
  ...initialState,

  initializeRotationStore: (
    vesselVoyage,
    prevVesselVoyage,
    nextVesselVoyage,
  ) => {
    const allVoyages = [vesselVoyage];
    const hasPrevVoyage = !!prevVesselVoyage;
    const hasNextVoyage = !!nextVesselVoyage;

    const allItems = [] as TimelineItem[];
    const allGroups = [] as TimelineGroup[];

    //  PREV

    let prevStart;
    let prevEnd;
    let diffInMonths = 0;
    let prevVesselCode: string = "";
    let prevVoyageNumber: string = "";
    if (hasPrevVoyage) {
      allVoyages.unshift(prevVesselVoyage);
      const {
        blocks: prevVoyageBlocks,
        start,
        end,
      } = voyageBlockAdapter(prevVesselVoyage.voyageBlocks);
      prevStart = start;
      prevEnd = end;

      diffInMonths = moment(prevEnd).diff(moment(prevStart), "months");

      const prevVoyageItems = createItemFromBlocks(prevVoyageBlocks);

      prevVoyageNumber = `${prevVoyageBlocks[0].voyageNumber}`;
      prevVesselCode = prevVoyageBlocks[0].vesselCode;
      const prevVoyageGroup = {
        id: prevVoyageNumber,
        content: `${prevVesselCode}${prevVoyageNumber}`,
      };

      allItems.push(...prevVoyageItems);
      allGroups.push(prevVoyageGroup);
    }

    //  ACTUAL

    const actual = {
      start: new Date(),
      end: new Date(),
    };

    const {
      blocks: actualVoyageBlocks,
      start,
      end,
    } = voyageBlockAdapter(vesselVoyage.voyageBlocks);
    actual.start = start;
    actual.end = end;
    const actualVoyageItems = createItemFromBlocks(actualVoyageBlocks);
    const actualVoyageNumber = `${actualVoyageBlocks[0].voyageNumber}`;
    const actualVesselCode = actualVoyageBlocks[0].vesselCode;
    const actualVoyageGroup = {
      id: actualVoyageNumber,
      content: `${actualVesselCode}${actualVoyageNumber}`,
    };

    allItems.push(...actualVoyageItems);
    allGroups.push(actualVoyageGroup);

    diffInMonths =
      diffInMonths + moment(actual.end).diff(moment(actual.start), "months");

    //  NEXT

    let nextStart;
    let nextEnd;
    let nextVesselCode: string = "";
    let nextVoyageNumber: string = "";

    if (hasNextVoyage) {
      allVoyages.push(nextVesselVoyage);
      const {
        start,
        end,
        blocks: nextVoyageBlocks,
      } = nextVesselVoyage && voyageBlockAdapter(nextVesselVoyage.voyageBlocks);
      const nextVoyageItems = createItemFromBlocks(nextVoyageBlocks);
      nextStart = start;
      nextEnd = end;
      nextVoyageNumber = `${nextVoyageBlocks[0].voyageNumber}`;
      nextVesselCode = nextVoyageBlocks[0].vesselCode;
      const nextVoyageGroup = {
        id: nextVoyageNumber,
        content: `${nextVesselCode}${nextVoyageNumber}`,
      };
      allItems.push(...nextVoyageItems);
      allGroups.push(nextVoyageGroup);

      diffInMonths =
        diffInMonths + moment(nextEnd).diff(moment(nextStart), "months");
    }

    // add start and End items

    if (hasPrevVoyage && prevStart) {
      const startId = `${prevVesselCode}-${prevVoyageNumber}-start`;

      const startItem = createStartItem(
        startId,
        prevVoyageNumber,
        diffInMonths,
        prevStart,
        ViewTimeScale.Month,
      );
      allItems.push(startItem);

      if (prevEnd) {
        const endId = `${prevVesselCode}-${prevVoyageNumber}-end`;
        const endItem = createEndItem(
          endId,
          prevVoyageNumber,
          diffInMonths,
          prevEnd,
          ViewTimeScale.Month,
        );
        allItems.push(endItem);
      }
    }

    const startId = `${actualVesselCode}-${actualVoyageNumber}-start`;
    const startItem = createStartItem(
      startId,
      actualVoyageNumber,
      diffInMonths,
      actual.start,
      ViewTimeScale.Month,
    );
    allItems.push(startItem);

    const endId = `${actualVesselCode}-${actualVoyageNumber}-end`;
    const endItem = createEndItem(
      endId,
      actualVoyageNumber,
      diffInMonths,
      actual.end,
      ViewTimeScale.Month,
    );
    allItems.push(endItem);

    if (hasNextVoyage && nextStart) {
      const startId = `${nextVesselCode}-${nextVoyageNumber}-start`;
      const startItem = createStartItem(
        startId,
        nextVoyageNumber,
        diffInMonths,
        nextStart,
        ViewTimeScale.Month,
      );
      allItems.push(startItem);
      if (nextEnd) {
        const endId = `${nextVesselCode}-${nextVoyageNumber}-end`;
        const endItem = createEndItem(
          endId,
          nextVoyageNumber,
          diffInMonths,
          nextEnd,
          ViewTimeScale.Month,
        );
        allItems.push(endItem);
      }
    }

    const monthWindowRange = calculateMonthWindowRange(allItems);

    const dayWindowRange = calculateDayWindowRange(vesselVoyage);
    const rotationType = calculateRotationType(vesselVoyage.vesselCode);

    const rotationHasStart = moment(actual.start).isBefore(moment());
    const rotationHasEnd = moment(actual.end).isBefore(moment());

    set(state => {
      return {
        ...state,
        allVoyages: allVoyages,
        actualVoyageBlocks,
        vesselCode: vesselVoyage.vesselCode,
        vesselVoyage: vesselVoyage,
        prevVesselVoyage,
        nextVesselVoyage,
        scheduleView: ScheduleView.Timeline,
        rotationHasStart,
        rotationHasEnd,
        timelineItems: allItems,
        monthViewItems: allItems,
        monthWindowRange,
        dayWindowRange,
        rotationType,
        timelineGroups: allGroups,
        kpiTimeSelected: new Date(),
        portSelected: {} as TimelineItem,
        loadingKpiStatus: LoadingState.SUCCESS,
        seaRotationKpis: undefined,
        portRotationKpis: undefined,
        endRotationKpis: undefined,
      };
    });
  },
  changeTimeScaleToDay: () => {
    const { timelineItems } = get();

    const newItems = timelineItems.map(item => {
      const isStartItem =
        item.id.toString().split("-").reverse()[0] === "start";
      const isEndItem = item.id.toString().split("-").reverse()[0] === "end";

      if (isStartItem) {
        const newStartTime = moment(item.end).subtract(16, "hours").toDate();
        return { ...item, start: newStartTime };
      }
      if (isEndItem) {
        const newEndTime = moment(item.start).add(16, "hours").toDate();
        return { ...item, end: newEndTime };
      }

      return item;
    });

    set(state => ({
      ...state,
      timelineItems: newItems,
      monthViewItems: timelineItems,
      timeScale: ViewTimeScale.Day,
    }));
  },
  changeTimeScaleToMonth: () => {
    const timelineItems = get().monthViewItems;

    set(state => ({
      ...state,
      timelineItems: timelineItems,
      timeScale: ViewTimeScale.Month,
    }));
  },

  unSelectItem: () => {
    set(state => ({
      ...state,
      seaKpiData: undefined,
      portKpiData: undefined,
      endRotationKpis: undefined,
      isPartnerSelected: false,
      isFutureSelected: false,
      loadingKpiStatus: LoadingState.SUCCESS,
      portSelected: {} as TimelineItem,
    }));
  },

  startLoadingKpi: () => {
    set(state => ({ ...state, loadingKpiStatus: LoadingState.LOADING }));
  },

  selectItem: async itemId => {
    const { startLoadingKpi, timelineItems, rotationType } = get();

    if (!itemId) return;

    try {
      startLoadingKpi();

      const selectedItem = timelineItems.find(item => item.id === itemId);

      if (!selectedItem) throw new Error();

      const kpiTime = getMiddleDateBetween(
        moment(selectedItem.start).toDate(),
        moment(selectedItem.end).toDate(),
      );

      const [vesselCode, voyageNo] = selectedItem?.id.toString().split("-") as [
        string,
        string,
      ];

      const itemType = selectedItem?.id.toString().split("-").reverse()[0];

      if (rotationType === RotationType.PARTNER) {
        set(state => {
          return {
            ...state,
            selectedItem,
            loadingKpiStatus: LoadingState.SUCCESS,
            portRotationKpis: undefined,
            seaRotationKpis: undefined,
            isPartnerSelected: true,
            isFutureSelected: false,
            endRotationKpis: undefined,
            kpiTimeSelected: kpiTime,
          };
        });

        return;
      }

      if (moment(selectedItem.start).isAfter(moment())) {
        set(state => {
          return {
            ...state,
            selectedItem,
            loadingKpiStatus: LoadingState.SUCCESS,
            portRotationKpis: undefined,
            seaRotationKpis: undefined,
            isPartnerSelected: false,
            isFutureSelected: true,
            endRotationKpis: undefined,

            kpiTimeSelected: kpiTime,
          };
        });
        return;
      }

      if (itemType === "end") {
        const endRotationKpis = await getRotationEndKpis(
          selectedItem.id.toString(),
        );

        set(state => {
          return {
            ...state,
            selectedItem,

            loadingKpiStatus: LoadingState.SUCCESS,
            endRotationKpis: endRotationKpis,
            seaRotationKpis: undefined,
            isFutureSelected: false,
            isPartnerSelected: false,
            portRotationKpis: undefined,
            kpiTimeSelected: kpiTime,
          };
        });
        return;
      }
      if (itemType === "port") {
        const portKpis = await getTimeDepedentKpis(
          voyageNo,
          vesselCode,
          kpiTime,
        );

        set(state => {
          return {
            ...state,
            selectedItem,
            loadingKpiStatus: LoadingState.SUCCESS,
            portRotationKpis: portKpis as AtPortKpIsType,
            isPartnerSelected: false,
            isFutureSelected: false,
            seaRotationKpis: undefined,
            endRotationKpis: undefined,
            kpiTimeSelected: kpiTime,
          };
        });

        return;
      }
      if (itemType === "sea") {
        const seaKpis = await getTimeDepedentKpis(
          voyageNo,
          vesselCode,
          kpiTime,
        );

        set(state => {
          return {
            ...state,
            selectedItem,
            loadingKpiStatus: LoadingState.SUCCESS,
            seaRotationKpis: seaKpis as AtSeaKpIsType,
            portRotationKpis: undefined,
            isPartnerSelected: false,
            isFutureSelected: false,
            endRotationKpis: undefined,
            kpiTimeSelected: kpiTime,
          };
        });

        return;
      }
    } catch (error) {
      set(state => {
        return {
          ...state,
          loadingKpiStatus: LoadingState.FAILED,
        };
      });
    }
  },
  cleanRotationStore: () => {
    set(() => initialState);
  },
  changeView: view => {
    set(state => {
      return {
        ...state,
        scheduleView: view,
      };
    });
  },
  changeSelectedDate: date => {
    set(state => {
      return {
        ...state,
        selectedDate: date,
      };
    });
  },
}));
