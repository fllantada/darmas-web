"use client";

import { useEffect, useState } from "react";

import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { LoadingState } from "@/app/plataform/lib/types";
import { getNextError } from "@/app/plataform/lib/utils";

import { PortEmissionTerminalOverlay } from "../interfaces";
import PortEmissionsChart from "./PortEmissionsChart";

type BerthOnArrivalOverlayProps = {
  terminalId: string;
};

export default function PortEmissionOverlay({
  terminalId,
}: BerthOnArrivalOverlayProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<PortEmissionTerminalOverlay[]>();

  async function refreshData(terminalId: string) {
    try {
      setLoading(LoadingState.LOADING);
      /*   const data = await getPortEmissionOverlay(terminalId);
      if (data) {
        setChartData(data);
      } */
      setLoading(LoadingState.SUCCESS);
    } catch (e) {
      setError(getNextError(e));
      setLoading(LoadingState.FAILED);
    }
  }

  useEffect(() => {
    refreshData(terminalId);
  }, [terminalId]);

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="min-h-[500px]"
    >
      {chartData ? <PortEmissionsChart vessels={chartData} /> : <NoData />}
    </LoadingContainer>
  );
}
