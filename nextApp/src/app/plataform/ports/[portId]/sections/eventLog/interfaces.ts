export enum EventType {
  WEATHER = "weather",
  HOLIDAYS = "public_holiday",
  LABOR_STRIKE = "labour_strike",
  CONGESTION = "congestion",
  NON_OPENING_HOURS = "non_operating_hours",
  OTHERS = "others",
}

export type validDays = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";
export interface EventLogPortEssentials {
  id: string;
  portName: string;
  portCode: string;
  countryCode: string;
  timezone: string;
  terminals: EventLogTerminals[];
}
export interface EventLogTerminals {
  id: string;
  terminalName: string;
  terminalCode: string;
  berths: EventLogTerminalsBerths[];
}
export interface EventLogTerminalsBerths {
  berthName: string;
  depth?: number;
  depthUnit?: string;
  length?: number;
  lengthUnit?: string;
  location?: string;
}
export const DefaultRecurrency: Recurrence = {
  recurrence: false,
  recurrenceDescription: "Not recurrent event",
};

export const eventTypesLabels: Record<EventType, string> = {
  [EventType.WEATHER]: "Weather",
  [EventType.HOLIDAYS]: "Holidays",
  [EventType.LABOR_STRIKE]: "Labor Strike",
  [EventType.CONGESTION]: "Congestion",
  [EventType.NON_OPENING_HOURS]: "Non Opening Hours",
  [EventType.OTHERS]: "Others",
};

export type Event = {
  id?: string;
  title: string; // name
  type: EventType;
  start: Date;
  end: Date;
  description: string;
  impactScore: number;
  likelihoodScore: number;
  recurrence: Recurrence;
  allDay?: boolean;
  timezone: string;
  terminals: string[];
  reportedBy?: string;
  portCode: string;

  //
};

export type ValidFrequency = "weekly" | "monthly" | "yearly";

export type Recurrence = {
  recurrenceDescription: string;
  recurrence: boolean;
  frequency?: ValidFrequency;
  start?: Date;
  end?: Date;
  recurrenceParams?: RecurrenceParams; // WeeklyRecurrence | MonthlyRecurrence | YearlyRecurrence;
};

export type RecurrenceParams = {
  weeklyDays?: validDays[];
  //
  yearlyType?: "specific_date" | "weekday";
  monthlyType?: "specific_date" | "weekday";
  //
  monthlyDay?: number;
  monthlyWeekdayOrder?: "first" | "second" | "third" | "fourth" | "last";
  monthlyWeekday?: validDays;
  //
  yearlyDay?: number;
  yearlyMonth?: number;
  yearlyWeekdayOrder?: "first" | "second" | "third" | "fourth" | "last";
  yearlyWeekday?: validDays;
};
