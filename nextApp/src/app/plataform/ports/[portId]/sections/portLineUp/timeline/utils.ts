import moment from "moment";
import { TimelineGroup, TimelineItem } from "vis-timeline/types";

import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";

import { TVesselArrivingPort } from "../domain/interfaces";

export const createTimelineItems = (
  vessels: TVesselArrivingPort[] = [],
  proformaEnable = false,
): { items: TimelineItem[]; groups: TimelineGroup[] } => {
  const { items, groups } = vessels.reduce(
    (acc, vessel) => {
      const visibleString =
        vessel.vesselType !== RotationType.OTHERS
          ? `${vessel.voyageCode}`
          : vessel.vesselName;
      const itemClassName = `${vessel.vesselType.toLowerCase()}${vessel.isFuture ? "-future" : ""}`;
      const groupClassName = "group-" + vessel.vesselType.toLowerCase();

      const toolTip = createVesselToolTip(vessel); //`start: ${moment(vessel.start).format("DD-MMM")} end: ${moment(vessel.end).format("DD-MMM")} ${vessel.vesselType}`;

      const timelineItemId = `${vessel.vesselName}-${vessel.voyageCode}-${vessel.start}-${vessel.end}`;

      if (acc.items.some(item => item.id === timelineItemId)) {
        return acc;
      }

      const timelineItem: TimelineItem = {
        id: timelineItemId,
        group: timelineItemId,
        content: `<span>${visibleString}</span>`,
        start: vessel.start,
        end: vessel.end,
        type: "range",
        className: itemClassName,
        title: toolTip,
      };

      acc.items.push(timelineItem);

      acc.groups.push({
        id: timelineItemId,
        content: visibleString.toUpperCase(),
        className: groupClassName,
      });

      if (!vessel.proformaStart || !vessel.proformaEnd) return acc;
      if (!proformaEnable) return acc;

      if (vessel.isProforma) {
        const proformaItemId = `${vessel.vesselName}-${vessel.voyageCode}-${vessel.start}-${vessel.end}-proforma`;

        const proformaItem: TimelineItem = {
          id: proformaItemId,
          group: proformaItemId,
          content: `<span class="proforma-item-content">${visibleString}</span>`,
          start: vessel.proformaStart,
          end: vessel.proformaEnd,
          type: "range",
          className: `${itemClassName.split("-")[0]}-proforma`,
          title: getProformaTooltip(vessel),
        };

        const needAdjustment = moment(vessel.proformaEnd).isBefore(
          moment(vessel.end).subtract(2, "days"),
        );

        const adjustmentItem: TimelineItem = {
          id: `${proformaItemId}-adjustment`,
          group: proformaItemId,
          content: ``,
          start: vessel.end,
          end: moment(vessel.start).add(1, "minute").toDate(),
          type: "range",
          className: `adjustment`,
        };

        acc.items.push(proformaItem);
        if (needAdjustment) {
          acc.items.push(adjustmentItem);
        }
        acc.groups.push({
          id: proformaItemId,
          content: visibleString.toUpperCase(),
          className: "group-proforma",
        });
      }
      return acc;
    },
    { items: [] as TimelineItem[], groups: [] as TimelineGroup[] },
  );

  return { items, groups };
};

const createVesselToolTip = (vessel: TVesselArrivingPort) => {
  switch (vessel.vesselType) {
    case RotationType.OPERATED:
      if (vessel.isActual) {
        return `<div class="flex-col items-center "><div>${vessel.vesselName}</div> <div>${vessel.voyageCode}</div>${vessel.serviceCode ? `<div>Service: ${vessel.serviceCode}</div>` : undefined}<div>ETA: ${moment(vessel.start).format("DD-MMM")}</div><div>ETD: ${moment(vessel.end).format("DD-MMM")}</div></div>`;
      }
      if (vessel.isFuture) {
        return `<div class="flex-col items-center"><div>${vessel.vesselName}</div> <div>${vessel.voyageCode}</div>${vessel.serviceCode ? `<div>Service: ${vessel.serviceCode}</div>` : undefined}<div>ETA: ${moment(vessel.start).format("DD-MMM")}</div><div>ETD: ${moment(vessel.end).format("DD-MMM")}</div></div>`;
      }

    case RotationType.PARTNER:
      return `<div class="flex-col items-center"><div>${vessel.vesselName}</div> <div>${vessel.voyageCode}</div>${vessel.serviceCode ? `<div>Service: ${vessel.serviceCode}</div>` : undefined}<div>ETA: ${moment(vessel.start).format("DD-MMM")}</div><div>ETD: ${moment(vessel.end).format("DD-MMM")}</div></div>`;
    case RotationType.OTHERS:
      return `<div class="flex-col items-center"><div>${vessel.vesselName}</div> <div>${vessel.voyageCode}</div><div>ETA: ${moment(vessel.start).format("DD-MMM")}</div><div>ETD: ${moment(vessel.end).format("DD-MMM")}</div></div>`;
  }
};

const getProformaTooltip = (vessel: TVesselArrivingPort) => {
  return `<div class="flex-col items-center"><div>${vessel.vesselName}</div><div>${vessel.voyageCode}</div><div>Start: ${moment(vessel.proformaStart).format("DD MMM [at] HH:mm")}</div><div>End:   ${moment(vessel.proformaEnd).format("DD MMM [at] HH:mm")}</div></div>`;
};
