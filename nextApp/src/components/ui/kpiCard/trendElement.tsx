import { cn, isNotNullOrUndefined } from "@/lib/utils";

import TrendDownIcon from "../../icons/trendDown";
import TrendUpIcon from "../../icons/trendUp";
import { ComparisonTrend } from "./kpiCard";

type IProps = {
  comparisonResult: string | boolean | null | undefined;
  comparisonTrend?: ComparisonTrend;
  hover?: boolean;
};

export function TrendElement({
  comparisonResult,
  comparisonTrend,
  hover = false,
}: IProps): JSX.Element {
  if (comparisonResult === false) return <></>;

  if (isNotNullOrUndefined(comparisonResult)) {
    return (
      <span
        className={cn(
          "font-semibold inline-block",
          comparisonTrend === ComparisonTrend.DOWN
            ? "text-red-600"
            : "text-green-600",
          hover ? "text-xs" : "text-sm",
        )}
      >
        {comparisonTrend == ComparisonTrend.DOWN ? (
          <TrendDownIcon />
        ) : (
          <TrendUpIcon />
        )}
        {comparisonResult}
      </span>
    );
  } else {
    return (
      <span className="text-slate-400">
        <TrendUpIcon />
        --
      </span>
    );
  }
}
