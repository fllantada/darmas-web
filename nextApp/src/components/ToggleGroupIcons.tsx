import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { ToggleGroup as Toggle, ToggleGroupItem } from "./ui/toggle-group";

export const toggleGroupClassNames =
  "inline bg-white rounded-full border-[#DBDCDF] border-[1px] pt-2";

export const toggleItemClassNames =
  "inline-flex items-center justify-center whitespace-nowrap transition-all data-[state=on]:bg-[#00C5B7] data-[state=on]:text-[#FFFFFF] rounded-full text-sm capitalize";

type ToggleOption = {
  value: string;
  element: JSX.Element;
};

interface ToggleGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange: (value: string) => void;
  options: ToggleOption[];
  className?: string;
}

export const ToggleGroupIcons = ({
  value,
  defaultValue,
  onValueChange,
  options,
  className,
}: ToggleGroupProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const values = useMemo(() => options.map(item => item.value), [options]);

  useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <Toggle
      type="single"
      onValueChange={newVal => {
        if (newVal && newVal !== internalValue && values.includes(newVal)) {
          setInternalValue(newVal);
          onValueChange(newVal);
        }
      }}
      value={internalValue}
      className={cn(toggleGroupClassNames, className)}
    >
      {options.map(item => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          className={toggleItemClassNames}
        >
          {item.element}
        </ToggleGroupItem>
      ))}
    </Toggle>
  );
};

export default ToggleGroupIcons;
