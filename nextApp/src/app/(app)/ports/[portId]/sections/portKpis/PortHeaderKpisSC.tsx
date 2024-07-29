import { BaseKpiType } from "@/generated/graphql";

import { BaseKpiDisplayValues } from "@/lib/types";

import { getPortHeaderKpis } from "../../actions";
import PortHeaderKpis from "./PortHeaderKpis";
import {
  getBerthOnArrivalDisplayValues,
  getCongestionImpactDisplayValues,
  getPortEmissionDisplayValues,
  getVesselTurnaroundDisplayValues,
} from "./utils";

export type DisplayKpiDataItem = {
  display: BaseKpiDisplayValues;
  data: BaseKpiType | undefined | null;
};

type PortHeaderKpisProps = {
  portId: string;
};

export default async function PortHeaderKpisSC({
  portId,
}: PortHeaderKpisProps) {
  const data = await getPortHeaderKpis(portId);
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
