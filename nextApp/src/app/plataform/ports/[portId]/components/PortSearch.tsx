"use client";

import { useMemo, useState } from "react";
import { PortType } from "@/generated/graphql";
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

type PortSearchProps = {
  activePort: PortType;
  ports: PortType[];
  className?: string;
  disabled?: boolean;
  onNavigateToPort?: (portId: string) => void;
};

export default function PortSearch({
  activePort,
  ports,
  className,
  onNavigateToPort,
  disabled = false,
}: PortSearchProps): JSX.Element {
  const [open, setOpen] = useState(false);
  function onPortSelected(portId: string) {
    setOpen(false);
    onNavigateToPort?.(portId);
  }

  const sortedPorts = useMemo(() => {
    const sorted = ports.sort((a, b) => {
      return a.portCode.localeCompare(b.portCode);
    });

    return sorted;
  }, [ports]);

  // filter CNSHK, CNDLC, CNYTN, INCOK, INXIE, INTUT

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          className="p-0 font-medium text-2xl hover:bg-transparent"
          variant="ghost"
          disabled={disabled}
        >
          {activePort.portCode}
          <ChevronDown size={20} className="inline ml-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Type port name or code..." />
          <CommandList>
            <CommandEmpty>No ports found</CommandEmpty>
            {sortedPorts.map(port => (
              <CommandItem
                key={port.id}
                onSelect={() => {
                  onPortSelected(port.id);
                }}
              >
                [{port.portCode}] {port.portName}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
