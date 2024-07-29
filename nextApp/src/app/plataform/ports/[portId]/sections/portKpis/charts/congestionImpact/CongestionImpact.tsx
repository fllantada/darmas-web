"use client";

import { useEffect, useState } from "react";

import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { LoadingState } from "@/app/plataform/lib/types";
import { getNextError } from "@/app/plataform/lib/utils";

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

  /*   async function refreshData(portId: string) {
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
  }, [portId]); */

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
