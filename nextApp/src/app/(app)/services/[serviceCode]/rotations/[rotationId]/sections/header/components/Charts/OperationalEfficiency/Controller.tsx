"use client";

import { useEffect, useState } from "react";

import { LoadingState } from "@/lib/types";
import { getNextError } from "@/lib/utils";
import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";

import { getRotationOperationalEfficiency } from "../../../../../actions";
import {
  OperationalEfficiencyChart,
  OperationalEfficiencyProps,
} from "./Chart";

type RotationOperationalEfficiencyProps = {
  voyageNo: string;
  vesselCode: string;
};

export default function RotationOperationalEfficiency({
  voyageNo,
  vesselCode,
}: RotationOperationalEfficiencyProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<OperationalEfficiencyProps>();

  useEffect(() => {
    async function refreshData(voyageNo: string, vesselCode: string) {
      try {
        const data = await getRotationOperationalEfficiency(
          voyageNo,
          vesselCode,
        );
        if (data) {
          setChartData({
            rotations: [`${vesselCode}${voyageNo}`],
            bunkerConsumption: {
              forecast: [],
              actual: [data.bunkerConsumption || null],
              proforma: [data.proformaBunkerConsumption || null],
              model: [data.modelConsumption || null],
            },
            portCalls: {
              forecast: [data.portCallsForecast || null],
              actual: [data.portCallsActual || null],
              proforma: [data.proformaPortCalls || 0],
            },
            voyageDays: {
              forecast: [data.voyageDaysForecast || null],
              actual: [data.voyageDaysActual || null],
              proforma: [data.proformaVoyageDays || null],
            },
          });
        }
        setLoading(LoadingState.SUCCESS);
      } catch (e) {
        setError(getNextError(e));
        setLoading(LoadingState.FAILED);
      }
    }
    refreshData(voyageNo, vesselCode);
  }, [vesselCode, voyageNo]);

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="h-[500px]"
    >
      {chartData ? <OperationalEfficiencyChart {...chartData} /> : <NoData />}
    </LoadingContainer>
  );
}
