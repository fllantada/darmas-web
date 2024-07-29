import React from "react";

import { cn, isNotNullOrUndefined } from "@/app/plataform/lib/utils";

type DataCell = {
  actual?: number | null;
  proforma?: number | null;
  delta?: number | null;
  isForecast?: boolean;
};

export type CommercialReliabilityProps = {
  polPorts: string[];
  podPorts: string[];
  matrix: (DataCell | null)[][];
};

const cellBgColors = {
  green: "rgba(0, 197, 183, 0.05)",
  red: "rgba(223, 45, 45, 0.11)",
  yellow: "rgba(223, 205, 45, 0.27)",
  grey: "rgba(241,242,244,1)",
};

function cellBgColor(delta: number | undefined | null): string {
  if (isNotNullOrUndefined(delta)) {
    if (delta >= -1 && delta <= 1) {
      return cellBgColors.green;
    } else if (delta > 1) {
      return cellBgColors.red;
    } else {
      return cellBgColors.yellow;
    }
  } else {
    return cellBgColors.grey;
  }
}

function deltaTextColor(delta: number | undefined | null): string {
  if (isNotNullOrUndefined(delta)) {
    if (delta >= -1 && delta <= 1) {
      return "text-green-500";
    } else {
      return "text-red-500";
    }
  } else {
    return "text-slate-500";
  }
}

export default function CommercialReliability({
  polPorts,
  podPorts,
  matrix,
}: CommercialReliabilityProps): JSX.Element {
  return (
    <div>
      <div className="flex justify-center mt-2 text-xs text-slate-600 gap-5 items-center">
        <div>
          <span className="border-2 border-dashed size-4 mr-2 inline-block align-middle border-slate-300" />
          Forecast
        </div>
        <div className="flex gap-2">
          <div>
            <span
              className="size-2 rounded-full mr-1 inline-block"
              style={{ backgroundColor: "rgba(76, 157, 33, 0.29)" }}
            />{" "}
            On Time
          </div>
          <div>
            <span
              className="size-2 rounded-full mr-1 inline-block"
              style={{ backgroundColor: "rgba(252, 232, 232, 1)" }}
            />{" "}
            Off Time (Late)
          </div>
          <div>
            <span
              className="size-2 rounded-full mr-1 inline-block"
              style={{ backgroundColor: "rgba(246, 241, 198, 1)" }}
            />{" "}
            Off Time (Early)
          </div>
          <div># - Actual</div>
          <div># - Proforma</div>
        </div>
      </div>
      <div className="w-full mt-2 p-3">
        <table className="table-auto w-full border border-slate-300">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2">POL/POD</td>
              {podPorts.map((pod, idx) => (
                <td
                  key={`${pod}-${idx}`}
                  className="border border-slate-300 text-center"
                >
                  {pod}
                </td>
              ))}
            </tr>
            {polPorts.map((pol, idx) => (
              <tr key={`${pol}-${idx}`}>
                <td className="border border-slate-300 p-2">{pol}</td>
                {matrix[idx].map((data, idx) => (
                  <React.Fragment key={idx}>
                    {data ? (
                      <td
                        className={cn(
                          "border-slate-300 text-center",
                          data.isForecast ? "border-dashed border-2" : "border",
                        )}
                        style={{
                          backgroundColor: cellBgColor(data.delta),
                        }}
                      >
                        <span className="text-sm font-medium mr-3">
                          {data.actual ? data.actual.toFixed(0) : "--"}
                        </span>
                        <span className="text-[10px] font-normal mr-3">
                          {data.proforma ? data.proforma.toFixed(0) : "--"}
                        </span>
                        <span
                          className={cn(
                            "text-[8px] font-normal",
                            deltaTextColor(data.delta),
                          )}
                        >
                          {isNotNullOrUndefined(data.delta)
                            ? (data.delta > 0 ? "+" : "") +
                              data.delta.toFixed(0)
                            : "--"}{" "}
                          D
                        </span>
                      </td>
                    ) : (
                      <td className="border border-slate-300 text-center" />
                    )}
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
