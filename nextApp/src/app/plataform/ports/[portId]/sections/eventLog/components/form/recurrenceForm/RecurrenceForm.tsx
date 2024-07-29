import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/app/plataform/lib/utils";

import { DefaultRecurrency, Recurrence } from "../../../interfaces";
import { useEventLogStore } from "../../../store";
import EndsOn from "./EndsOn";
import MonthlyRepeat from "./MonthlyRepeat";
import {
  createMontlyRecurrence,
  createWeeklyRecurrence,
  createYearlyRecurrence,
} from "./utils";
import WeeklyRepeat from "./WeeklyRepeat";
import YearlyRepeat from "./YearlyRepeat";

export enum Frequency {
  NONE = "none",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

const formSchema = z
  .object({
    frequency: z.nativeEnum(Frequency).nullable(),
    repeatOn: z.string().nullable().optional(),
    endsOn: z.custom<DateTime>(date => DateTime.isDateTime(date)),
  })
  .refine(data => !(data.frequency === Frequency.WEEKLY && !data.repeatOn), {
    message: "Select at least one day of the week",
    path: ["repeatOn"],
  });

export type RecurrenceFormValues = z.infer<typeof formSchema>;

type IProps = {
  startDate: Date;
};

export default function RecurrenceDialog({ startDate }: IProps) {
  const [open, setOpen] = useState(false);
  const storeRecurrency = useEventLogStore(state => state.recurrence);

  const defaultFormValues: RecurrenceFormValues = useMemo(() => {
    const recurrenceParams = storeRecurrency.recurrenceParams;

    if (!storeRecurrency || !recurrenceParams)
      return {
        frequency: Frequency.NONE,
        repeatOn: undefined,
        endsOn: DateTime.fromJSDate(startDate),
      };

    const recurrenceEnd = storeRecurrency.end;
    const recurrenceFrequency = storeRecurrency.frequency;
    switch (recurrenceFrequency) {
      case "weekly":
        return {
          frequency: Frequency.WEEKLY,
          repeatOn:
            recurrenceParams?.weeklyDays &&
            recurrenceParams?.weeklyDays.length > 0
              ? recurrenceParams.weeklyDays.join(",")
              : null,
          endsOn: recurrenceEnd
            ? DateTime.fromJSDate(recurrenceEnd)
            : DateTime.fromJSDate(startDate),
        };

      case "monthly":
        return {
          frequency: Frequency.MONTHLY,
          repeatOn:
            recurrenceParams.monthlyType === "specific_date" ? "day" : "date",
          endsOn: recurrenceEnd
            ? DateTime.fromJSDate(recurrenceEnd)
            : DateTime.fromJSDate(startDate),
        };

      case "yearly":
        return {
          frequency: Frequency.YEARLY,
          repeatOn:
            recurrenceParams.yearlyType === "specific_date" ? "day" : "date",
          endsOn: recurrenceEnd
            ? DateTime.fromJSDate(recurrenceEnd)
            : DateTime.fromJSDate(startDate),
        };

      default:
        return {
          frequency: null,
          repeatOn: undefined,
          endsOn: DateTime.fromJSDate(startDate),
        };
    }
  }, [storeRecurrency, startDate]);

  const form = useForm<RecurrenceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const repeat = form.watch("frequency");

  const handleOpen = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(true);
  };
  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
  };
  const handleSave = (event: React.MouseEvent) => {
    event.preventDefault();
    let newRecurrence: Recurrence = DefaultRecurrency;
    const recurrenceFormValues = form.getValues();
    const { frequency, endsOn, repeatOn } = recurrenceFormValues;
    if (frequency === Frequency.WEEKLY && repeatOn) {
      newRecurrence = createWeeklyRecurrence(
        repeatOn,
        startDate,
        endsOn.toJSDate(),
      );
    }
    if (frequency === Frequency.MONTHLY && repeatOn) {
      newRecurrence = createMontlyRecurrence(
        repeatOn,
        startDate,
        endsOn.toJSDate(),
      );
    }
    if (frequency === Frequency.YEARLY && repeatOn) {
      newRecurrence = createYearlyRecurrence(
        repeatOn,
        startDate,
        endsOn.toJSDate(),
      );
    }
    useEventLogStore.getState().updateRecurrence(newRecurrence);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <div className={"flex flex-row items-center justify-start"}>
        <div>
          <span>Recurrence:</span>
        </div>
        <Button
          onClick={handleOpen}
          variant="outline"
          className={cn("rounded-full capitalize font-normal ml-[20px] block")}
        >
          {storeRecurrency?.recurrenceDescription || "Do not repeat"}
        </Button>
      </div>

      <DialogContent size="2xl" showCloseButton={false}>
        <DialogHeader className="text-xl font-medium border-b pb-3">
          Recurrence
        </DialogHeader>
        <div>
          <span className="text-sm text-muted-foreground">
            This event will repeat based on the selected options from{" "}
            {DateTime.fromJSDate(startDate).toFormat("dd MMM, yyyy")}
          </span>
        </div>
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() || Frequency.NONE}
                      onValueChange={newFrequency => {
                        form.setValue(
                          "repeatOn",
                          newFrequency === Frequency.WEEKLY ? "" : "day",
                        );
                        field.onChange(newFrequency);
                      }}
                    >
                      <SelectTrigger className="rounded-full bg-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Frequency.NONE}>
                          Do no repeat
                        </SelectItem>
                        <SelectItem value={Frequency.WEEKLY}>Weekly</SelectItem>
                        <SelectItem value={Frequency.MONTHLY}>
                          Monthly
                        </SelectItem>
                        <SelectItem value={Frequency.YEARLY}>Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {repeat && repeat !== Frequency.NONE && (
              <>
                <FormField
                  control={form.control}
                  name="repeatOn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat On</FormLabel>
                      <FormControl>
                        <>
                          {repeat === Frequency.WEEKLY && (
                            <WeeklyRepeat
                              className="block"
                              value={field.value ?? ""}
                              onChange={field.onChange}
                            />
                          )}
                          {repeat === Frequency.MONTHLY && (
                            <MonthlyRepeat
                              startDate={startDate}
                              value={field.value ?? "day"}
                              onChange={field.onChange}
                            />
                          )}
                          {repeat === Frequency.YEARLY && (
                            <YearlyRepeat
                              startDate={startDate}
                              value={field.value ?? "day"}
                              onChange={field.onChange}
                            />
                          )}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endsOn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ends On</FormLabel>
                      <FormControl>
                        <EndsOn
                          startDate={startDate}
                          value={field.value?.toJSDate()}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button className="rounded-full" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
