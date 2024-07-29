"use client";

import { useEffect, useState } from "react";

import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { LoadingState } from "@/app/plataform/lib/types";
import { getNextError } from "@/app/plataform/lib/utils";

/* import { getPortEmissionOverlay } from "./actions"; */
import PortEmissionsChart, {
  type PortEmissionsChartProps,
} from "./PortEmissionsChart";

type BerthOnArrivalOverlayProps = {
  portId: string;
};

export default function PortEmissionOverlay({
  portId,
}: BerthOnArrivalOverlayProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<PortEmissionsChartProps>();

  async function refreshData(portId: string) {
    try {
      setLoading(LoadingState.LOADING);
      const data: any[] = [];
      if (data) {
        setChartData({
          vessels: data.map(d => ({
            vesselName: d.vesselName,
            actual: d.actual,
            proforma: d.proforma,
            vesselType: d.vesselType,
            calculationType: d.calculationType,
          })),
        });
      }
      setLoading(LoadingState.SUCCESS);
    } catch (e) {
      setError(getNextError(e));
      setLoading(LoadingState.FAILED);
    }
  }

  useEffect(() => {
    refreshData(portId);
  }, [portId]);

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="min-h-[500px]"
    >
      {chartData ? <PortEmissionsChart {...chartData} /> : <NoData />}
    </LoadingContainer>
  );
}
