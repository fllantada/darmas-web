"use client";

import { Control } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";

import { Event } from "../../../interfaces";
import { useEventLogStore } from "../../../store";

interface IProps {
  control: Control<Event>;
}

export function TerminalField({ control }: IProps) {
  const { port, terminals, selectedTerminal } = useEventLogStore();

  if (selectedTerminal) {
    return (
      <div className="mt-5">
        <div className="flex items-center gap-2">
          <div className="font-normal text-sm">Terminal:</div>
          <div className="text-base">
            <span className="rounded bg-slate-300 px-2 py-1 mr-1">
              {selectedTerminal.terminalCode}
            </span>
            {selectedTerminal?.terminalName}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      {
        <FormField
          control={control}
          name="terminals"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-1">
              <FormLabel className="font-normal text-sm pt-3">
                Terminal:
              </FormLabel>
              <MultiSelect
                search={false}
                selected={field.value || []}
                options={terminals.map(terminal => ({
                  label: (
                    <>
                      <span className="bg-slate-300 rounded px-2 py-1 mr-2">
                        {port?.portCode}
                        {terminal.terminalCode}
                      </span>
                      {terminal.terminalName}
                    </>
                  ),
                  tagLabel: port?.portCode + terminal.terminalCode,
                  value: terminal.terminalCode,
                }))}
                {...field}
                className="w-[400px]"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      }
    </div>
  );
}
