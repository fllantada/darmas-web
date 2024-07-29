"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { DateRange } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CalendarIcon from "@/components/icons/calendar";

import ExpandIcon from "../../../../../../components/icons/expand";
import EventRow from "./components/EventRow";
import { Event, EventLogPortEssentials, EventLogTerminals } from "./interfaces";
import { useEventLogStore } from "./store";

const EventCalendar = dynamic(() => import("./EventCalendar"), {
  ssr: false,
});

type EventLogProps = {
  className?: string;
  eventLogEsencials: EventLogPortEssentials;
  events: Event[];
  windowRange: DateRange;
  terminal?: EventLogTerminals;
};

export default function EventLog({
  className,
  eventLogEsencials,
  events,
  windowRange,
  terminal,
}: EventLogProps) {
  const eventsToday = useEventLogStore(state => state.todayEvents);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    useEventLogStore
      .getState()
      .initializeStore(eventLogEsencials, events, windowRange, terminal);
  }, [eventLogEsencials, events, windowRange, terminal]);

  return (
    <div className={"py-2"}>
      <div className="cursor-pointer" onClick={() => setExpanded(true)}>
        <h2>
          Event Log <CalendarIcon className="inline ml-5" />
          <ExpandIcon className="inline ml-2 float-right" />
        </h2>
        <div className={className}>
          {eventsToday.length > 0 ? (
            eventsToday
              .slice(0, 3)
              .map((event, index) => (
                <EventRow key={`${event.id}-${index}`} event={event} />
              ))
          ) : (
            <div className="text-slate-400 text-center my-2">
              <CalendarIcon className="mb-2 inline-block" />
              <div>No Events Today</div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={expanded} onOpenChange={() => setExpanded(false)}>
        <DialogContent size="full" showCloseButton={false} className="h-[90%]">
          <EventCalendar />
        </DialogContent>
      </Dialog>
    </div>
  );
}
