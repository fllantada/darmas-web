import { BaseKpiDisplayValues } from "@/app/plataform/lib/types";

import PortHeaderKpis from "./PortHeaderKpis";
import {
  getBerthOnArrivalDisplayValues,
  getCongestionImpactDisplayValues,
  getPortEmissionDisplayValues,
  getVesselTurnaroundDisplayValues,
} from "./utils";

export type DisplayKpiDataItem = {
  display: BaseKpiDisplayValues;
  data: any | undefined | null;
};

type PortHeaderKpisProps = {
  portId: string;
};

export default async function PortHeaderKpisSC({
  portId,
}: PortHeaderKpisProps) {
  const data: any = {};
  let kpiData;
  if (data) {
    kpiData = {
      vesselTurnaround: {
        display: getVesselTurnaroundDisplayValues(data.vesselTurnaround),
        data: data.vesselTurnaround,
      },
      berthOnArrival: {
        display: getBerthOnArrivalDisplayValues(data.berthOnArrival),
        data: data.berthOnArrival,
      },
      congestionImpact: {
        display: getCongestionImpactDisplayValues(data.portCongestionImpact),
        data: data.portCongestionImpact,
      },
      portEmission: {
        display: getPortEmissionDisplayValues(data.portEmission),
        data: data.portEmission,
      },
    };
  }

  return <PortHeaderKpis portId={portId} kpiData={kpiData} />;
}
