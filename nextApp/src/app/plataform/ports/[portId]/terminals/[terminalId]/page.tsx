import { Suspense } from "react";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { notFound } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTitle,
} from "@/components/ui/collapsible";
import { CrumbSetter } from "@/app/plataform/contexts/BreadcrumbContext";

/* import { EventLogSC } from "../../sections/eventLog/EventLogSC";
import { EventLogSkeleton } from "../../sections/eventLog/EventLogSkeleton"; */
import BerthList from "./components/BerthList";
import Heading from "./components/Heading";
import { TerminalFacilities } from "./sections/facilities/TerminalFacilities";
import { HeaderKpiSection } from "./sections/headerKpis/TerminalHeaderKpis";
import MapError from "./sections/PortMap/error";
import TerminalMap from "./sections/PortMap/Map";
import { TerminalLineUpSC } from "./sections/terminalLineUp/TerminalLineUpSC";
import { TermialLineUpSkeleton } from "./sections/terminalLineUp/TerminalLineUpSkeleton";

interface TerminalPageProps {
  params: {
    terminalId: string;
    portId: string;
  };
}

export async function generateMetadata({
  params: { terminalId, portId },
}: TerminalPageProps): Promise<Metadata> {
  return {};
}

export default async function TerminalPage({
  params: { terminalId, portId },
}: TerminalPageProps) {
  const terminal = {} as any;
  const portInfo = {} as any;

  /* const terminalData = await genTerminalData(); // Mock data to be removed */
  return (
    <>
      <div className="flex">
        <div className="flex-none w-[415px] bg-white border-2 rounded-md border-[#DBDCDF] mr-4">
          <Heading
            className="px-3 pt-3 pb-6 border-b-[1px] border-[#DBDCDF]"
            terminal={terminal}
            port={portInfo}
          />
          <div className="mt-4 p-3 border-b-[1px] border-[#DBDCDF]">
            <Collapsible startOpen={true}>
              <CollapsibleTitle>
                <h2>Berth</h2>
              </CollapsibleTitle>
              <CollapsibleContent>
                <BerthList terminal={terminal} port={portInfo} />
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="mt-4 p-3 border-b-[1px] border-[#DBDCDF]">
            {/*   <Suspense fallback={<EventLogSkeleton />}>
              <EventLogSC
                portId={portInfo.id}
                terminalCode={terminal.terminalCode}
              />
            </Suspense> */}
          </div>
          <TerminalFacilities terminalId={terminalId} />
        </div>
        <div className="flex-auto">
          <HeaderKpiSection terminalId={terminal.id} />

          <div className="bg-white border-2 rounded-md border-[#DBDCDF] h-[400px] mt-3 p-2">
            <ErrorBoundary errorComponent={MapError}>
              <TerminalMap terminal={terminal} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <div className="p-2 mt-3 bg-white rounded-md min-h-[1000px]">
        <Suspense fallback={<TermialLineUpSkeleton />}>
          <TerminalLineUpSC terminalId={terminalId} />
        </Suspense>
      </div>
    </>
  );
}
