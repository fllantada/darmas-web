"use server";

import { Query } from "@/generated/graphql";
import { gql } from "@apollo/client";
import { DateTime } from "luxon";

import { getClient } from "@/lib/apiClient";

import {
  eventLogEventAdapter,
  eventLogPortAdapter,
  recurrenceAdapter,
} from "./adapter";
import { Event, EventLogPortEssentials, Recurrence } from "./interfaces";

export async function getEventLogEsencials(
  portId: string,
): Promise<EventLogPortEssentials> {
  const gqlClient = getClient();

  const eventLogServerData = await gqlClient.query<Query>({
    query: gql`
      query ($portId: String!) {
        portById(portId: $portId) {
          id
          portName
          portCode
          timezone
          countryCode

          terminals {
            id
            terminalName
            terminalCode
            berths {
              berthLocation
              berthName
              depth
              depthUnit
              length
              lengthUnit
            }
          }
        }
      }
    `,
    variables: {
      portId,
    },
  });
  const port = eventLogServerData?.data?.portById;
  if (!port) {
    throw new Error("Port not found");
  }
  const adapted = eventLogPortAdapter(port);
  return adapted;
}

export const getEvents = async (
  portCode: string,
  startDate: Date,
  endDate: Date,
  terminalCode?: string,
): Promise<Event[]> => {
  if (!portCode) {
    throw new Error("Port ID is required");
  }

  try {
    const start = DateTime.fromJSDate(startDate).toFormat("yyyy-MM-dd") ?? "";

    const end = DateTime.fromJSDate(endDate).toFormat("yyyy-MM-dd") ?? "";
    //

    const gqlClient = getClient();

    const response = await gqlClient.query<Query>({
      query: gql`
        query EventLogsForPort(
          $portCode: String!
          $startDate: String!
          $endDate: String!
        ) {
          eventLogs {
            events(
              eventParams: {
                portCode: $portCode
                startDate: $startDate
                endDate: $endDate
              }
            ) {
              eventId
              eventType
              name
              startDate
              startTime
              endDate
              endTime
              impactScore
              likelihoodScore
              riskScore
              portCode
              terminalCode
              timeZone
              description
            }
          }
        }
      `,
      variables: {
        portCode: portCode,
        startDate: start,
        endDate: end,
        /*    terminalCode: terminalCode, */
      },
    });
    // bug in backend when send terminalCode the terminals items come incomplete with only terminalCode sent. So I need to filter the events by terminalCode

    const serverEvents = response.data?.eventLogs?.events;

    if (!serverEvents) {
      return [];
    }

    const adaptedEvents = eventLogEventAdapter(serverEvents);

    if (!terminalCode) {
      return adaptedEvents;
    }
    const terminalEvents = adaptedEvents.filter(event =>
      event.terminals.includes(terminalCode),
    );

    return terminalEvents;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
};

export const sendNewEventToServer = async (
  event: Event,
  portCode: string,
): Promise<string> => {
  if (!portCode) {
    throw new Error("Port code is required");
  }
  const gqlClient = getClient();

  let weeklyDays: string | null = null;

  if (
    event.recurrence?.recurrenceParams?.weeklyDays &&
    event.recurrence?.recurrenceParams?.weeklyDays.length > 0
  ) {
    weeklyDays = event.recurrence.recurrenceParams.weeklyDays.join(",");
  }

  const eventInput = {
    eventType: event.type,
    name: event.title,
    startDate: DateTime.fromJSDate(event.start).toFormat("yyyy-MM-dd"),
    endDate: DateTime.fromJSDate(event.start).toFormat("yyyy-MM-dd"),
    startTime: DateTime.fromJSDate(event.start).toFormat("HH:mm"),
    endTime: DateTime.fromJSDate(event.end).toFormat("HH:mm"),
    impactScore: event.impactScore,
    likelihoodScore: event.likelihoodScore,
    timeZone: event?.timezone ?? "UTC",
    description: event.description,
    updatedBy: event.reportedBy ?? "Unknown",
    terminalCodes: event.terminals,
    portCode: portCode,
    allDay: event.allDay,

    recurrence: event?.recurrence?.recurrence ?? false,

    recurrenceStartDate: event?.recurrence?.start
      ? DateTime.fromJSDate(event.recurrence.start).toFormat("yyyy-MM-dd")
      : null,

    recurrenceEndDate: event?.recurrence?.end
      ? DateTime.fromJSDate(event.recurrence.end).toFormat("yyyy-MM-dd")
      : null,
    frequency: event?.recurrence?.frequency ?? null,
    monthlyType: event?.recurrence?.recurrenceParams?.monthlyType ?? null,
    monthlyDay: event?.recurrence?.recurrenceParams?.monthlyDay ?? null,
    monthlyWeekdayOrder:
      event?.recurrence?.recurrenceParams?.monthlyWeekdayOrder ?? null,

    // turn valid days to strng format separated by
    monthlyWeekday: event?.recurrence?.recurrenceParams?.monthlyWeekday ?? null,
    yearlyType: event?.recurrence?.recurrenceParams?.yearlyType ?? null,
    yearlyDay: event?.recurrence?.recurrenceParams?.yearlyDay ?? null,
    yearlyWeekdayOrder:
      event?.recurrence?.recurrenceParams?.yearlyWeekdayOrder ?? null,

    // turn valid days to strng format separated by
    yearlyWeekday: event?.recurrence?.recurrenceParams?.yearlyWeekday ?? null,
    yearlyMonth: event?.recurrence?.recurrenceParams?.yearlyMonth ?? null,
    // turn valid days to strng format separated by
    weeklyDays: weeklyDays,
  };

  const response = await gqlClient.mutate({
    mutation: gql`
      mutation EventLogs($eventInput: EventLogInput!) {
        eventLogs {
          create(eventInput: $eventInput) {
            id
            eventType
            name
            startDate
            endDate
            startTime
            endTime
            impactScore
            likelihoodScore
            allDay
            timeZone
            description
            updatedBy
            updatedTime
            recurrence
            frequency
            weeklyDays
            monthlyType
            monthlyDay
            monthlyWeekdayOrder
            monthlyWeekday
            yearlyType
            yearlyDay
            yearlyWeekdayOrder
            yearlyWeekday
            yearlyMonth
            recurrenceStartDate
            recurrenceEndDate
          }
        }
      }
    `,
    variables: {
      eventInput: eventInput,
    },
  });
  const id = response.data?.eventLogs?.create?.id as string;
  if (!id) {
    throw new Error("Event not created");
  }

  return id;
};

export const deleteEvent = async (
  id: string,
  includeFutureEvents?: boolean,
) => {
  if (!id) {
    throw new Error("id is required");
  }
  if (includeFutureEvents !== true) {
    throw new Error("you should edit the event");
  }
  const gqlClient = getClient();

  const response = await gqlClient.mutate({
    mutation: gql`
      mutation DeleteEvent($eventId: Int!) {
        eventLogs {
          delete(eventId: $eventId)
        }
      }
    `,
    variables: {
      eventId: parseInt(id),
    },
  });

  return response.data.eventLogs.delete;
};

export const updateEvent = async (event: Event): Promise<boolean> => {
  const gqlClient = getClient();

  if (!event.id) {
    throw new Error("Event ID is required");
  }

  let weeklyDays: string | null = null;

  if (
    event.recurrence?.recurrenceParams?.weeklyDays &&
    event.recurrence?.recurrenceParams?.weeklyDays.length > 0
  ) {
    weeklyDays = event.recurrence.recurrenceParams.weeklyDays.join(",");
  }

  const eventInput = {
    eventType: event.type,
    name: event.title,
    startDate: DateTime.fromJSDate(event.start).toFormat("yyyy-MM-dd"),
    endDate: DateTime.fromJSDate(event.start).toFormat("yyyy-MM-dd"),
    startTime: DateTime.fromJSDate(event.start).toFormat("HH:mm"),
    endTime: DateTime.fromJSDate(event.end).toFormat("HH:mm"),
    impactScore: event.impactScore,
    likelihoodScore: event.likelihoodScore,
    timeZone: event?.timezone ?? "UTC",
    description: event.description,
    updatedBy: event.reportedBy ?? "Unknown",
    terminalCodes: event.terminals,
    allDay: event.allDay ?? true,
    portCode: event.portCode,
    recurrence: event?.recurrence?.recurrence ?? false,

    recurrenceStartDate: event?.recurrence?.start
      ? DateTime.fromJSDate(event.recurrence.start).toFormat("yyyy-MM-dd")
      : null,

    recurrenceEndDate: event?.recurrence?.end
      ? DateTime.fromJSDate(event.recurrence.end).toFormat("yyyy-MM-dd")
      : null,
    frequency: event?.recurrence?.frequency ?? null,
    monthlyType: event?.recurrence?.recurrenceParams?.monthlyType ?? null,
    monthlyDay: event?.recurrence?.recurrenceParams?.monthlyDay ?? null,
    monthlyWeekdayOrder:
      event?.recurrence?.recurrenceParams?.monthlyWeekdayOrder ?? null,

    // turn valid days to strng format separated by
    monthlyWeekday: event?.recurrence?.recurrenceParams?.monthlyWeekday ?? null,
    yearlyType: event?.recurrence?.recurrenceParams?.yearlyType ?? null,
    yearlyDay: event?.recurrence?.recurrenceParams?.yearlyDay ?? null,
    yearlyWeekdayOrder:
      event?.recurrence?.recurrenceParams?.yearlyWeekdayOrder ?? null,

    // turn valid days to strng format separated by
    yearlyWeekday: event?.recurrence?.recurrenceParams?.yearlyWeekday ?? null,
    yearlyMonth: event?.recurrence?.recurrenceParams?.yearlyMonth ?? null,
    // turn valid days to strng format separated by
    weeklyDays: weeklyDays,
  };

  const response = await gqlClient.mutate({
    mutation: gql`
      mutation EventLogs($eventInput: EventLogInput!, $eventId: Int!) {
        eventLogs {
          update(eventId: $eventId, eventInput: $eventInput) {
            id
            eventType
            name
            startDate
            endDate
            startTime
            endTime
            impactScore
            likelihoodScore
            allDay
            timeZone
            description
            updatedBy
            updatedTime
            recurrence
            frequency
            weeklyDays
            monthlyType
            monthlyDay
            monthlyWeekdayOrder
            monthlyWeekday
            yearlyType
            yearlyDay
            yearlyWeekdayOrder
            yearlyWeekday
            yearlyMonth
          }
        }
      }
    `,
    variables: {
      eventId: parseInt(event.id),
      eventInput: eventInput,
    },
  });

  // return object updated
  if (response.data.eventLogs.update) {
    return true;
  }
  return false;
};

export const getEventRecurrency = async (
  eventId?: string,
): Promise<Recurrence | undefined> => {
  if (!eventId) {
    throw new Error("Event ID is required");
  }

  const gqlClient = getClient();

  const serverResponse = await gqlClient.query<Query>({
    query: gql`
      query ($eventId: Int!) {
        eventLogs {
          eventDefById(eventId: $eventId) {
            frequency
            id
            monthlyDay
            monthlyType
            monthlyWeekday
            monthlyWeekdayOrder
            recurrence
            recurrenceDescription
            recurrenceEndDate
            recurrenceStartDate
            weeklyDays
            yearlyDay
            yearlyMonth
            yearlyType
            yearlyWeekday
            yearlyWeekdayOrder
          }
        }
      }
    `,
    variables: {
      eventId: parseInt(eventId),
    },
  });

  const serverRecurrencyInfo = serverResponse?.data?.eventLogs?.eventDefById;

  if (!serverRecurrencyInfo || !serverRecurrencyInfo?.frequency) {
    return undefined;
  }

  const recurrence = recurrenceAdapter(serverRecurrencyInfo);

  return recurrence;
};
