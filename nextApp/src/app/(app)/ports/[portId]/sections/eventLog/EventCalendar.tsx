import { DateTime } from "luxon";
import { Calendar, luxonLocalizer, Views, type View } from "react-big-calendar";

import ViewEditEventDialog from "./components/ViewEditEventDialog";
import type { Event } from "./interfaces";
import { useEventLogStore } from "./store";

import "react-big-calendar/lib/css/react-big-calendar.css";

import CalendarEvent from "./components/CalendarEvent";
import CalendarToolbar from "./components/CalendarToolbar";
import TableView from "./components/TableView";
import { getScoreColor } from "./utils";

const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });

type EventCalendarProps = {
  className?: string;
  height?: number;
  width?: number;
  view?: View;
  defaultDate?: Date;
};

function eventPropGetter(event: Event) {
  return {
    className: "font-medium text-sm",
    style: {
      backgroundColor: getScoreColor(event.impactScore * event.likelihoodScore),
      cursor: "default",
      color: "white",
    },
  };
}

export default function EventCalendar({
  className,
  view = Views.MONTH,
  defaultDate,
}: EventCalendarProps) {
  const events = useEventLogStore(state => state.allEvents);

  const handleCalendarEventClick = (event: Event) => {
    if (!event) return;

    // hacer algo

    useEventLogStore.getState().selectEventOnCalendar(event);
  };

  return (
    <>
      <Calendar
        className={className}
        defaultDate={defaultDate || new Date()}
        defaultView={view}
        localizer={localizer}
        events={events}
        views={{
          month: true,
          week: false,
          work_week: false,
          day: false,
          agenda: TableView,
        }}
        showAllEvents={true}
        eventPropGetter={eventPropGetter}
        showMultiDayTimes={true}
        selectable={false}
        onSelectEvent={handleCalendarEventClick}
        components={{
          toolbar: CalendarToolbar,
          event: CalendarEvent,
        }}
      />
      {<ViewEditEventDialog />}
    </>
  );
}
