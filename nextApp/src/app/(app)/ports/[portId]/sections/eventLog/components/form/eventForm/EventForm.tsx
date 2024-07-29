import { forwardRef, useEffect, useImperativeHandle } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";

/* import { Checkbox } from "@/components/ui/checkbox"; */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Event, EventType, eventTypesLabels } from "../../../interfaces";
import { useEventLogStore } from "../../../store";
import { getScoreColor, iconMap, rawIconMap } from "../../../utils";
import RecurrenceDialog from "../recurrenceForm/RecurrenceForm";
import {
  eventFormSchema,
  impactStoreOptions,
  likelihoodStoreOptions,
} from "./config";
import { SelectStartDateEvent } from "./SelectStartDateEvent";
import { TerminalField } from "./TerminalField";

export type FormProps = {
  onSubmit: (data: Event) => void;
};
export interface FormMethods {
  submitForm: () => void;
}

const EventForm = forwardRef<FormMethods, FormProps>(function EventForm(
  { onSubmit },
  ref,
) {
  const event = useEventLogStore(state => state.selectedEvent);
  const selectedTerminal = useEventLogStore(state => state.selectedTerminal);

  const form = useForm<Event>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      type: event?.type,
      title: event?.title || "",
      start: event?.start
        ? event.start
        : DateTime.now().startOf("day").toJSDate(),
      end: event?.end
        ? event.end
        : DateTime.now().startOf("day").plus({ minutes: 30 }).toJSDate(),
      impactScore: event?.impactScore || 0,
      likelihoodScore: event?.likelihoodScore || 0,
      recurrence: event?.recurrence,
      allDay: event?.allDay || false,
      timezone: event?.timezone,
      terminals: selectedTerminal
        ? [selectedTerminal.terminalCode]
        : event?.terminals,
      description: event?.description || "",
    },
  });

  useImperativeHandle(ref, () => ({
    submitForm: form.handleSubmit(onSubmit, (errors, event) => {
      // eslint-disable-next-line no-console
      console.log(errors, event);
    }),
  }));

  const { port } = useEventLogStore();
  const likelihoodScore = form.watch("likelihoodScore");
  const impactScore = form.watch("impactScore");
  const startDate = form.watch("start");
  const riskScore = likelihoodScore * impactScore;

  useEffect(() => {
    return () => {
      useEventLogStore.getState().unSelectEventOnCalendar();
    };
  }, []);

  return (
    <Form {...form}>
      <form>
        <div className="border-b pb-2 mb-8 font-normal text-l">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex">
          <div className="flex-auto">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-sm">
                    Event Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="rounded-full">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(rawIconMap).map((key, idx) => {
                        const Icon = iconMap[key as EventType];
                        return (
                          <SelectItem key={idx} value={key}>
                            <Icon className="inline-block mr-2" />
                            {eventTypesLabels[key as EventType]}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-auto ">
            <div className="flex flex-row justify-start  ">
              <div className="mr-2">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal text-sm">
                        Start
                      </FormLabel>
                      <FormControl>
                        <div>
                          <SelectStartDateEvent
                            value={field.value}
                            onChange={date => {
                              field.onChange(date);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-sm">End</FormLabel>
                    <FormControl>
                      <SelectStartDateEvent
                        value={field.value}
                        onChange={date => {
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-5">
          <div className="flex-none mr-5">
            <FormField
              control={form.control}
              name="impactScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-sm">
                    Impact Score
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl className="rounded-full">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {impactStoreOptions.map(score => (
                        <SelectItem key={score.value} value={score.value}>
                          <span className="bg-slate-300 rounded px-2 py-1 mr-2">
                            {score.value}
                          </span>
                          {score.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-none mr-5">
            <FormField
              control={form.control}
              name="likelihoodScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-normal text-sm">
                    Likelihood Score
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl className="rounded-full">
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {likelihoodStoreOptions.map(score => (
                        <SelectItem key={score.value} value={score.value}>
                          <span className="bg-slate-300 rounded px-2 py-1 mr-2">
                            {score.value}
                          </span>
                          {score.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-none">
            <div className="font-normal text-sm mb-4">Risk Score</div>
            <span
              className="text-base font-medium px-2 py-2 rounded-full text-white block-inline"
              style={{
                backgroundColor: getScoreColor(riskScore),
              }}
            >
              {riskScore}
            </span>
          </div>
        </div>
        {/*   <div className="mt-5 flex items-center space-x-2">
          <FormField
            control={form.control}
            name="allDay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal text-sm">
                  All Day Event
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
        <div className="mt-5">
          <RecurrenceDialog startDate={startDate} />
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <div className="font-normal text-sm">Port:</div>
            <div className="text-base">
              <span className="rounded bg-slate-300 px-2 py-1 mr-1">
                {port?.portCode}
              </span>
              {port?.portName}
            </div>
          </div>
        </div>
        <TerminalField control={form.control} />
        <div className="mt-5">
          <div className="flex gap-2 items-center">
            <div className="font-normal text-sm">Time Zone:</div>
            <div className="text-base">{event?.timezone || port?.timezone}</div>
          </div>
        </div>
        <div className="mt-5">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal text-sm">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {event && (
          <div className="mt-5">
            Reported by{" "}
            <span className="text-base font-medium">{event.reportedBy}</span>
          </div>
        )}
      </form>
    </Form>
  );
});

export default EventForm;
