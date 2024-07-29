import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/app/plataform/lib/utils";

export type Option = {
  label: string;
  key: string;
  icon?: React.ComponentType<{ className?: string }>;
  selected: boolean;
};

interface DataTableFacetedFilterProps {
  icon?: JSX.Element;
  title?: string;
  popoverClassName?: string;
  options: Option[];
  onChange: (option: { key: string; selected: boolean }) => void;
  onReset?: () => void;
}

export function ComboMultiSelect({
  title,
  icon,
  popoverClassName,
  options,
  onChange,
  onReset,
}: DataTableFacetedFilterProps) {
  const selectedValues = options.filter(o => o.selected).map(o => o.key);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 !py-5 border-dashed mx-2">
          {icon || <PlusCircledIcon className="w-4 h-4 mr-2" />}

          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <Badge
                variant="secondary"
                className="px-1 font-normal rounded-sm lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="px-1 font-normal rounded-sm"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter(option => selectedValues.includes(option.key))
                    .map(option => (
                      <Badge
                        variant="secondary"
                        key={option.key}
                        className="px-1 font-normal rounded-sm"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[200px] p-0", popoverClassName)}
        align="start"
      >
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(({ key, icon: Icon, label }) => {
                const isSelected = selectedValues.includes(key);
                return (
                  <CommandItem
                    key={key}
                    onSelect={() => {
                      onChange({
                        key: key,
                        selected: !isSelected,
                      });
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {Icon && (
                      <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={onReset}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
