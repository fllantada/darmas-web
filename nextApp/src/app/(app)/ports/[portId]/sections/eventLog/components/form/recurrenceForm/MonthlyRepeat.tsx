import { useMemo } from "react";
import { DateTime } from "luxon";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getWeekOfMonth } from "./utils";

type MonthlyRepeatProps = {
  startDate: Date;
  value: string;
  onChange: (value: string) => void;
};

export default function MonthlyRepeat({
  startDate,
  value,
  onChange,
}: MonthlyRepeatProps) {
  const options = useMemo(() => {
    const startDateDateTime = DateTime.fromJSDate(startDate);
    const day = startDateDateTime.toFormat("d");
    const weekDay = startDateDateTime.toFormat("cccc");
    const weekNumber = getWeekOfMonth(startDate);
    return {
      day: `On the ${day}`,
      date: `On the ${weekNumber} ${weekDay} of the month`,
    };
  }, [startDate]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue>{options[value as keyof typeof options]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(options).map(key => (
          <SelectItem value={key} key={key}>
            {options[key as keyof typeof options]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
