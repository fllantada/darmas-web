"use client";

import { useRef, useState } from "react";
import type { BaseKpiType } from "@/generated/graphql";

import { BaseKpiDisplayValues, LoadingState } from "@/lib/types";
import { useKpiCardInteractions } from "@/app/customHooks/useKpiCardInteractions";

import { BerthOnArrivalKpiCard } from "./cards/BerthOnArrival";
import { CongestionImpactKpiCard } from "./cards/CongestionImpact";
import { PortEmissionKpiCard } from "./cards/PortEmission";
import { VesselTurnaroundKpiCard } from "./cards/VesselTurnaround";
import BerthOnArrivalOverlay from "./charts/berthOnArrival/BerthOnArrival";
import CongestionImpactOverlay from "./charts/congestionImpact/CongestionImpact";
import PortEmissionOverlay from "./charts/portEmission/PortEmissions";
import VesselTurnaroundOverlay from "./charts/vesselTurnaround/VesselTurnaround";

export type DisplayKpiDataItem = {
  display: BaseKpiDisplayValues;
  data: BaseKpiType | undefined | null;
};

type DisplayKpiData = {
  vesselTurnaround: DisplayKpiDataItem;
  berthOnArrival: DisplayKpiDataItem;
  congestionImpact: DisplayKpiDataItem;
  portEmission: DisplayKpiDataItem;
};

type PortHeaderKpisProps = {
  portId: string;
  kpiData?: DisplayKpiData;
};

export default function PortHeaderKpis({
  portId,
  kpiData,
}: PortHeaderKpisProps): JSX.Element {
  const [loadingState] = useState<LoadingState>(LoadingState.SUCCESS);
  const containerRef = useRef<HTMLDivElement>(null);

  const { selectedCard, clickOnCard } = useKpiCardInteractions(containerRef);

  return (
    <div className="mb-6 relative" ref={containerRef}>
      <h2 className="text-base font-semibold">Port KPIs</h2>
      <div className="flex flex-row mt-2 space-x-2">
        <VesselTurnaroundKpiCard
          isSelected={selectedCard == "vessel_turnaround"}
          loadingState={loadingState}
          kpiData={kpiData?.vesselTurnaround}
          onClick={clickOnCard}
        />
        <BerthOnArrivalKpiCard
          isSelected={selectedCard == "berth_on_arrival"}
          loadingState={loadingState}
          kpiData={kpiData?.berthOnArrival}
          onClick={clickOnCard}
        />
        <CongestionImpactKpiCard
          isSelected={selectedCard == "congestion_impact"}
          loadingState={loadingState}
          kpiData={kpiData?.congestionImpact}
          onClick={clickOnCard}
        />
        <PortEmissionKpiCard
          isSelected={selectedCard == "port_emission"}
          loadingState={loadingState}
          kpiData={kpiData?.portEmission}
          onClick={clickOnCard}
        />
      </div>
      {selectedCard && (
        <div className="w-full min-h-[500px] bg-white mt-3 p-3 rounded-md border-[1px] absolute shadow-lg z-10">
          {selectedCard == "vessel_turnaround" && (
            <VesselTurnaroundOverlay portId={portId} />
          )}
          {selectedCard == "berth_on_arrival" && (
            <BerthOnArrivalOverlay portId={portId} />
          )}
          {selectedCard == "congestion_impact" && (
            <CongestionImpactOverlay portId={portId} />
          )}
          {selectedCard == "port_emission" && (
            <PortEmissionOverlay portId={portId} />
          )}
        </div>
      )}
    </div>
  );
}
