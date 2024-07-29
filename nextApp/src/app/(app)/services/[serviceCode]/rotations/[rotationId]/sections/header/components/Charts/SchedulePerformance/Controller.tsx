"use client";

import { useEffect, useState } from "react";

import { LoadingState } from "@/lib/types";
import { getNextError } from "@/lib/utils";
import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";

import { getPortsSchedulePerformance } from "../../../../../actions";
import { mapToScheduleChangeStatus } from "../../../domain/adapter";
import SchedulePerformance, { type SchedulePerformanceProps } from "./Chart";
import { Legends } from "./Legends";

type RotationSchedulePerformanceProps = {
  voyageNo: string;
  vesselCode: string;
};

export default function RotationSchedulePerformance({
  voyageNo,
  vesselCode,
}: RotationSchedulePerformanceProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<SchedulePerformanceProps>();

  async function refreshData(voyageNo: string, vesselCode: string) {
    try {
      const data = await getPortsSchedulePerformance(voyageNo, vesselCode);
      if (data) {
        const transformedData: SchedulePerformanceProps = {
          xAxisLabels: [],
          performanceDelta: {
            actual: [],
            forecast: [],
          },
        };

        for (const point of data) {
          transformedData.xAxisLabels.push({
            value: point.port,
            changeStatus: mapToScheduleChangeStatus(point.changeStatus),
          });
          if (point.calculationType === "forecast") {
            transformedData.performanceDelta.forecast.push(point.delta || null);
            transformedData.performanceDelta.actual.push(null);
          } else {
            transformedData.performanceDelta.actual.push(point.delta || null);
            transformedData.performanceDelta.forecast.push(null);
          }
        }
        setChartData(transformedData);
      }
      setLoading(LoadingState.SUCCESS);
    } catch (e) {
      setError(getNextError(e));
      setLoading(LoadingState.FAILED);
    }
  }

  useEffect(() => {
    refreshData(voyageNo, vesselCode);
  }, [voyageNo, vesselCode]);

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="h-[500px]"
    >
      {chartData ? (
        <>
          <Legends />
          <SchedulePerformance {...chartData} />
        </>
      ) : (
        <NoData />
      )}
    </LoadingContainer>
  );
}
