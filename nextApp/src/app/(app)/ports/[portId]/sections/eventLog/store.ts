import { DateTime } from "luxon";
import { create } from "zustand";

import { DateRange } from "@/lib/types";

import {
  deleteEvent,
  getEventRecurrency,
  getEvents,
  sendNewEventToServer,
  updateEvent,
} from "./actions";
import {
  DefaultRecurrency,
  Event,
  EventLogPortEssentials,
  EventLogTerminals,
  Recurrence,
} from "./interfaces";

interface EventLogStore {
  allEvents: Event[];
  allEventsWindow: DateRange;
  port: EventLogPortEssentials;
  terminals: EventLogTerminals[];
  selectedTerminal?: EventLogTerminals;
  todayEvents: Event[];
  selectedEvent?: Event;
  recurrence: Recurrence;
}

interface EventLogActions {
  initializeStore: (
    port: EventLogPortEssentials,
    events: Event[],
    allEventsWindow: DateRange,
    selectedTerminal?: EventLogTerminals,
  ) => void;
  createEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  selectEventOnCalendar: (event: Event) => void;
  unSelectEventOnCalendar: () => void;
  updateRecurrence: (recurrence: Recurrence) => void;
  resetAllEvents: () => void;
}

export const useEventLogStore = create<EventLogStore & EventLogActions>(
  (set, get) => ({
    allEvents: [],
    allEventsWindow: { start: new Date(), end: new Date() },
    port: {} as EventLogPortEssentials,
    terminals: [],
    todayEvents: [],
    recurrence: DefaultRecurrency,

    async initializeStore(
      port: EventLogPortEssentials,
      events: Event[],
      allEventsWindow: DateRange,
      selectedTerminal?: EventLogTerminals,
    ) {
      const todayEvents = events.filter(
        event =>
          event.start >= DateTime.local().startOf("day").toJSDate() &&
          event.end <= DateTime.local().endOf("day").toJSDate(),
      );

      set(state => ({
        ...state,
        port,
        terminals: port.terminals,
        selectedTerminal,
        allEvents: events,
        allEventsWindow,
        todayEvents,
      }));
    },

    async createEvent(newEvent: Event) {
      const portCode = get().port.portCode;
      const selectedTerminal = get().selectedTerminal;
      const newRecurrence = get().recurrence;

      const eventWithRecurrency: Event = {
        ...newEvent,
        recurrence: newRecurrence,
        terminals: selectedTerminal
          ? [selectedTerminal.terminalCode]
          : newEvent.terminals,
      };

      const newEventId = await sendNewEventToServer(
        eventWithRecurrency,
        portCode,
      );

      const isTodayEvent =
        newEvent.start >= DateTime.local().startOf("day").toJSDate() &&
        newEvent.end <= DateTime.local().endOf("day").toJSDate();

      if (newEventId) {
        if (newRecurrence.recurrence) {
          get().unSelectEventOnCalendar();
          get().resetAllEvents();
          return;
        }

        set(state => ({
          ...state,
          allEvents: [
            ...state.allEvents,
            {
              ...newEvent,
              id: newEventId,
              portCode: portCode,
              terminals: selectedTerminal
                ? [selectedTerminal.terminalCode]
                : newEvent.terminals,
            },
          ],

          todayEvents: isTodayEvent
            ? [
                ...state.todayEvents,
                { ...newEvent, id: newEventId, portCode: portCode },
              ]
            : state.todayEvents,
        }));
      }

      get().unSelectEventOnCalendar();
    },

    async deleteEvent(id: string) {
      if (!id) return;
      const shouldDeletAll = true;

      const { selectedEvent, selectedTerminal, allEvents, todayEvents } = get();

      const onlyOneTerminal = selectedEvent?.terminals.length === 1;

      if (
        selectedTerminal &&
        selectedEvent &&
        selectedEvent.terminals &&
        !onlyOneTerminal
      ) {
        const eventWithTerminalUpdated = {
          ...selectedEvent,
          terminals: selectedEvent?.terminals.filter(
            terminal => terminal !== selectedTerminal.terminalCode,
          ),
        };
        get().updateEvent(eventWithTerminalUpdated);
      } else {
        await deleteEvent(id, shouldDeletAll);
      }

      const newEvents = allEvents.filter(event => event.id !== id);
      const newTodayEvents = todayEvents.filter(event => event.id !== id);

      set(state => ({
        ...state,
        allEvents: newEvents,
        todayEvents: newTodayEvents,
      }));
      get().unSelectEventOnCalendar();
    },
    selectEventOnCalendar: async (event: Event) => {
      const updatedRecurrence = await getEventRecurrency(event.id);

      set(state => ({
        ...state,
        selectedEvent: updatedRecurrence
          ? { ...event, recurrence: updatedRecurrence }
          : { ...event },
        recurrence: updatedRecurrence || DefaultRecurrency,
      }));
    },
    unSelectEventOnCalendar: () => {
      set(state => ({
        ...state,
        selectedEvent: undefined,
      }));
    },

    async updateEvent(updatedEvent: Event) {
      if (!updatedEvent) return;

      const recurrence = get().recurrence;

      const eventWithRecurrency: Event = {
        ...updatedEvent,
        recurrence: recurrence,
      };

      const updateResult = await updateEvent(eventWithRecurrency);

      if (eventWithRecurrency.recurrence.recurrence) {
        get().resetAllEvents();
        return;
      }

      if (updateResult) {
        const newEvents = get().allEvents.map(oldEvent =>
          oldEvent.id === updatedEvent.id ? updatedEvent : oldEvent,
        );

        const newTodayEvents = get().todayEvents.map(oldEvent =>
          oldEvent.id === updatedEvent.id ? updatedEvent : oldEvent,
        );

        set(state => ({
          ...state,
          allEvents: newEvents,
          todayEvents: newTodayEvents,
        }));
      }

      get().unSelectEventOnCalendar();
    },
    updateRecurrence: async (newRecurrence: Recurrence) => {
      set(state => ({
        ...state,
        recurrence: newRecurrence,
      }));
    },
    resetAllEvents: async () => {
      const start = get().allEventsWindow.start;
      const end = get().allEventsWindow.end;
      const selectedTerminal = get().selectedTerminal;

      const updatedEvents = await getEvents(
        get().port.portCode,
        start,
        end,
        selectedTerminal?.terminalCode,
      );

      const todayEvents = updatedEvents.filter(
        event =>
          event.start >= DateTime.local().startOf("day").toJSDate() &&
          event.end <= DateTime.local().endOf("day").toJSDate(),
      );

      set(state => ({
        ...state,
        allEvents: updatedEvents,
        todayEvents: todayEvents,
      }));
    },
  }),
);
