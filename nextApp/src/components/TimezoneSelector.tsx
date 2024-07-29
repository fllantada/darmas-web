import { getTimeZones } from "@vvo/tzdb";
import { DateTime } from "luxon";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const timezones = getTimeZones().map(({ name }) => ({
  name,
  offset: DateTime.now().setZone(name).toFormat("Z"),
}));

type TimezoneSelectorProps = {
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
};

export default function TimezoneSelector({
  className,
  value,
  onValueChange,
}: TimezoneSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {timezones.map(timezone => (
          <SelectItem value={timezone.name} key={timezone.name}>
            {timezone.name} (GMT{timezone.offset})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
