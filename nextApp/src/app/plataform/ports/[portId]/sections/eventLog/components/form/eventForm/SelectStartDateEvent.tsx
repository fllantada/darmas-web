import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { DateTime } from "luxon";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/app/plataform/lib/utils";

type IProps = {
  className?: string;
  value: Date;
  onChange: (value: Date) => void;
};

const minuteArray = Array.from(
  { length: Math.ceil(1440 / 30) },
  (_, index) => index * 30,
);

function formatMinutesToTime(minutes: number): string {
  if (minutes < 0 || minutes >= 1440) {
    throw new Error("Minutes must be between 0 and 1439");
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Converts 0 hours to 12 for AM

  return `${formattedHours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${amPm}`;
}

function minutesFromTime(dateTime: DateTime): number {
  // Extract the hour and minute
  const hour = dateTime.hour;
  const minute = dateTime.minute;

  // Calculate total minutes since the start of the day
  const totalMinutes = hour * 60 + minute;

  // Round to the nearest 30
  const rounded = Math.round(totalMinutes / 30) * 30;

  return rounded;
}

export function SelectStartDateEvent({ className, value, onChange }: IProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateTimeValue = useMemo(() => DateTime.fromJSDate(value), [value]);
  const time = useMemo(() => minutesFromTime(dateTimeValue), [dateTimeValue]);

  function onDateChange(newDate?: Date) {
    if (newDate) onChange(newDate);
  }

  function onTimeChange(time: string) {
    const timeInt = parseInt(time);
    const newDate = DateTime.fromJSDate(value)
      .set({
        hour: Math.floor(timeInt / 60),
        minute: timeInt % 60,
        second: 0,
        millisecond: 0,
      })
      .toJSDate();
    onChange(newDate);
  }

  return (
    <div className={className}>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild className="py-5">
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal rounded-full",
              !value && "text-muted-foreground",
            )}
          >
            {dateTimeValue.toFormat("dd MMM, yy")}
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            defaultMonth={value}
            selected={value}
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="inline-block ml-2">
        <Select onValueChange={onTimeChange} value={time.toString()}>
          <SelectTrigger className="rounded-full w-[140px] px-3">
            <SelectValue>{formatMinutesToTime(time)}</SelectValue>
            <Clock className="ml-2 h-4 w-4 inline" />
          </SelectTrigger>
          <SelectContent>
            {minuteArray.map((minute, idx) => (
              <SelectItem key={idx} value={minute.toString()}>
                {formatMinutesToTime(minute)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
