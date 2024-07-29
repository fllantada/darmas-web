"use client";

import { useEffect, useState } from "react";

import { LoadingState } from "@/lib/types";
import { getNextError } from "@/lib/utils";
import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";

import CustomChartLegend from "../../components/CustomChartLegend";
import { getBerthOnArrivalOverlay } from "./actions";
import BerthOnArrivalChart, {
  type BerthOnArrivalChartProps,
} from "./BerthOnArrivalChart";

type BerthOnArrivalOverlayProps = {
  portId: string;
};

export default function BerthOnArrivalOverlay({
  portId,
}: BerthOnArrivalOverlayProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] =
    useState<Omit<BerthOnArrivalChartProps, "filters">>();
  const [filters, setFilters] = useState([
    "threshold",
    "Operated",
    "Partner",
    "Others",
  ]);

  async function refreshData(portId: string) {
    try {
      setLoading(LoadingState.LOADING);
      const { data, target } = await getBerthOnArrivalOverlay(portId);
      if (data) {
        setChartData({
          target: target || 0,
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
      {chartData ? (
        <>
          <div className="flex space-x-2 right">
            <div className="flex-auto" />
            <div className="pr-12">
              <span className="inline-block mr-1 align-middle border-dashed border-2 w-5 border-black" />
              <span className="text-xs align-middle	">Forecast</span>
            </div>
            <CustomChartLegend
              items={[
                {
                  color: "#D3F6D3",
                  key: "threshold",
                  name: "Threshold",
                },
                {
                  color: "#00C1D2",
                  key: "Operated",
                  name: "Operated",
                },
                {
                  color: "#F8BE5D",
                  key: "Partner",
                  name: "Partner",
                },
                {
                  color: "#9A80FF",
                  key: "Others",
                  name: "Others",
                },
              ]}
              value={filters}
              onChange={setFilters}
            />
            <div className="flex-auto" />
          </div>
          <BerthOnArrivalChart {...chartData} filters={filters} />
        </>
      ) : (
        <NoData />
      )}
    </LoadingContainer>
  );
}
