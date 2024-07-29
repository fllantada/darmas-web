"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRightFromSquare } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTitle,
} from "@/components/ui/collapsible";

type TerminalListProps = {
  port: any;
};

export default function TerminalList({ port }: TerminalListProps) {
  /*  const terminals = useMemo(
    () =>
      port?.terminals?.sort((a, b) =>
        `${port.portCode}${a.terminalCode}`.localeCompare(
          `${port.portCode}${b.terminalCode}`,
        ),
      ),
    [port.portCode, port?.terminals],
  );
 */

  const terminals: any = [];
  return (
    <>
      {terminals && terminals.length > 0 ? (
        terminals.map((terminal: any) => (
          <div className="bg-slate-100 p-2 mb-1" key={terminal.id}>
            <Collapsible>
              <CollapsibleTitle>
                <div className="font-medium test-sm">
                  {terminal.terminalCode}
                  <Link
                    href={`/ports/${port.id}/terminals/${terminal.id}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <ArrowUpRightFromSquare className="inline ml-2" size={12} />
                  </Link>
                </div>
              </CollapsibleTitle>
              <CollapsibleContent>
                <div className="ml-3 my-1">
                  {/*     {terminal.berths && terminal.berths.length > 0 ? (
                    terminal.berths
                      .sort((a, b) =>
                        `${port.portCode}${a.berthName}`.localeCompare(
                          `${port.portCode}${b.berthName}`,
                        ),
                      )
                      .map((berth, index) => (
                        <div
                          key={`${index}-${berth.berthName}`}
                          className="my-4"
                        >
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
                      ))
                  ) : (
                    <div className="text-slate-400 text-center my-3">
                      <AlertCircle className="inline mb-2" size={30} />
                      <br />
                      There are no berths for this terminal.
                    </div>
                  )} */}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))
      ) : (
        <div className="text-slate-400 text-center my-3">
          <AlertCircle className="inline mb-2" size={30} />
          <br />
          There are no terminals for this port.
        </div>
      )}
    </>
  );
}
