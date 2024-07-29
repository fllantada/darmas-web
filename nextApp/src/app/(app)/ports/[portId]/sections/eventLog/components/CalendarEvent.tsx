import { type EventProps } from "react-big-calendar";

import type { Event } from "../interfaces";
import { iconMap } from "../utils";

type CalendarEventProps = Omit<EventProps, "event"> & {
  event: Event;
};

export default function CalendarEvent({ event }: CalendarEventProps) {
  const Icon = iconMap[event.type];

  return (
    <>
      <Icon className="inline ml-1 mr-3" />
      {event.title}
    </>
  );
}
