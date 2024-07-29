"use client";

import { useEffect, useState } from "react";
import {
  calculateRotationType,
  RotationType,
} from "@/globalDomain/rotationTypes";

import { LoadingState } from "@/lib/types";
import type { DateRange } from "@/lib/types";
import { getNextError } from "@/lib/utils";
import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { VesselColors } from "@/app/theme";

import { getTimeDependentOperationalEfficiency } from "../../../actions";
import { OperationalEfficiency } from "./Chart";
import { ChartSelected, OperationalEfficiencyData } from "./interfaces";
import { Legends } from "./Legends";

type ServiceOperationalEfficiencyProps = {
  serviceCode: string;
  timeRange: DateRange;
};

export default function ServiceOperationalEfficiency({
  serviceCode,
  timeRange,
}: ServiceOperationalEfficiencyProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartSelected, setChartSelected] = useState<ChartSelected>(
    ChartSelected.BUNKER,
  );
  const [chartData, setChartData] = useState<OperationalEfficiencyData>();

  async function refreshData(serviceCode: string, timeRange: DateRange) {
    try {
      const data = await getTimeDependentOperationalEfficiency(
        serviceCode,
        timeRange,
      );
      if (data) {
        setChartData({
          bunkerConsumption: {
            rotations: data
              .filter(
                rotation =>
                  calculateRotationType(rotation.vesselCode) !==
                  RotationType.PARTNER,
              )
              .map(rotation => {
                return `${rotation.vesselCode} ${rotation.voyageNumber}`;
              }),
            forecast: [],
            actual: data
              .filter(
                rotation =>
                  calculateRotationType(rotation.vesselCode) !==
                  RotationType.PARTNER,
              )
              .map(r => r.bunkerConsumption || null),
            proforma: data
              .filter(
                rotation =>
                  calculateRotationType(rotation.vesselCode) !==
                  RotationType.PARTNER,
              )
              .map(r => r.proformaBunkerConsumption || null),
            model: data
              .filter(
                rotation =>
                  calculateRotationType(rotation.vesselCode) !==
                  RotationType.PARTNER,
              )
              .map(r => r.modelConsumption || null),
          },
          portCalls: {
            rotations: data.map(r => `${r.vesselCode} ${r.voyageNumber}`),
            forecast: data.map(r => {
              return {
                value: r.portCallsForecast || null,
                itemStyle: {
                  color:
                    calculateRotationType(r.vesselCode) === RotationType.PARTNER
                      ? VesselColors.PARTNER_FORECAST
                      : VesselColors.OPERATED_FORECAST,
                },
              };
            }),
            actual: data.map(r => {
              return {
                value: r.portCallsActual || null,
                itemStyle: {
                  color:
                    calculateRotationType(r.vesselCode) === RotationType.PARTNER
                      ? VesselColors.PARTNER
                      : VesselColors.OPERATED,
                },
              };
            }),
            proforma: data.map(r => r.proformaPortCalls || null),
          },

          voyageDays: {
            rotations: data.map(r => `${r.vesselCode} ${r.voyageNumber}`),
            forecast: data.map(r => {
              return {
                value: r.voyageDaysForecast || null,
                itemStyle: {
                  color:
                    r.vesselCode.charAt(0) === "V" ||
                    r.vesselCode.charAt(0) === "P"
                      ? VesselColors.PARTNER_FORECAST
                      : VesselColors.OPERATED_FORECAST,
                },
              };
            }),
            actual: data.map(r => {
              return {
                value: r.voyageDaysActual || null,
                itemStyle: {
                  color:
                    r.vesselCode.charAt(0) === "V" ||
                    r.vesselCode.charAt(0) === "P"
                      ? VesselColors.PARTNER
                      : VesselColors.OPERATED,
                },
              };
            }),
            proforma: data.map(r => r.proformaVoyageDays || null),
          },
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

  const handleSelectChart = (value: ChartSelected) => {
    setChartSelected(value);
  };

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="h-[500px]"
    >
      {chartData ? (
        <div className={"flex flex-col justify-center items-center  mt-4  "}>
          <Legends chartSelected={chartSelected} />

          <OperationalEfficiency
            bunkerConsumption={chartData.bunkerConsumption}
            portCalls={chartData.portCalls}
            voyageDays={chartData.voyageDays}
            handleSelectChart={handleSelectChart}
            chartSelected={chartSelected}
          />
          <div className="text-s text-gray-500 mt-2">Rotations</div>
        </div>
      ) : (
        <NoData />
      )}
    </LoadingContainer>
  );
}
