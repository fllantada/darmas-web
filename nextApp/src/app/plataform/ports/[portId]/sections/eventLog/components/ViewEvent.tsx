import { DateTime } from "luxon";

import { Event, eventTypesLabels } from "../interfaces";
import { useEventLogStore } from "../store";
import { getScoreColor, iconMap } from "../utils";

type IProps = {
  event: Event;
};

export default function ViewEvent({ event }: IProps) {
  const Icon = iconMap[event.type];
  const riskScore = event.impactScore * event.likelihoodScore;
  const { port } = useEventLogStore();

  const luxonStart = DateTime.fromJSDate(event.start);
  const luxonEnd = DateTime.fromJSDate(event.end);

  return (
    <>
      <div className="border-b pb-2 mb-8 font-normal text-xl">
        {event?.title}
      </div>
      <div className="flex">
        <div className="flex-auto">
          <div className="font-normal text-sm">Event type</div>
          <div className="text-base font-medium">
            <Icon className="inline-block" /> {eventTypesLabels[event?.type]}
          </div>
        </div>
        <div className="flex-auto">
          <div className="font-normal text-sm">Start</div>
          <div className="text-base font-medium">
            {luxonStart.toFormat("HH:mm | dd LLL, yy")}
          </div>
        </div>
        <div className="flex-auto">
          <div className="font-normal text-sm">End</div>
          <div className="text-base font-medium">
            {luxonEnd.toFormat("HH:mm | dd LLL, yy")}
          </div>
        </div>
      </div>
      <div className="flex mt-5">
        <div className="flex-none mr-5">
          <div className="font-normal text-sm mb-2">Impact Score</div>
          <span className="text-base font-medium bg-slate-300 px-2 py-1 rounded-full">
            {event.impactScore}
          </span>
        </div>
        <div className="flex-none mr-5">
          <div className="font-normal text-sm mb-2">Likelihood Score</div>
          <span className="text-base font-medium bg-slate-300 px-2 py-1 rounded-full">
            {event.likelihoodScore}
          </span>
        </div>
        <div className="flex-none">
          <div className="font-normal text-sm mb-2">Risk Score</div>
          <span
            className="text-base font-medium px-2 py-1 rounded-full text-white"
            style={{
              backgroundColor: getScoreColor(riskScore),
            }}
          >
            {riskScore}
          </span>
        </div>
      </div>

      <div className="mt-5">
        Recurrence:
        <span className="text-base font-medium capitalize">
          {event?.recurrence?.recurrenceDescription}
        </span>
      </div>
      <div className="mt-5">
        Port:{" "}
        <span className="text-base font-medium">
          <span className="rounded bg-slate-300 px-2 py-1 mr-1">
            {port?.portCode}
          </span>
          {port?.portName}
        </span>
      </div>
      <div className="mt-5">
        Terminals:
        <span className="text-base font-medium  ml-1">
          {event.terminals.map(terminal => (
            <span
              key={terminal}
              className="rounded bg-slate-300 px-2 py-1 text-center mr-1"
            >
              {terminal}
            </span>
          ))}
        </span>
      </div>
      <div className="mt-5">
        Timezone:{" "}
        <span className="text-base font-medium">{event.timezone}</span>
      </div>
      <div className="mt-5">
        Description:
        <div className="mt-2">
          <span className="text-base font-medium whitespace-pre-wrap">
            {event.description}
          </span>
        </div>
      </div>
      <div className="mt-5">
        Reported by{" "}
        <span className="text-base font-medium">{event.reportedBy}</span>
      </div>
    </>
  );
}
