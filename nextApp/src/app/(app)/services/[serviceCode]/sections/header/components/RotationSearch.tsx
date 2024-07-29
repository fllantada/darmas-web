"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Rotation = {
  id: string;
  name: string;
};

type RotationeSearchProps = {
  rotations: Rotation[];
  activeRotation?: Rotation;
  className?: string;
  disabled?: boolean;
  onNavigateToRotation?: (serviceCode: string) => void;
};

export default function RotationSearch({
  rotations,
  activeRotation,
  className,
  onNavigateToRotation,
  disabled = false,
}: RotationeSearchProps): JSX.Element {
  const [open, setOpen] = useState(false);
  function onRotationSelected(rotationId: string) {
    setOpen(false);
    onNavigateToRotation?.(rotationId);
  }
  const sortedRotations = useMemo(
    () => rotations.sort((a, b) => a.name.localeCompare(b.name)),
    [rotations],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant={activeRotation ? "ghost" : "outline"}
          disabled={disabled}
          className={
            activeRotation
              ? "p-0 font-medium text-2xl"
              : "bg-white py-5 px-4 font-normal rounded-full text-sm border-[#DBDCDF] border-[1px] select-none "
          }
        >
          {activeRotation?.name ?? "Search: Voyage"}
          <ChevronDown size={17} className="inline ml-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Type voyage code..." />
          <CommandList>
            <CommandEmpty>No rotations found</CommandEmpty>
            {sortedRotations.map(rotation => (
              <CommandItem
                key={rotation.id}
                onSelect={() => {
                  onRotationSelected(rotation.id);
                }}
              >
                {rotation.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
