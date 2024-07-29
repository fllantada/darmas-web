import { useEffect, useState } from "react";

import { cn } from "@/app/plataform/lib/utils";

import { ToggleGroup as Toggle, ToggleGroupItem } from "./ui/toggle-group";

export const toggleGroupClassNames =
  "inline bg-white py-1 px-1 rounded-full border-[#DBDCDF] border-[1px]";

export const toggleItemClassNames =
  "inline-flex items-center justify-center whitespace-nowrap transition-all data-[state=on]:bg-[#00C5B7] data-[state=on]:text-[#FFFFFF] rounded-full px-4 py-1.5 text-sm capitalize";

interface ToggleGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  options: string[];
  className?: string;
}

export const ToggleGroup = ({
  value,
  defaultValue,
  onValueChange,
  options,
  className,
}: ToggleGroupProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <Toggle
      type="single"
      onValueChange={newVal => {
        if (newVal && newVal !== internalValue && options.includes(newVal)) {
          setInternalValue(newVal);
          onValueChange(newVal);
        }
      }}
      value={internalValue}
      className={cn(toggleGroupClassNames, className)}
    >
      {options.map(item => (
        <ToggleGroupItem
          key={item}
          value={item}
          className={toggleItemClassNames}
        >
          {item}
        </ToggleGroupItem>
      ))}
    </Toggle>
  );
};

export default ToggleGroup;
