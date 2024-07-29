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

export type Terminal = {
  id: string;
  code: string;
  name: string;
};

type PortSearchProps = {
  activeTerminal: Terminal;
  terminals: Terminal[];
  className?: string;
  disabled?: boolean;
  onNavigateToTerminal?: (terminalId: string) => void;
};

export default function TerminalSearch({
  activeTerminal,
  terminals,
  className,
  onNavigateToTerminal,
  disabled = false,
}: PortSearchProps): JSX.Element {
  const [open, setOpen] = useState(false);
  function onTerminalSelected(terminalId: string) {
    setOpen(false);
    onNavigateToTerminal?.(terminalId);
  }

  const sortedTerminals = useMemo(
    () => terminals?.sort((a, b) => a.code.localeCompare(b.code)),
    [terminals],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          className="p-0 font-medium text-2xl hover:bg-transparent"
          variant="ghost"
          disabled={disabled}
        >
          {activeTerminal.name}
          <ChevronDown size={20} className="inline ml-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Type terminal name or code..." />
          <CommandList>
            <CommandEmpty>No terminal found</CommandEmpty>
            {sortedTerminals.map(terminal => (
              <CommandItem
                key={terminal.id}
                onSelect={() => {
                  onTerminalSelected(terminal.id);
                }}
              >
                [{terminal.code}] {terminal.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
