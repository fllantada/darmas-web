"use client";

import { useMemo, useRef } from "react";

import { useKpiCardInteractions } from "@/app/plataform/customHooks/useKpiCardInteractions";

import { RotationHeaderKpis } from "../domain/interfaces";
import RotationCommercialReliability from "./Charts/ComercialReliability/Controller";
import RotationEmissions from "./Charts/Emissions/Controller";
import RotationOperationalEfficiency from "./Charts/OperationalEfficiency/Controller";
import RotationSchedulePerformance from "./Charts/SchedulePerformance/Controller";
import { ComercialReliabilityKpiCard } from "./KpiCards/ComercialReliability";
import { EmissionKpiCard } from "./KpiCards/Emissions/Emission";
import { OperationalEfficiencyKpiCard } from "./KpiCards/OperationalEfficiency";
import { SchedulePerformanceKpiCard } from "./KpiCards/SchedulePerformance";

type RotationHeadereKpisProps = {
  data: RotationHeaderKpis;
  voyageNo: string;
  vesselCode: string;
};

export default function HeaderKpis({
  data,
  voyageNo,
  vesselCode,
}: RotationHeadereKpisProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedCard, clickOnCard } = useKpiCardInteractions(containerRef);

  const {
    commercialReliability,
    emissions,
    operationalEfficiency,
    schedulePerformance,
  } = useMemo(() => data, [data]);

  const onCardClicked = (origin: string) => {
    clickOnCard(origin);
  };

  return (
    <div className="my-6 relative" ref={containerRef}>
      <h2 className="text-base font-semibold">Rotation KPIs</h2>
      <div className="flex flex-row mt-2 space-x-2">
        <SchedulePerformanceKpiCard
          schedulePerformance={schedulePerformance ?? {}}
          isSelected={selectedCard == "schedule_performance"}
          onClick={() => onCardClicked("schedule_performance")}
        />
        <ComercialReliabilityKpiCard
          commercialReliability={commercialReliability ?? {}}
          isSelected={selectedCard == "commercial_reliability"}
          onClick={() => onCardClicked("commercial_reliability")}
        />
        <OperationalEfficiencyKpiCard
          operationalEfficiency={operationalEfficiency ?? {}}
          isSelected={selectedCard == "operational_efficiency"}
          onClick={() => onCardClicked("operational_efficiency")}
        />
        <EmissionKpiCard
          emissions={emissions ?? {}}
          isSelected={selectedCard == "emissions"}
          onClick={() => onCardClicked("emissions")}
        />
      </div>
      {selectedCard && (
        <div className="w-full min-h-[500px] bg-white mt-3 p-3 rounded-md border-[1px] shadow-lg absolute top-[100%] z-10">
          {selectedCard == "schedule_performance" && (
            <RotationSchedulePerformance
              voyageNo={voyageNo}
              vesselCode={vesselCode}
            />
          )}
          {selectedCard == "commercial_reliability" && (
            <RotationCommercialReliability
              voyageNo={voyageNo}
              vesselCode={vesselCode}
            />
          )}
          {selectedCard == "operational_efficiency" && (
            <RotationOperationalEfficiency
              voyageNo={voyageNo}
              vesselCode={vesselCode}
            />
          )}
          {selectedCard == "emissions" && (
            <RotationEmissions voyageNo={voyageNo} vesselCode={vesselCode} />
          )}
        </div>
      )}
    </div>
  );
}
