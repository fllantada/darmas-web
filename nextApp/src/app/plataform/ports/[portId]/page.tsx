import { Suspense } from "react";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { notFound } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTitle,
} from "@/components/ui/collapsible";
import { Toaster } from "@/components/ui/sonner";
import { CrumbSetter } from "@/app/plataform/contexts/BreadcrumbContext";

import Heading from "./components/Heading";
import TerminalList from "./components/TerminalList";
/* import { EventLogSC } from "./sections/eventLog/EventLogSC";
import { EventLogSkeleton } from "./sections/eventLog/EventLogSkeleton"; */
import PortIntroduction from "./sections/portIntroduction/PortIntroduction";
import PortHeaderKpisSC from "./sections/portKpis/PortHeaderKpisSC";
import { PortHeaderKpisSkeleton } from "./sections/portKpis/skeletons/PortHeaderKpisSkeleton";
import { PortLineUpSC } from "./sections/portLineUp/PortLineUpSC";
import MapError from "./sections/PortMap/error";
import PortMap from "./sections/PortMap/Map";
import { PortActivitiesOverview } from "./sections/vesselActivities/VesselActivities";
import VesselActivitiesSC from "./sections/vesselActivities/VesselActivitiesSC";

interface PortPageProps {
  params: {
    portId: string;
  };
}

export async function generateMetadata({
  params: { portId },
}: PortPageProps): Promise<Metadata> {
  return {};
}

export const dynamic = "force-dynamic";

export default async function PortPage({ params: { portId } }: PortPageProps) {
  const { ports, activePort, countryCode } = {
    ports: [],
    activePort: {
      portCode: "test",
      portName: "test",
      id: "test",
    },
    countryCode: "test",
  };

  return (
    <>
      <CrumbSetter
        crumbs={[
          {
            name: "Ports",
            path: "/ports",
          },
          {
            name: `[${activePort.portCode}] ${activePort.portName}`,
            path: `/ports/${activePort.id}`,
          },
        ]}
      />
      <div className="flex">
        <div className="flex-none w-[415px] bg-white border-2 rounded-md border-[#DBDCDF] mr-4">
          <Heading
            className="px-3 pt-3 pb-6"
            activePort={activePort}
            ports={ports}
            countryCode={countryCode}
          />
          <Suspense fallback={<PortActivitiesOverview />}>
            <VesselActivitiesSC portId={activePort.id} />
          </Suspense>
          <PortIntroduction
            className="p-3 border-b-[1px] border-[#DBDCDF]"
            port={activePort}
          />
          <div className="mt-4 p-3 pt-5 border-y-[1px] border-[#DBDCDF]">
            <Collapsible startOpen={true}>
              <CollapsibleTitle>
                <h2>Terminals</h2>
              </CollapsibleTitle>
              <CollapsibleContent>
                <TerminalList port={activePort} />
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="mt-4 p-3 border-b-[1px] border-[#DBDCDF]">
            {/*     <Suspense fallback={<EventLogSkeleton />}>
              <EventLogSC portId={portId} port={activePort} />
            </Suspense> */}
          </div>
        </div>
        <div className="flex-auto">
          <Suspense fallback={<PortHeaderKpisSkeleton />}>
            <PortHeaderKpisSC portId={portId} />
          </Suspense>
          <div className="bg-white border-2 rounded-md border-[#DBDCDF] h-[400px] mt-3 p-2">
            <ErrorBoundary errorComponent={MapError}>
              <PortMap port={activePort} />
            </ErrorBoundary>
          </div>
          <div className="bg-slate-200 h-[365px] mt-3 p-2">More Kpis</div>
        </div>
      </div>

      <div className="p-2 mb-32 mt-9 bg-white rounded-md">
        <Suspense fallback={"Loading..."}>
          <PortLineUpSC portId={portId} />
        </Suspense>
      </div>
      <Toaster />
    </>
  );
}
