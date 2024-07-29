import {
  EventLogType,
  EventOccurrenceType,
  PortType,
} from "@/generated/graphql";
import { DateTime } from "luxon";

import { isNotNullOrUndefined } from "@/lib/utils";

import {
  DefaultRecurrency,
  Event,
  EventLogPortEssentials,
  EventLogTerminals,
  EventLogTerminalsBerths,
  EventType,
  Recurrence,
  validDays,
} from "./interfaces";

export function eventLogPortAdapter(port: PortType): EventLogPortEssentials {
  const terminals: EventLogTerminals[] =
    port?.terminals?.map(terminal => {
      return {
        id: terminal.id,
        terminalName: terminal.terminalName,
        terminalCode: terminal.terminalCode,

        berths:
          terminal?.berths?.map(serverBerth => {
            const berth: EventLogTerminalsBerths = {
              berthName: serverBerth.berthName,
              depth: serverBerth?.depth ?? undefined,
              depthUnit: serverBerth.depthUnit ?? undefined,
              length: serverBerth?.length ?? undefined,
              lengthUnit: serverBerth?.lengthUnit ?? undefined,
              location: serverBerth.berthLocation,
            };
            return berth;
          }) || ([] as EventLogTerminalsBerths[]),
      };
    }) || ([] as EventLogTerminals[]);

  const portEssentials: EventLogPortEssentials = {
    id: port.id,
    portName: port.portName,
    portCode: port.portCode,
    timezone: port.timezone,
    countryCode: port.countryCode,
    terminals: terminals,
  };
  return portEssentials;
}

export function eventLogEventAdapter(
  serverEvents: EventOccurrenceType[],
): Event[] {
  const events: Event[] = [];

  serverEvents.forEach(serverEvent => {
    const startDay = serverEvent.startDate;
    const startHour = serverEvent.startTime;
    const endDay = serverEvent.endDate;
    const endHour = serverEvent.endTime;
    const timeZone = serverEvent?.timeZone ?? "UTC";

    const start = DateTime.fromISO(`${startDay}T${startHour}`)
      .setZone(timeZone)
      .toJSDate();

    const end = DateTime.fromISO(`${endDay}T${endHour}`)
      .setZone(timeZone)
      .toJSDate();

    const eventAlreadyExist: Event | undefined = events.find(
      event =>
        event.id === serverEvent.eventId.toString() &&
        start.getTime() === event.start.getTime() && // Comparar timestamps
        end.getTime() === event.end.getTime(), // Comparar timestamps
    );

    if (eventAlreadyExist) {
      if (
        serverEvent.terminalCode &&
        !eventAlreadyExist.terminals.includes(serverEvent.terminalCode)
      ) {
        eventAlreadyExist.terminals.push(serverEvent.terminalCode);
        return;
      } else {
      }
    }

    const defaultRecurrency: Recurrence = DefaultRecurrency;

    const event: Event = {
      id: serverEvent.eventId.toString() ?? "",
      title: serverEvent.name,
      type: createEventType(serverEvent.eventType),
      start: start,
      end: end,
      impactScore: serverEvent.impactScore,
      likelihoodScore: serverEvent.likelihoodScore,
      timezone: serverEvent?.timeZone ?? "UTC",
      description: serverEvent.description ?? "",
      recurrence: defaultRecurrency,
      portCode: serverEvent.portCode,
      terminals: serverEvent?.terminalCode ? [serverEvent?.terminalCode] : [],
    };

    events.push(event);
  });

  return events;
}

const createEventType = (type: string): EventType => {
  switch (type) {
    case "WEATHER":
      return EventType.WEATHER;
    case "HOLIDAYS":
      return EventType.HOLIDAYS;
    case "LABOR_STRIKE":
      return EventType.LABOR_STRIKE;
    case "CONGESTION":
      return EventType.CONGESTION;
    case "NON_OPENING_HOURS":
      return EventType.NON_OPENING_HOURS;
    case "OTHERS":
      return EventType.OTHERS;
    default:
      return EventType.OTHERS;
  }
};

export const weeklyRecurrenceAdapter = (
  serverEvent: EventLogType,
): Recurrence | undefined => {
  if (serverEvent.frequency !== "weekly") return undefined;

  const weeklyRecurrence: Recurrence = {
    recurrence: serverEvent.recurrence,
    recurrenceDescription: serverEvent.recurrenceDescription
      ? serverEvent.recurrenceDescription
      : "Not recurrent event",
    frequency: "weekly",
    start: DateTime.fromISO(serverEvent.recurrenceStartDate).toJSDate(),
    end: DateTime.fromISO(serverEvent.recurrenceEndDate).toJSDate(),
    recurrenceParams: {
      weeklyDays: isNotNullOrUndefined(serverEvent?.weeklyDays)
        ? (serverEvent.weeklyDays.split(",") as validDays[])
        : ([] as validDays[]),
    },
  };
  return weeklyRecurrence;
};

export const recurrenceAdapter = (serverEvent: EventLogType): Recurrence => {
  const recurrence: Recurrence = {
    recurrence: serverEvent.recurrence,
    recurrenceDescription: serverEvent.recurrenceDescription
      ? serverEvent.recurrenceDescription
      : "Not recurrent event",
    frequency: serverEvent.frequency as "weekly" | "monthly" | "yearly",
    start: DateTime.fromISO(serverEvent.recurrenceStartDate).toJSDate(),
    end: DateTime.fromISO(serverEvent.recurrenceEndDate).toJSDate(),
    recurrenceParams: {
      //week
      weeklyDays: isNotNullOrUndefined(serverEvent?.weeklyDays)
        ? (serverEvent.weeklyDays.split(",") as validDays[])
        : ([] as validDays[]),
      //year
      yearlyType: serverEvent.yearlyType as "specific_date" | "weekday",
      yearlyDay: serverEvent.yearlyDay ?? undefined,
      yearlyMonth: serverEvent.yearlyMonth ?? undefined,
      yearlyWeekdayOrder: serverEvent.yearlyWeekdayOrder as
        | "first"
        | "second"
        | "third"
        | "fourth"
        | "last",
      yearlyWeekday: serverEvent.yearlyWeekday as validDays,

      //month
      monthlyType: serverEvent.monthlyType as "specific_date" | "weekday",
      monthlyDay: serverEvent.monthlyDay ?? undefined,
      monthlyWeekdayOrder: serverEvent.monthlyWeekdayOrder as
        | "first"
        | "second"
        | "third"
        | "fourth"
        | "last",
      monthlyWeekday: serverEvent.monthlyWeekday as validDays,
    },
  };

  return recurrence;
};
