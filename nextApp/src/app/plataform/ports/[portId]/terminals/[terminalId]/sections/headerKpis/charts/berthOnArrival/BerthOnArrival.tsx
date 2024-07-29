"use client";

import { useEffect, useRef, useState } from "react";

import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { LoadingState } from "@/app/plataform/lib/types";

import { ChartLegends } from "../ChartLegends";
import { BerthOnArrivalTerminalOverlay } from "../interfaces";
import BerthOnArrivalChart from "./BerthOnArrivalChart";

type BerthOnArrivalOverlayProps = {
  terminalId: string;
};

export default function BerthOnArrivalOverlay({
  terminalId,
}: BerthOnArrivalOverlayProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<BerthOnArrivalTerminalOverlay>();
  const allChartData = useRef<BerthOnArrivalTerminalOverlay>();
  const [filters, setFilters] = useState([
    "threshold",
    "operated",
    "partner",
    "others",
  ]);

  useEffect(() => {
    setLoading(LoadingState.LOADING);
    /* getBerthOnArrivalOverlay(terminalId)
      .then(data => {
        if (data) {
          allChartData.current = data;
          setChartData({
            target: data.target || 0,
            vessels: data.vessels,
          });
        }
        setLoading(LoadingState.SUCCESS);
      })

      .catch(e => {
        setError(getNextError(e));
        setLoading(LoadingState.FAILED);
      }); */
  }, [terminalId]);
  const handleFiltersChange = (value: string[]) => {
    if (!chartData) return;
    if (!allChartData.current) return;
    /*  */
    setFilters(value);
    const newChartData = {
      target: allChartData.current.target || 0,
      vessels: allChartData.current.vessels.filter(vessel =>
        value.includes(vessel.vesselType),
      ),
    };
    setChartData(newChartData);
  };

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="min-h-[500px]"
    >
      {chartData ? (
        <>
          <div className="flex space-x-2 right">
            <div className="flex-auto" />
            <div className="pr-12">
              <span className="inline-block mr-1 align-middle border-dashed border-2 w-5 border-black" />
              <span className="text-xs align-middle	">Forecast</span>
            </div>
            <ChartLegends
              items={[
                {
                  color: "#D3F6D3",
                  key: "threshold",
                  name: "Threshold",
                },
                {
                  color: "#00C1D2",
                  key: "operated",
                  name: "Operated",
                },
                {
                  color: "#F8BE5D",
                  key: "partner",
                  name: "Partner",
                },
                {
                  color: "#9A80FF",
                  key: "others",
                  name: "Others",
                },
              ]}
              value={filters}
              onChange={handleFiltersChange}
            />
            <div className="flex-auto" />
          </div>
          <BerthOnArrivalChart
            chartData={chartData}
            showThreshold={filters.includes("threshold")}
          />
        </>
      ) : (
        <NoData />
      )}
    </LoadingContainer>
  );
}
