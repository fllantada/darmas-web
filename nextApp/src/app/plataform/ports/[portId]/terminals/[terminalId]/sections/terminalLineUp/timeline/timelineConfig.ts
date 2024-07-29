import moment from "moment";
import { TimelineOptions } from "vis-timeline/types";

export const timelineOptions: TimelineOptions = {
  showMajorLabels: true,
  showMinorLabels: false,
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
  stack: true,
  stackSubgroups: true,
  selectable: false,
  format: {
    majorLabels: (date: Date) => {
      const day = moment(date);
      const isToday = day.dayOfYear() === moment().dayOfYear();
      const firstRow = `<span>${day.format("ddd")}</span>`;
      const secondRow = `<span class="major-second-row-date">${day.format("DD-MMM")}</span>`;
      const todayRow = isToday ? `<span class="today-row">Today</span>` : "";
      return firstRow + secondRow + todayRow;
    },
  },
  tooltip: {
    followMouse: true,
    delay: 0,
  },
  align: "center",
  margin: 0,
  verticalScroll: true,
  maxHeight: 6000,
  horizontalScroll: true,
  groupHeightMode: "fixed",
  snap: date => moment(date).startOf("hour").toDate(),
  xss: {
    disabled: true,
  },
};
