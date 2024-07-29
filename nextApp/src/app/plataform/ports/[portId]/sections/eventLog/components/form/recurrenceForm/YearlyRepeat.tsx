import { useMemo } from "react";
import { DateTime } from "luxon";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type YearlyRepeatProps = {
  startDate: Date;
  value: string;
  onChange: (value: string) => void;
};

const positionLabels = ["first", "second", "third", "last"];

export default function YearlyRepeat({
  startDate,
  value,
  onChange,
}: YearlyRepeatProps) {
  const options = useMemo(() => {
    const startDateDateTime = DateTime.fromJSDate(startDate);
    const month = startDateDateTime.toFormat("LLLL");
    const day = startDateDateTime.toFormat("d");
    const date = startDateDateTime.toFormat("cccc");
    return {
      day: `On the ${day} of ${month}`,
      date: `On the ${positionLabels[Math.round(startDateDateTime.day / 7) - 1]} ${date} of ${month}`,
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
