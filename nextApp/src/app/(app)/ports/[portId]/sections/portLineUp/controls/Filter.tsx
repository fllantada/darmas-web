"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FilterConditions } from "../domain/interfaces";
import { usePortTimeline } from "../stores/usePortTimeline";

interface IProps {}

export function TimelineFilters({}: IProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const [checked, setChecked] = useState<FilterConditions>({
    Operated: true,
    Partner: true,
    Others: true,
  });
  useEffect(() => {
    usePortTimeline.getState().filterVessels(checked);
  }, [checked]);

  const handleCheck = (checked: boolean | string, item: string) => {
    setChecked(prev => ({
      ...prev,
      [item]: checked,
    }));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={
            "bg-white py-5 px-4 font-normal rounded-full text-sm border-[#DBDCDF] border-[1px] select-none "
          }
        >
          {"Vessel Type"}
          <ChevronDown size={17} className="inline ml-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[150px] z-0" align="start">
        <Command>
          <CommandList>
            <CommandItem>
              <Checkbox
                defaultChecked={checked.Operated}
                checked={checked.Operated}
                onCheckedChange={newCheckedValue => {
                  handleCheck(newCheckedValue, "Operated");
                }}
                className={
                  "border-operatedVessel data-[state=checked]:bg-operatedVessel "
                }
              />
              <span className={"ml-2"}> {"Operated"} </span>
            </CommandItem>
            <CommandItem>
              <Checkbox
                defaultChecked={checked.Partner}
                onCheckedChange={newCheckedValue => {
                  handleCheck(newCheckedValue, "Partner");
                }}
                className={
                  "border-partnerVessel data-[state=checked]:bg-partnerVessel "
                }
              />
              <span className={"ml-2"}> {"Partner"} </span>
            </CommandItem>
            <CommandItem>
              <Checkbox
                className={
                  "border-otherVessel data-[state=checked]:bg-otherVessel "
                }
                defaultChecked={checked.Others}
                onCheckedChange={newCheckedValue => {
                  handleCheck(newCheckedValue, "Others");
                }}
              />
              <span className={"ml-2"}> {"Others"} </span>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
