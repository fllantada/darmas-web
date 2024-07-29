"use client";

import { useMemo } from "react";
import { PortType, TerminalType } from "@/generated/graphql";
import { AlertCircle } from "lucide-react";

type BerthListProps = {
  terminal: TerminalType;
  port: PortType;
};

export default function BerthList({ terminal, port }: BerthListProps) {
  const berths = useMemo(
    () =>
      terminal?.berths?.sort((a, b) =>
        `${port.portCode}`.localeCompare(`${port.portCode}${b.berthName}`),
      ),
    [port.portCode, terminal?.berths],
  );

  return (
    <>
      {berths && berths.length > 0 ? (
        berths.map((berth, index) => (
          <div
            className="bg-slate-100 p-2 mb-1"
            key={`${index}-${berth.berthName}`}
          >
            <div>
              <div className="text-medium text-sm">
                {port.portCode}
                {berth.berthName}
              </div>
              <div className="text-normal text-sm text-slate-500">
                LOA: {berth.length}
                {berth.lengthUnit}
                &nbsp;&nbsp;&nbsp;&nbsp; Depth: {berth.depth}
                {berth.depthUnit}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-slate-400 text-center my-3">
          <AlertCircle className="inline mb-2" size={30} />
          <br />
          There are no berths for this terminal.
        </div>
      )}
    </>
  );
}
