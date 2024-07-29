import { ServiceType, VoyageType } from "@/generated/graphql";
import { calculateRotationType } from "@/globalDomain/rotationTypes";
import { VesselStatus } from "@/globalDomain/vesselStatus";
import moment from "moment";
import { TimelineGroup, TimelineItem } from "vis-timeline/standalone";

import { DateRange } from "@/lib/types";

import {
  TService,
  TServiceVessel,
  TVesselVoyage,
  ViewTimeScale,
} from "./domain/interfaces";

export const getStatusBackground = (
  callStatus: VesselStatus,
  isFirst?: boolean,
  isLast?: boolean,
): string | undefined => {
  switch (callStatus) {
    case VesselStatus.Passage:
      return "call-status-passage";
    case VesselStatus.Port:
      return "call-status-port";
    case VesselStatus.Waiting:
      return (
        "call-status-waiting" +
        (isFirst ? " call-status-first" : "") +
        (isLast ? " call-status-last" : "")
      );
    default:
      return undefined;
  }
};

export const hasVisibleVoyage = (
  vessel: TServiceVessel,
  dateRange: DateRange,
): boolean => {
  return vessel.voyages.some(voyage => {
    return (
      moment(voyage.start).isBefore(moment(dateRange.end)) &&
      moment(voyage.end).isAfter(moment(dateRange.start))
    );
  });
};

const formatDelta = (delta?: number): string => {
  if (delta === undefined) return "";

  if (delta === 0) return "Delta: On Time";

  const days = delta;
  return `Delta: ${Math.abs(days) < 1 ? "On Time" : Math.abs(days) + " D " + (days > 0 ? "Early" : "Late")}`;
};

const getVoyageTooltipContent = (
  vesselCode: string,
  voyageNo: string,
  operator: string,
  delta?: number,
): string => {
  return `<div class="flex-col items-center">
    <div>Voyage: ${vesselCode} ${voyageNo}</div>
    <div>Operator: ${operator}</div>
    ${`<div>${formatDelta(delta)}</div>`}
  </div>`;
};

const daysBetweenTwoDates = (date1: Date, date2: Date): number => {
  const diffTime = moment(date2).diff(moment(date1), "days");
  return diffTime;
};

export const serverToDomainServiceAdapter = (
  serverService: ServiceType,
): TService => {
  const serviceCode = serverService.serviceCode;
  const serviceName = serverService.serviceName ?? serviceCode;

  const serviceVessels: TServiceVessel[] = serverService.vessels.map(
    serverVessel => {
      return {
        vesselName: serverVessel.vesselName,
        vesselCode: serverVessel.vesselCode,
        operator: serverVessel.operator,
        voyages: serverVessel.voyages.map(serverVoyage => {
          const durationProforma = daysBetweenTwoDates(
            serverVoyage.proformaStartDate,
            serverVoyage.proformaEndDate,
          );

          const durationActual = daysBetweenTwoDates(
            serverVoyage.startDate,
            serverVoyage.endDate,
          );

          const durationDelta = durationProforma - durationActual;

          return {
            voyageCode: serverVoyage.voyageNo,
            delta: durationDelta,
            start: new Date(serverVoyage.startDate),
            end: new Date(serverVoyage.endDate),
          };
        }),
      };
    },
  );

  return {
    serviceCode,
    serviceName,
    vessels: serviceVessels,
  };
};

const formatFutureOperatedVoyage = (
  voyage: TVesselVoyage,
  operator: string,
  vesselCode: string,
): TimelineItem => {
  return {
    id: `${vesselCode}-${voyage.voyageCode}`,
    group: vesselCode,
    start: new Date(voyage.start),
    end: new Date(voyage.end),
    title: getVoyageTooltipContent(
      vesselCode,
      voyage.voyageCode,
      operator,
      voyage.delta,
    ),
    content: `${vesselCode} ${voyage.voyageCode}`,
    className: "operated-future-voyage",
    style: "height: 45px;",
  } as TimelineItem;
};

const formatFuturePartnerVoyage = (
  voyage: TVesselVoyage,
  operator: string,
  vesselCode: string,
): TimelineItem => {
  return {
    id: `${vesselCode}-${voyage.voyageCode}`,
    group: vesselCode,
    start: new Date(voyage.start),
    end: new Date(voyage.end),
    title: getVoyageTooltipContent(
      vesselCode,
      voyage.voyageCode,
      operator,
      voyage.delta,
    ),
    content: `${vesselCode} ${voyage.voyageCode}`,
    className: "partner-future-voyage",
    style: "height: 45px;",
  } as TimelineItem;
};
const formatActualPartnerVoyage = (
  voyage: TVesselVoyage,
  operator: string,
  vesselCode: string,
): TimelineItem => {
  return {
    id: `${vesselCode}-${voyage.voyageCode}`,
    group: vesselCode,
    start: new Date(voyage.start),
    end: new Date(voyage.end),
    title: getVoyageTooltipContent(
      vesselCode,
      voyage.voyageCode,
      operator,
      voyage.delta,
    ),
    content: `${vesselCode} ${voyage.voyageCode}`,
    className: "partner-actual-voyage",
    style: "height: 45px;",
  } as TimelineItem;
};
const formatActualOperatedVoyage = (
  voyage: TVesselVoyage,
  operator: string,
  vesselCode: string,
): TimelineItem => {
  return {
    id: `${vesselCode}-${voyage.voyageCode}`,
    group: vesselCode,
    start: new Date(voyage.start),
    end: new Date(voyage.end),
    title: getVoyageTooltipContent(
      vesselCode,
      voyage.voyageCode,
      operator,
      voyage.delta,
    ),
    content: `${vesselCode} ${voyage.voyageCode}`,
    className: "operated-actual-voyage",
    style: "height: 45px;",
  } as TimelineItem;
};

export const formatServiceData = (
  data: TServiceVessel[],
): [TimelineItem[], TimelineGroup[]] => {
  const items = [] as TimelineItem[];
  const groups = [] as TimelineGroup[];

  data.forEach(({ vesselCode, vesselName, voyages, operator }) => {
    groups.push({
      id: vesselCode,
      content: vesselName,
    });

    voyages.forEach(voyage => {
      const isFutureVoyage = moment().isBefore(voyage.start);
      const operatorType = calculateRotationType(vesselCode);

      if (isFutureVoyage && operatorType === "operated") {
        const newItem = formatFutureOperatedVoyage(
          voyage,
          operator,
          vesselCode,
        );
        items.push(newItem);
        return;
      }

      if (isFutureVoyage && operatorType === "partner") {
        const newItem = formatFuturePartnerVoyage(voyage, operator, vesselCode);
        items.push(newItem);
        return;
      }

      if (!isFutureVoyage && operatorType === "operated") {
        const newItem = formatActualOperatedVoyage(
          voyage,
          operator,
          vesselCode,
        );
        items.push(newItem);
        return;
      }

      if (!isFutureVoyage && operatorType === "partner") {
        const newItem = formatActualPartnerVoyage(voyage, operator, vesselCode);
        items.push(newItem);
        return;
      }
      items.push({
        id: `${vesselCode}-${voyage.voyageCode}`,
        group: vesselCode,
        start: new Date(voyage.start),
        end: new Date(voyage.end),
        title: getVoyageTooltipContent(
          vesselCode,
          voyage.voyageCode,
          operator,
          voyage.delta,
        ),
        content: `${vesselCode} ${voyage.voyageCode}`,
        className: isFutureVoyage
          ? "future-voyage"
          : getStatusBackground(VesselStatus.Passage),
        style: "height: 45px;",
      });
    });
  });
  return [items, groups];
};

export const getAxisLegend = (
  data: ServiceType | VoyageType[],
  timeScale: ViewTimeScale,
): string => {
  const _format_legend = (legend: { row: string; col?: string }[]): string => {
    return `<div class="flex-row items-center vis-axis-legend">
        ${legend
          .map(({ row, col }, i) => {
            return `<div ${i === 0 && row && col && 'class="axis-diag"'}>
          ${row && `<span>${row}</span>`}
          ${col && `<span>${col}</span>`}
        </div>`;
          })
          .join("")}
      </div>`;
  };

  if ("serviceName" in data) {
    return _format_legend([
      { row: data.serviceCode || "", col: timeScale },
      {
        row: "vessel",
        col: timeScale === ViewTimeScale.Month ? `week` : "hour",
      },
    ]);
  }
  const { vesselCode } = (
    (data as VoyageType[]).length === 3
      ? (data as VoyageType[])[1]
      : (data as VoyageType[])[0]
  ) as VoyageType;

  return _format_legend([
    { row: `${vesselCode}`, col: timeScale },
    { row: "voyage", col: "time" },
  ]);
};

export const getSliderRange = (
  start: Date,
  timeScale: ViewTimeScale,
): { start: Date; end: Date } => {
  return {
    start: moment(start).startOf(timeScale).toDate(),
    end: moment(start).endOf(timeScale).toDate(),
  };
};

export const getViewRange = (
  startDate: Date,
  timeScale: ViewTimeScale = ViewTimeScale.Day,
): {
  start: Date;
  end: Date;
} => {
  const startDateValue = startDate.getTime();

  const viewRange =
    timeScale === "day"
      ? {
          start: new Date(startDateValue - 1000 * 60 * 60 * 24 * 3),
          end: new Date(startDateValue + 1000 * 60 * 60 * 24 * 10),
        }
      : {
          start: new Date(startDateValue - 1000 * 60 * 60 * 24 * 30 * 3),
          end: new Date(startDateValue + 1000 * 60 * 60 * 24 * 30 * 10),
        };

  return viewRange;
};

export const getInitialSelectedTime = (
  windowStart: number,
  windowEnd: number,
  timeScale: ViewTimeScale,
): { start: Date; end: Date } => {
  const newCenter = moment().isBetween(windowStart, windowEnd)
    ? new Date()
    : new Date(windowStart + (windowEnd - windowStart) / 2);
  return getSliderRange(newCenter, timeScale);
};

export const getInitialWindowRange = (
  min: number,
  max: number,
  timeScale: ViewTimeScale,
): {
  start: Date;
  end: Date;
} => {
  const newCenter = moment().isBetween(min, max)
    ? new Date()
    : new Date(min + (max - min) / 2);
  return getViewRange(newCenter, timeScale);
};
