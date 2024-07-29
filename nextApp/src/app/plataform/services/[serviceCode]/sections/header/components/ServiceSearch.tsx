"use client";

import { useMemo, useState } from "react";
import { ServiceType } from "@/generated/graphql";
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

type ServiceSearchProps = {
  services: ServiceType[];
  activeService: ServiceType;
  className?: string;
  disabled?: boolean;
  onNavigateToService?: (serviceCode: string) => void;
};

export default function ServiceSearch({
  services,
  activeService,
  className,
  onNavigateToService,
  disabled = false,
}: ServiceSearchProps): JSX.Element {
  const [open, setOpen] = useState(false);
  function onServiceSelected(serviceCode: string) {
    setOpen(false);
    onNavigateToService?.(serviceCode);
  }
  const sortedServices = useMemo(
    () =>
      services.sort((a, b) => {
        if (a.serviceCode && b.serviceCode) {
          return a.serviceCode.localeCompare(b.serviceCode);
        }
        return 0;
      }),
    [services],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="ghost"
          disabled={disabled}
          className="p-0 font-medium text-2xl"
        >
          {`[${activeService.serviceCode}] ${activeService.serviceName || ""}`}
          <ChevronDown size={20} className="inline ml-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px]" align="start">
        <Command>
          <CommandInput placeholder="Type service name or code..." />
          <CommandList>
            <CommandEmpty>No services found</CommandEmpty>
            {sortedServices.map(service => (
              <CommandItem
                key={service.serviceCode}
                onSelect={() => {
                  onServiceSelected(service.serviceCode);
                }}
              >
                [{service.serviceCode}] {service.serviceName?.trim()}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
