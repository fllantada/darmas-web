import moment from "moment";
import { TimelineOptions } from "vis-timeline";

import { ViewTimeScale } from "../domain/interfaces";

export const BASE_TIMELINE_OPTIONS: TimelineOptions = {
  showMajorLabels: true,
  showMinorLabels: true,
  showCurrentTime: false,
  timeAxis: {
    scale: "hour",
    step: 8,
  },
  locale: "en",
  moveable: true,
  rollingMode: { follow: false },
  zoomable: false,
  type: "range",
  orientation: "top",
  stack: false,
  selectable: true,
  format: {
    minorLabels: (date: Date) => `<span>${moment(date).format("HH:mm")}</span>`,
    majorLabels: (date: Date) =>
      `<span>${moment(date).format("DD-MMM").toUpperCase()}</span>` +
      (moment(date).dayOfYear() === moment().dayOfYear() &&
      moment(date).year() === moment().year()
        ? `<span>Today</span>`
        : ""),
  },
  tooltip: {
    followMouse: true,
    delay: 0,
  },
  align: "center",
  margin: 0,
  verticalScroll: false,
  horizontalScroll: true,
  groupHeightMode: "fixed",
};

export const TIMELINE_MONTH_VIEW: TimelineOptions = {
  ...BASE_TIMELINE_OPTIONS,
  timeAxis: {
    scale: "week",
    step: 1,
  },
  format: {
    minorLabels: (date: Date) => getWeek(moment(date)) ?? "",
    majorLabels: (date: Date) =>
      `<span>${moment(date).format("MMM YYYY")}</span>` +
      (moment(date).month() === moment().month() &&
      moment(date).year() === moment().year()
        ? `<span>Now</span>`
        : ""),
  },
};

function getWeek(date: moment.Moment): string | undefined {
  const currentDate = moment(date);

  const endLimit = currentDate.clone().add(3, "days");
  const monthOfEndLimit = endLimit.clone().month() + 1;
  const monthOfCurrentDate = currentDate.clone().month() + 1;
  if (monthOfCurrentDate !== monthOfEndLimit) return;

  const startLimit = currentDate.clone().add(3, "days");
  if (!currentDate.isSame(startLimit, "week")) return;

  const firstDayOfYear = moment(date).startOf("year");
  const pastDaysOfYear = date.diff(firstDayOfYear, "days");
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.day() + 1) / 7);

  return `<span>${weekNumber}</span>`;
}

export const getTimelineOptions = (
  timeScale: ViewTimeScale,
): TimelineOptions => {
  return timeScale === "day" ? BASE_TIMELINE_OPTIONS : TIMELINE_MONTH_VIEW;
};
