import moment from "moment";
import { TimelineOptions } from "vis-timeline/types";

import { ViewTimeScale } from "../domain/interfaces";
import { getSliderRange } from "../utils";

import "./Timeline.css";
import "./Sliders.css";

export const DAY_TIMELINE_OPTIONS: TimelineOptions = {
  showMajorLabels: true,
  showMinorLabels: true,
  showCurrentTime: false,
  timeAxis: {
    scale: "hour",
    step: 8,
  },
  min: moment()
    .startOf("month")
    .subtract(11, "month")
    .subtract(1, "day")
    .toDate(),
  max: moment().endOf("month").add(6, "month").add(1, "day").toDate(),
  locale: "en",
  moveable: true,
  rollingMode: { follow: false },
  zoomable: false,
  type: "range",
  orientation: "top",
  stack: false,
  selectable: false,
  format: {
    minorLabels: (date: Date) => `<span>${moment(date).format("HH:mm")}</span>`,
    majorLabels: (date: Date) =>
      `${moment(date).format("DD-MMM").toUpperCase()}` +
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
  snap: date => {
    return getSliderRange(date, ViewTimeScale.Day).start;
  },
};

export const MONTH_TIMELINE_OPTIONS: TimelineOptions = {
  ...DAY_TIMELINE_OPTIONS,
  timeAxis: {
    scale: "week",
    step: 1,
  },
  format: {
    minorLabels: (date: Date) => getWeek(moment(date)) ?? "",
    majorLabels: (date: Date) =>
      `${moment(date).format("MMM YYYY")}` +
      (moment(date).month() === moment().month() &&
      moment(date).year() === moment().year()
        ? `<span>Now</span>`
        : ""),
  },
  snap: date => {
    return getSliderRange(date, ViewTimeScale.Month).start;
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

  return `${weekNumber}`;
}

export const monthAxisLegend = (serviceCode: string): string => {
  return `<div class="flex-row items-center vis-axis-legend">        <div class="axis-diag">          <span>${serviceCode}</span>          <span>month</span>        </div><div false>          <span>vessel</span>          <span>week</span>        </div>      </div>`;
};

export const dayAxisLegend = (serviceCode: string): string => {
  return `<div class="flex-row items-center vis-axis-legend">        <div class="axis-diag">          <span>${serviceCode}</span>          <span>day</span>        </div><div false>          <span>vessel</span>          <span>hour</span>        </div>      </div>`;
};
