"use client";

import { useRef, useState } from "react";

import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { LoadingState } from "@/app/plataform/lib/types";

import { ChartLegends } from "../ChartLegends";
import { VesselTurnarrondTerminalOverlay } from "../interfaces";
import VesselTurnaroundChart from "./VesselTurnaroundChart";

type BerthOnArrivalOverlayProps = {
  terminalId: string;
};

export default function VesselTurnaroundOverlay({}: BerthOnArrivalOverlayProps): JSX.Element {
  const [loading /* setLoading */] = useState<LoadingState>(
    LoadingState.LOADING,
  );
  const [chartData, setChartData] =
    useState<VesselTurnarrondTerminalOverlay[]>();
  const allChartData = useRef<VesselTurnarrondTerminalOverlay[]>();
  const [filters, setFilters] = useState([
    "proforma",
    "operated",
    "partner",
    "others",
  ]);

  /*   useEffect(() => {
    getVesselTurnaroundOverlay(terminalId)
      .then(data => {
        if (data) setChartData(data);
        allChartData.current = data;
        setLoading(LoadingState.SUCCESS);
      })
      .catch(() => {
        setLoading(LoadingState.FAILED);
      });
  }, [terminalId]); */

  const handleFiltersChange = (value: string[]) => {
    if (!chartData) return;
    if (!allChartData.current) return;
    /*  */
    setFilters(value);
    const newChartData = allChartData.current.filter(vessel =>
      value.includes(vessel.vesselType),
    );
    setChartData(newChartData);
  };

  return (
    <LoadingContainer state={loading} className="min-h-[500px]">
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
                  color: "#B3C0BF",
                  key: "proforma",
                  name: "Proforma",
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
          <VesselTurnaroundChart
            vessels={chartData}
            showProforma={filters.includes("proforma")}
          />
        </>
      ) : (
        <NoData />
      )}
    </LoadingContainer>
  );
}
