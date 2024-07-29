import { DateTime } from "luxon";

import type { Event } from "../interfaces";
import { getScoreColor, iconMap } from "../utils";

type LogRowProps = {
  event: Event;
};

export default function EventRow({ event }: LogRowProps) {
  const Icon = iconMap[event.type];
  const riskScore = event.impactScore * event.likelihoodScore;
  const scoreColor = getScoreColor(riskScore);

  const luxonStart = DateTime.fromJSDate(event.start);
  const luxonEnd = DateTime.fromJSDate(event.end);

  return (
    <div className="mb-3 rounded-md ">
      <div className="bg-[#F0FCFB] p-2 flex">
        <div className="flex-auto text-sm font-bold">{event.title}</div>
        <div className="flex-none">
          <span className="text-[11px] font-medium mr-1">{event.type}</span>
          <Icon className="inline-block" />
        </div>
      </div>
      <div className="bg-[#E0EFEE] p-2 text-[11px] font-medium flex">
        <div className="flex-auto">
          ({luxonStart.toFormat("ZZZZ")})&nbsp;
          <span className="bg-[#F0FCFB] p-1 m rounded-md">
            {luxonStart.toFormat("HH:mm | dd LLL, yy")}
          </span>
          &nbsp;-&nbsp;
          <span className="bg-[#F0FCFB] p-1 rounded-md">
            {luxonEnd.toFormat("HH:mm | dd LLL, yy")}
          </span>
        </div>
        <div className="flex-none">
          Score
          <span
            style={{ backgroundColor: scoreColor }}
            className="p-1 ml-1 text-sm font-bold text-white rounded-sm"
          >
            {riskScore}
          </span>
        </div>
      </div>
    </div>
  );
}
