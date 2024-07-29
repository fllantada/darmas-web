import { useMemo, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/app/plataform/lib/utils";

type EndsOnProps = {
  startDate: Date;
  value: Date | undefined;
  onChange: (value: DateTime | undefined) => void;
};

export default function EndsOn({ startDate, value, onChange }: EndsOnProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  function onDateChange(date: Date | undefined) {
    setCalendarOpen(false);
    onChange(date ? DateTime.fromJSDate(date) : undefined);
  }

  const validEndValue = useMemo(() => {
    const defaultEndValue = DateTime.fromJSDate(startDate).plus({ days: 1 });
    if (!value) return defaultEndValue.toJSDate();
    const isInvalidEndValue =
      DateTime.fromJSDate(value) < DateTime.fromJSDate(startDate);

    if (isInvalidEndValue) {
      return defaultEndValue.toJSDate();
    }

    return value;
  }, [startDate, value]);

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="ends-on">
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild className="py-5">
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal rounded-full",
                !value && "text-muted-foreground",
              )}
            >
              {DateTime.fromJSDate(validEndValue).toFormat("dd MMM, yy")}

              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={validEndValue}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </Label>
    </div>
  );
}
