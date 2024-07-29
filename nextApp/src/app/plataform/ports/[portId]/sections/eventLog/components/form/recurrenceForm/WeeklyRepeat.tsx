import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/app/plataform/lib/utils";

import { validDays } from "../../../interfaces";

type WeeklyRepeatProps = {
  className?: string;
  value: string | null;
  onChange: (value: string) => void;
};

const daysOfWeek: {
  value: validDays;
  label: string;
}[] = [
  { value: "SU", label: "Sun" },
  { value: "MO", label: "Mon" },
  { value: "TU", label: "Tue" },
  { value: "WE", label: "Wed" },
  { value: "TH", label: "Thu" },
  { value: "FR", label: "Fri" },
  { value: "SA", label: "Sat" },
];

export default function WeeklyRepeat({
  className,
  value,
  onChange,
}: WeeklyRepeatProps) {
  function onValueChange(value: string[]) {
    onChange(value.join(","));
  }

  return (
    <ToggleGroup
      type="multiple"
      value={value ? value.split(",") : []}
      onValueChange={onValueChange}
      className={cn("bg-transparent space-x-3", className)}
    >
      {daysOfWeek.map(day => (
        <ToggleGroupItem
          key={day.value}
          value={day.value}
          className="data-[state=on]:shadow-none data-[state=on]:bg-primary data-[state=on]:text-white px-2 inline-block"
        >
          {day.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
