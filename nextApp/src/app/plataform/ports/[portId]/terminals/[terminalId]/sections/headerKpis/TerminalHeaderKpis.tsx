"use client";

import { useRef, useState } from "react";

import { useKpiCardInteractions } from "@/app/plataform/customHooks/useKpiCardInteractions";
import { LoadingState } from "@/app/plataform/lib/types";

import { BerthOnArrivalKpiCard } from "./cards/BerthOnArrival";
import { PortEmissionKpiCard } from "./cards/PortEmission";
import { VesselTurnAroundKpiCard } from "./cards/VesselTurnAround";
import PortEmissionOverlay from "./charts/portEmission/PortEmissions";
import VesselTurnaroundOverlay from "./charts/vesselTurnaround/VesselTurnaround";
import { defaultTermnalHeaderKpis } from "./domain/defaultValues";
import { TerminalHeaderKpis } from "./domain/interfaces";

interface IProps {
  terminalId: string;
}

export function HeaderKpiSection({ terminalId }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedCard, clickOnCard } = useKpiCardInteractions(containerRef);
  const [kpiData /* setKpiData */] = useState<TerminalHeaderKpis>(
    defaultTermnalHeaderKpis,
  );
  /* 
  useEffect(() => {
    getTerminalHeaderKpis(terminalId ?? "fakeTerminalId").then(data => {
      data && setKpiData(data);
    });
  }, [terminalId]);
 */
  const handleClickOnCard = (origin: string) => {
    clickOnCard(origin);
  };

  return (
    <div className="mb-6 relative" ref={containerRef}>
      <h2 className="text-base font-semibold">Terminal KPIs</h2>
      <div className="flex flex-row mt-2 space-x-2">
        <VesselTurnAroundKpiCard
          kpiData={kpiData?.vesselTurnaround}
          isSelected={
            selectedCard !== undefined &&
            selectedCard === kpiData?.vesselTurnaround?.titleText
          }
          loadingState={LoadingState.SUCCESS}
          onClick={handleClickOnCard}
        />
        <BerthOnArrivalKpiCard
          kpiData={kpiData?.berthOnArrival}
          isSelected={
            selectedCard !== undefined &&
            selectedCard === kpiData?.berthOnArrival?.titleText
          }
          loadingState={LoadingState.SUCCESS}
          onClick={handleClickOnCard}
        />

        <PortEmissionKpiCard
          kpiData={kpiData?.portEmission}
          isSelected={
            selectedCard !== undefined &&
            selectedCard === kpiData?.portEmission?.titleText
          }
          loadingState={LoadingState.SUCCESS}
          onClick={handleClickOnCard}
        />
      </div>
      {selectedCard && (
        <div className="w-full min-h-[500px] bg-white mt-3 p-3 rounded-md border-[1px] absolute shadow-lg z-10">
          {selectedCard == "Vessel Turnaround" && (
            <VesselTurnaroundOverlay terminalId={terminalId} />
          )}

          {selectedCard == "Port Emission" && (
            <PortEmissionOverlay terminalId={terminalId} />
          )}
          {/*    {selectedCard == "Congestion Impact" && (
            <CongestionImpactOverlay terminalId={terminalId} />
          )} */}
        </div>
      )}
    </div>
  );
}
