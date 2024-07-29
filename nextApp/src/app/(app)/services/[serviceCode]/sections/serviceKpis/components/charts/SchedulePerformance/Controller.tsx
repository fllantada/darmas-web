"use client";

import { useEffect, useState } from "react";

import { LoadingState } from "@/lib/types";
import type { DateRange } from "@/lib/types";
import { getNextError } from "@/lib/utils";
import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { VesselColors } from "@/app/theme";

import { getPortsSchedulePerformance } from "./actions";
import { ServiceSchedulePerformaceGraph } from "./Chart";
import type { ServiceSchedulePerformaceGraphProps } from "./interfaces";
import { VesselType } from "./interfaces";
import { Legends } from "./Legends";

type ServiceSchedulePerformanceProps = {
  serviceCode: string;
  timeRange: DateRange;
};

export default function ServiceSchedulePerformance({
  serviceCode,
  timeRange,
}: ServiceSchedulePerformanceProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] =
    useState<ServiceSchedulePerformaceGraphProps>();

  async function refreshData(serviceCode: string, timeRange: DateRange) {
    try {
      const data = await getPortsSchedulePerformance(serviceCode, timeRange);
      if (data) {
        setChartData({
          rotations: data.map(
            point => `${point.vesselCode}  ${point.voyageNo}`,
          ),
          onTimeActualPortCalls: data.map(point => ({
            value: point.onTimeActualPortCalls || null,
            itemStyle: {
              color:
                point.vesselType === VesselType.PARTNER
                  ? VesselColors.PARTNER
                  : VesselColors.OPERATED,
            },
          })),
          onTimeForecastPortCalls: data.map(point => ({
            value: point.onTimeForecastPortCalls || null,
            itemStyle: {
              color:
                point.vesselType === VesselType.PARTNER
                  ? VesselColors.PARTNER_FORECAST
                  : VesselColors.OPERATED_FORECAST,
            },
          })),
          offTimePortCalls: data.map(point => ({
            value:
              point.offTimeActualPortCalls + point.offTimeForecastPortCalls,
            itemStyle: {
              color: VesselColors.OFF_TIME,
            },
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
    refreshData(serviceCode, timeRange);
  }, [serviceCode, timeRange]);

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="h-[500px]"
    >
      {chartData ? (
        <div className={"flex flex-col justify-center items-center  mt-4  "}>
          <Legends />
          <ServiceSchedulePerformaceGraph {...chartData} />
          <div className="text-s text-gray-500 mt-2">Rotations</div>
        </div>
      ) : (
        <NoData />
      )}
    </LoadingContainer>
  );
}
