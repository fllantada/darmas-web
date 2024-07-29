// icons
import { htmlToReact } from "@/app/plataform/lib/utils";

import { congestionIcon } from "./components/icons/Congestion";
import { holidaysIcon } from "./components/icons/Holidays";
import { laborStrikeIcon } from "./components/icons/LaborStrike";
import { nonOpeningHoursIcon } from "./components/icons/NonOpeningHours";
import { othersIcon } from "./components/icons/Others";
import { weatherIcon } from "./components/icons/Weather";
import { EventType } from "./interfaces";

type IconMapType = {
  [key in EventType]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const _iconMap: Record<EventType, string> = {
  [EventType.HOLIDAYS]: holidaysIcon,
  [EventType.WEATHER]: weatherIcon,
  [EventType.LABOR_STRIKE]: laborStrikeIcon,
  [EventType.CONGESTION]: congestionIcon,
  [EventType.NON_OPENING_HOURS]: nonOpeningHoursIcon,
  [EventType.OTHERS]: othersIcon,
};

export const iconMap: IconMapType = Object.entries(_iconMap).reduce(
  (acc, [key, value]) => {
    acc[key as EventType] = htmlToReact("svg", value);
    return acc;
  },
  {} as IconMapType,
);

export const rawIconMap = _iconMap;

export function getScoreColor(score: number): string {
  if (score >= 21) {
    return "#C3332E";
  }
  if (score >= 17) {
    return "#DF7240";
  }
  if (score >= 13) {
    return "#F2AE43";
  }
  if (score >= 9) {
    return "#B7D67A";
  }
  if (score >= 5) {
    return "#78B553";
  }
  return "#4F8162";
}
