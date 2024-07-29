import { VoyageType } from "@/generated/graphql";
import moment from "moment";
import { TimelineItem } from "vis-timeline/standalone";

import { VesselStatus } from "@/app/plataform/globalDomain/vesselStatus";
import { DateRange } from "@/app/plataform/lib/types";

import {
  ViewTimeScale,
  VoyageBlock,
} from "../sections/timeline/domain/interfaces";

export const createItemFromBlocks = (blocks: VoyageBlock[]): TimelineItem[] => {
  const items: TimelineItem[] = [];

  blocks.forEach(block => {
    switch (block.status) {
      case VesselStatus.Start:
        break;
      case VesselStatus.End:
        break;
      case VesselStatus.Port:
        items.push(createAtPortItem(block));
        break;
      case VesselStatus.Passage:
        items.push(createAtSeaItem(block));
        break;
      case VesselStatus.Waiting:
        items.push(createWaitingItem(block));
        break;
      case VesselStatus.WaitingAfterBerth:
        items.push(createWaitingItem(block));
        break;
      case VesselStatus.WaitingBeforeBerth:
        items.push(createWaitingItem(block));
        break;

      default:
        break;
    }
  });

  return items;
};

const createAtPortItem = (block: VoyageBlock): TimelineItem => {
  const {
    vesselCode,
    voyageNumber,

    atPort,
    startTime,
    endTime,
    delta,
    blockNumber,
  } = block;
  const isFutureItem = moment(startTime).isAfter(moment());
  const item = {
    id: `${vesselCode}-${voyageNumber}-${blockNumber + 1}-${"port"}`,
    group: voyageNumber,
    start: startTime,
    end: endTime,
    content: `<span>${atPort}</span>`,
    title: getCallTooltipContent(
      VesselStatus.Port,
      delta,
      startTime,
      endTime,
      atPort,
    ),
    className: "call-status-port " + (isFutureItem ? "future-item" : ""),
    style: "height: 45px;",
    selectable: true,
  };
  return item;
};

const createAtSeaItem = (block: VoyageBlock): TimelineItem => {
  const {
    vesselCode,
    voyageNumber,
    atPort,
    startTime,
    endTime,
    delta,
    blockNumber,
  } = block;
  const isFutureItem = moment(startTime).isAfter(moment());
  const item = {
    id: `${vesselCode}-${voyageNumber}-${blockNumber + 1}-${"sea"}`,
    group: voyageNumber,
    start: startTime,
    end: endTime,
    content: ``,
    title: getCallTooltipContent(
      VesselStatus.Passage,
      delta,
      startTime,
      endTime,
      atPort,
    ),
    className: "call-status-passage " + (isFutureItem ? "future-item" : ""),
    style: "height: 45px;",
    selectable: true,
  };
  return item;
};

const createWaitingItem = (block: VoyageBlock): TimelineItem => {
  const {
    vesselCode,
    voyageNumber,
    atPort,
    startTime,
    endTime,
    delta,
    blockNumber,
  } = block;

  const isFutureItem = moment(startTime).isAfter(moment());

  const item = {
    id: `${vesselCode}-${voyageNumber}-${blockNumber + 1}-${"waiting"}`,
    group: voyageNumber,
    start: startTime,
    end: endTime,
    content: ``,
    title: getCallTooltipContent(
      VesselStatus.Waiting,
      delta,
      startTime,
      endTime,
      atPort,
    ),
    className: "call-status-waiting " + (isFutureItem ? "future-item" : ""),
    style: "height: 45px;",
    selectable: false,
  };

  return item;
};

const getCallTooltipContent = (
  status: VesselStatus,
  delta?: string,
  start?: Date,
  end?: Date,
  portCode?: string,
): string => {
  const notDeltaAvailable = delta === undefined;

  return `<div class="flex-col items-center">
      <div>${status === VesselStatus.Port ? "At Port – " + portCode : status}</div>
      <div>
        ${
          status !== VesselStatus.Waiting
            ? `Delta: ${notDeltaAvailable ? "--" : formatDelta(delta)}`
            : status == VesselStatus.Waiting
              ? `Waiting Time: ${start && end ? `${moment(end).diff(moment(start), "hours")} hrs` : `--`}`
              : ""
        }
      </div>
    </div>`;
};
export const getMiddleDateBetween = (startTime: Date, endTime: Date): Date => {
  const start = moment(startTime);
  const end = moment(endTime);
  const middle = start.add(end.diff(start) / 2, "milliseconds");
  return middle.toDate();
};

const formatDelta = (delta: string): string => {
  const deltaNumber = parseInt(delta);

  const deltaString = `${Math.abs(deltaNumber) < 1 ? "On Time" : Math.abs(deltaNumber) + " D " + (deltaNumber < 0 ? "Early" : "Late")}`;
  return deltaString;
};

export const calculateMonthWindowRange = (items: TimelineItem[]): DateRange => {
  const monthWindowRange = items.reduce(
    (acc, item) => {
      const itemEnd = item.end ? moment(item.end) : undefined;
      const itemStart = item.start ? moment(item.start) : undefined;

      if (itemEnd && itemEnd.isAfter(acc.end)) {
        acc.end = moment(item.end);
      }
      if (itemStart && itemStart.isBefore(acc.start)) {
        acc.start = moment(item.start);
      }
      return acc;
    },
    { start: moment(items[0].start), end: moment(items[0].start) },
  );

  return {
    start: monthWindowRange.start.subtract(1, "week").toDate(),
    end: monthWindowRange.end.add(1, "week").toDate(),
  };
};

export const calculateDayWindowRange = (
  vesselVoyage: VoyageType,
): DateRange => {
  const states = vesselVoyage.vesselStates;
  let middleDateOfRange = moment(new Date());
  const haveVesselStates = states.length > 0;
  const dontHaveVesselStates = !haveVesselStates;
  const today = moment(new Date());
  if (haveVesselStates) {
    const { minDate, maxDate } = states.reduce(
      (acc, item) => {
        const itemTs = item.statusTs ? moment(item.statusTs) : undefined;
        if (!itemTs) return acc;
        if (itemTs.isAfter(acc.maxDate)) {
          acc.maxDate = itemTs;
        }
        if (itemTs.isBefore(acc.minDate)) {
          acc.minDate = itemTs;
        }
        return acc;
      },
      {
        minDate: moment(states[0].statusTs),
        maxDate: moment(states[states.length - 1].statusTs),
      },
    );

    const difference = maxDate.diff(minDate, "days");

    middleDateOfRange =
      today.isAfter(maxDate) || today.isBefore(minDate)
        ? moment(minDate).add(difference / 2, "days")
        : today;
  }
  if (dontHaveVesselStates) {
    const endDate = moment(vesselVoyage.endDate);
    const startDate = moment(vesselVoyage.startDate);
    const difference = moment(endDate).diff(startDate, "days");

    middleDateOfRange =
      today.isAfter(endDate) || today.isBefore(startDate)
        ? moment(startDate).add(difference / 2, "days")
        : today;
  }
  const dayWindowRange = {
    start: moment(middleDateOfRange)
      .startOf("day")
      .subtract(6, "days")
      .subtract(1, "hour")
      .toDate(),
    end: moment(middleDateOfRange)
      .startOf("day")
      .add(7, "days")
      .add(1, "hour")
      .toDate(),
  };

  return dayWindowRange;
};

export const createStartItem = (
  id: string,
  group: string,
  diffInMonths: number,
  startDate: Date,
  timeScale: ViewTimeScale,
): TimelineItem => {
  let hoursAddedToIndicators;
  if (timeScale === ViewTimeScale.Day) hoursAddedToIndicators = 8;
  else hoursAddedToIndicators = diffInMonths > 1 ? diffInMonths * 25 : 28;

  const startOfIndicator = moment(startDate)
    .subtract(hoursAddedToIndicators, "hours")
    .toDate();

  const item = {
    id,
    group,
    start: startOfIndicator,
    end: startDate,
    content: `<span>S</span>`,
    title: `<div class="flex-col items-center">\n    <div>Voyage Start</div>\n    <div>\n Time     ${moment(startDate).format("DD/MM/YY")}   \n    </div>\n<div>\n     Stamp     ${moment(startDate).format("HH:mm")} \n    </div><div>      \n    </div>  </div>`,
    className: "start-item",
    style: `height: 45px;`,
    selectable: false,
  };

  return item;
};

export const createEndItem = (
  id: string,
  group: string,
  diffInMonths: number,
  endDate: Date,
  timeScale: ViewTimeScale,
): TimelineItem => {
  let hoursAddedToIndicators;
  if (timeScale === ViewTimeScale.Day) hoursAddedToIndicators = 8;
  else hoursAddedToIndicators = diffInMonths > 1 ? diffInMonths * 25 : 28;

  const endOfIndicator = moment(endDate)
    .add(hoursAddedToIndicators, "hours")
    .toDate();

  const item = {
    id,
    group,
    start: endDate,
    end: endOfIndicator,
    content: `<span>E</span>`,
    title: `<div class="flex-col items-center">\n    <div>Voyage End</div>\n    <div>\n Time     ${moment(endDate).format("DD/MM/YY")}   \n    </div>\n<div>\n     Stamp     ${moment(endDate).format("HH:MM")} \n    </div><div>      \n    </div>  </div>`,
    className: "end-item",
    style: `height: 45px;`,
    selectable: true,
  };

  return item;
};
