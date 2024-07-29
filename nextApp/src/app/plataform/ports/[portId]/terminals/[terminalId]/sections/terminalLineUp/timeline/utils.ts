import moment from "moment";
import { TimelineGroup, TimelineItem } from "vis-timeline/types";

import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";
import { VesselColors } from "@/app/theme";

import { TVesselArrivingTerminal } from "../domain/interfaces";

export const createTimelineItems = (
  vessels: TVesselArrivingTerminal[] = [],
): { items: TimelineItem[]; groups: TimelineGroup[] } => {
  const { items, groups } = vessels.reduce(
    (acc, vessel) => {
      const berthDetails = `Berth ${vessel.berthNumber}`;
      const groupClassName = "group-" + vessel.type.toLowerCase();
      const toolTip =
        createVesselToolTip(
          vessel,
        ); /* `start: ${moment(vessel.start).format("DD-MMM-HH:mm")} end: ${moment(vessel.end).format("DD-MMM-HH:mm")} ${vessel.type}`; */
      const startDate = vessel.start;
      const endDate = vessel.end;
      const difHours = moment(vessel.end).diff(
        moment(vessel.start).toDate(),
        "hours",
      );

      const timelineItemStart: TimelineItem = {
        id: `${vessel.id}-start`,
        group: vessel.berthNumber,
        content: createCustomSvgVessel(
          vessel.voyageNumber,
          difHours,
          vessel.type,
          vessel.vesselLoa,
        ),
        start: startDate,
        end: endDate,
        type: "range",
        title: toolTip,
      };

      acc.items.push(timelineItemStart);

      if (acc.groups.some(group => group.id === vessel.berthNumber)) {
        return acc;
      }
      acc.groups.push({
        id: vessel.berthNumber,
        content: berthDetails,
        className: groupClassName,
      });
      return acc;
    },
    { items: [] as TimelineItem[], groups: [] as TimelineGroup[] },
  );

  return {
    items,
    groups,
  };
};

export const createCustomSvgVessel = (
  vesselText: string,
  hours: number,
  vesselType: RotationType,
  defaultHeight: number = 200,
): string => {
  const defaultWidth = (hours * 97) / 24;

  let color: string = VesselColors.OTHERS;
  let borderColor: string = VesselColors.OTHERS_BORDER;
  if (vesselType === RotationType.OPERATED) {
    color = VesselColors.OPERATED;
    borderColor = VesselColors.OPERATED_BORDER;
  }
  if (vesselType === RotationType.OTHERS) {
    color = VesselColors.OTHERS;
    borderColor = VesselColors.OTHERS_BORDER;
  }
  if (vesselType === RotationType.PARTNER) {
    color = VesselColors.PARTNER;
    borderColor = VesselColors.PARTNER_BORDER;
  }
  const minViableWidth = 120;

  if (defaultWidth < minViableWidth) {
    return `<svg width=${hours * 4} height=${defaultHeight} xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="50" width=${hours * 4} height=${defaultHeight - 50} fill="${color}" stroke="${color}" stroke-width="1"></rect>
    <polygon points="0,50 ${hours * 2},00 ${hours * 4},50" fill="${color}" />
    <text x="${hours * 2}" y=${290 - defaultHeight * 0.9} text-anchor="middle" transform="rotate(180, ${hours * 2}, 125)" 
        style="writing-mode: vertical-lr; font-family="Roboto" font-size="16" font-weight="500" line-height: 10px;>
        ${vesselText ?? "Vessel"}
    </text>
   </svg>`;
  }

  const stringSvgCreated = `<svg width="${defaultWidth}" height="${defaultHeight}" xmlns="http://www.w3.org/2000/svg">


    <path fill="${color}" stroke="${borderColor}" stroke-width="2" d="M ${defaultWidth - 105} ${defaultHeight} H ${defaultWidth + 90 - 105} V 50 L ${defaultWidth + 47.5 - 105} 10 L ${defaultWidth - 105} 50 Z" opacity="0.5"></path>
    <path fill="${color}" stroke="${borderColor}" stroke-width="2" d="M 5 ${defaultHeight} H 90 V 50 L 47.5 10  L 5 50 Z"></path>


      <circle cx="45" cy="${defaultHeight / 2}" r="5" fill="${color}" />
      <line x1="45" y1="${defaultHeight / 2}" x2="${defaultWidth - 60}" y2="${defaultHeight / 2}" stroke="${borderColor}" stroke-width="2" stroke-dasharray="5,3" />
      <circle cx="${defaultWidth - 60}" cy="${defaultHeight / 2}" r="5" fill="${color}" />
     

      <text x="355" y=${defaultHeight > 150 ? -defaultHeight + 330 : 170} 
                transform="rotate(180, 200, 150)" 
                style="writing-mode: vertical-lr; font-family="Roboto" font-size="16" font-weight="500" line-height: 10px;>
              ${vesselText}
            </text>
  
  
      </svg>`;

  return stringSvgCreated;
};

const createVesselToolTip = (vessel: TVesselArrivingTerminal) => {
  return `<div class="flex-col items-center"><div class="title">${vessel.vesselName}</div> <div>${vessel.carrierCode}</div><div>Start: ${moment(vessel.start).format("DD-MMM HH:mm")}</div><div>End: ${moment(vessel.end).format("DD-MMM HH-mm")}</div><div>Loa: ${vessel.vesselLoa}</div></div>`;
};
