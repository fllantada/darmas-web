import { LoadingState } from "@/app/plataform/lib/types";

import { BerthOnArrivalKpiCard } from "../cards/BerthOnArrival";
import { CongestionImpactKpiCard } from "../cards/CongestionImpact";
import { PortEmissionKpiCard } from "../cards/PortEmission";
import { VesselTurnaroundKpiCard } from "../cards/VesselTurnaround";

export const PortHeaderKpisSkeleton = () => {
  return (
    <div>
      <h2 className="text-base font-semibold">Port KPIs</h2>
      <div className="flex flex-row mt-2 space-x-2">
        <VesselTurnaroundKpiCard
          isSelected={false}
          loadingState={LoadingState.LOADING}
        />
        <BerthOnArrivalKpiCard
          isSelected={false}
          loadingState={LoadingState.LOADING}
        />
        <CongestionImpactKpiCard
          isSelected={false}
          loadingState={LoadingState.LOADING}
        />
        <PortEmissionKpiCard
          isSelected={false}
          loadingState={LoadingState.LOADING}
        />
      </div>
    </div>
  );
};
