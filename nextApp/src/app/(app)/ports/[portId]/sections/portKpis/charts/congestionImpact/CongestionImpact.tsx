"use client";

import { useEffect, useState } from "react";

import { LoadingState } from "@/lib/types";
import { getNextError } from "@/lib/utils";
import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";

import { getCongestionImpactOverlay } from "./actions";
import { CongestionImpactChart } from "./Chart";
import { CongestionImpact } from "./interfaces";
import { Legends } from "./Legends";

type BerthOnArrivalOverlayProps = {
  portId: string;
};

export default function CongestionImpactOverlay({
  portId,
}: BerthOnArrivalOverlayProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<CongestionImpact>();

  async function refreshData(portId: string) {
    try {
      setLoading(LoadingState.LOADING);
      const data = await getCongestionImpactOverlay(portId);

      if (data) {
        setChartData(data);
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
      {chartData ? (
        <>
          <Legends />
          <CongestionImpactChart congestionImpact={chartData} />
        </>
      ) : (
        <NoData />
      )}
    </LoadingContainer>
  );
}
