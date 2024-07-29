import { DateTime } from "luxon";

import { Recurrence, validDays } from "../../../interfaces";

export function createWeeklyRecurrence(
  repeatOn: string,
  startsOn: Date,
  endsOn: Date,
) {
  const weeklyRecurrence: Recurrence = {
    recurrence: true,
    recurrenceDescription: "Weekly event",
    frequency: "weekly",
    recurrenceParams: {
      weeklyDays: repeatOn.split(",") as validDays[],
      yearlyType: undefined,
      monthlyType: undefined,
      monthlyDay: undefined,
      monthlyWeekdayOrder: undefined,
      monthlyWeekday: undefined,
      yearlyDay: undefined,
      yearlyMonth: undefined,
      yearlyWeekdayOrder: undefined,
      yearlyWeekday: undefined,
    },
    end: endsOn,
    start: startsOn,
  };
  return weeklyRecurrence;
}

export function createMontlyRecurrence(
  repeatOn: string,
  startsOn: Date,
  endsOn: Date,
) {
  const specificDaySelected = repeatOn === "day";
  const monthlyRecurrence: Recurrence = {
    recurrence: true,
    recurrenceDescription: "Monthly event",
    frequency: "monthly",
    recurrenceParams: {
      monthlyType: specificDaySelected ? "specific_date" : "weekday",
      monthlyDay: specificDaySelected
        ? DateTime.fromJSDate(startsOn).day
        : undefined,
      monthlyWeekdayOrder: specificDaySelected
        ? undefined
        : getWeekOfMonth(startsOn),
      monthlyWeekday: specificDaySelected ? undefined : getWeekday(startsOn),
      //
      weeklyDays: undefined,
      //
      yearlyType: undefined,
      yearlyDay: undefined,
      yearlyMonth: undefined,
      yearlyWeekdayOrder: undefined,
      yearlyWeekday: undefined,
    },
    end: endsOn,
    start: startsOn,
  };
  return monthlyRecurrence;
}

export function createYearlyRecurrence(
  repeatOn: string,
  startDate: Date,
  endsOn: Date,
) {
  const specificDaySelected = repeatOn === "day";
  const yearlyRecurrence: Recurrence = {
    recurrence: true,
    recurrenceDescription: "Yearly event",
    frequency: "yearly",
    recurrenceParams: {
      yearlyType: specificDaySelected ? "specific_date" : "weekday",
      yearlyMonth: DateTime.fromJSDate(startDate).month,
      yearlyDay: specificDaySelected
        ? DateTime.fromJSDate(startDate).day
        : undefined,
      yearlyWeekdayOrder: specificDaySelected
        ? undefined
        : getWeekOfMonth(startDate),
      yearlyWeekday: specificDaySelected ? undefined : getWeekday(startDate),
      //
      weeklyDays: undefined,
      //
      monthlyType: undefined,
      monthlyDay: undefined,
      monthlyWeekdayOrder: undefined,
      monthlyWeekday: undefined,
    },
    end: endsOn,
    start: startDate,
  };
  return yearlyRecurrence;
}

export function getWeekOfMonth(
  date: Date,
): "first" | "second" | "third" | "fourth" | "last" {
  const dateTime = DateTime.fromJSDate(date);

  const startOfMonth = dateTime.startOf("month");

  const startWeekday = startOfMonth.weekday;

  const weekNumber = Math.ceil((dateTime.day + startWeekday - 1) / 7);
  const daysInMonth = dateTime.daysInMonth ?? 30;

  const isLastWeek = dateTime.day + 7 > daysInMonth;

  const weekNames = ["first", "second", "third", "fourth", "last"];

  return isLastWeek
    ? "last"
    : (weekNames[weekNumber - 1] as
        | "first"
        | "second"
        | "third"
        | "fourth"
        | "last");
}

export function getWeekday(date: Date): validDays {
  const dateTime = DateTime.fromJSDate(date);
  const weekday = dateTime.weekday;
  const weekdays: validDays[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  return weekdays[weekday - 1];
}
