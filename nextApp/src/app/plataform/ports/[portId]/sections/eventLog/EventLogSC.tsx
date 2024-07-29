"use server";

import type { PortType } from "@/generated/graphql";
import { DateTime } from "luxon";

import { getEventLogEsencials, getEvents } from "./actions";
import { eventLogPortAdapter } from "./adapter";
import EventLog from "./EventLog";

type EventLogProps = {
  portId: string;
  port?: PortType;
  terminalCode?: string;
};

export async function EventLogSC({
  portId,
  port: portFromPageEsencials,
  terminalCode,
}: EventLogProps) {
  let eventLogEsencials = portFromPageEsencials
    ? eventLogPortAdapter(portFromPageEsencials)
    : undefined;

  if (!eventLogEsencials) {
    eventLogEsencials = await getEventLogEsencials(portId);
  } else {
  }
  const start = DateTime.now().minus({ year: 2 }).startOf("month").toJSDate();
  const end = DateTime.now().plus({ year: 2 }).startOf("month").toJSDate();

  const windowRange = { start, end };

  const events = await getEvents(
    eventLogEsencials.portCode,
    start,
    end,
    terminalCode,
  );
  const selectedTerminal = terminalCode
    ? eventLogEsencials.terminals.find(
        terminal => terminal.terminalCode === terminalCode,
      )
    : undefined;

  return (
    <EventLog
      eventLogEsencials={eventLogEsencials}
      events={events}
      terminal={selectedTerminal}
      windowRange={windowRange}
    />
  );
}
