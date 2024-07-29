"use client";

import { useEffect, useState } from "react";
import type { CommercialReliabilityPortType } from "@/generated/graphql";

import { LoadingState } from "@/lib/types";
import type { DateRange } from "@/lib/types";
import { getNextError } from "@/lib/utils";
import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";

import { getTimeDependentPortsCommercialReliability } from "../../../actions";
import CommercialReliability, {
  type CommercialReliabilityProps,
} from "./CommercialReliability";

type ServiceCommercialReliabilityProps = {
  serviceCode: string;
  timeRange: DateRange;
};

export default function ServiceCommercialReliability({
  serviceCode,
  timeRange,
}: ServiceCommercialReliabilityProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<CommercialReliabilityProps>();

  async function refreshData(serviceCode: string, timeRange: DateRange) {
    try {
      const { data, ports } = await getTimeDependentPortsCommercialReliability(
        serviceCode,
        timeRange,
      );

      if (data && ports) {
        const portCount = ports.length;
        const portNames = ports.map(port => port.portCode);
        const transformedData: CommercialReliabilityProps = {
          polPorts: portNames,
          podPorts: portNames,
          matrix: [],
        };

        // filter out the rows with no arrival port or departure port
        const filtererdData = data.filter(
          item => !!item.arrivalPort && !!item.departurePort,
        ) as (CommercialReliabilityPortType & {
          // type assertion that departurePort and arrivalPort are present
          departurePort: string;
          arrivalPort: string;
        })[];

        // Initialize the matrix
        transformedData.matrix = Array.from({ length: portCount }, () =>
          new Array(portCount).fill(null),
        );

        filtererdData.forEach(item => {
          const columnIndex = portNames.indexOf(item.arrivalPort);
          const rowIndex = portNames.indexOf(item.departurePort);

          if (rowIndex >= 0 && columnIndex >= 0) {
            transformedData.matrix[rowIndex][columnIndex] = {
              actual: item.actualDays,
              proforma: item.proformaDays,
              delta: item.delta,
              isForecast: item.calculationType === "forecast",
            };
          }
        });

        // Populate the matrix once we know the port positions
        setChartData(transformedData);
      }
      setLoading(LoadingState.SUCCESS);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
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
      className="min-h-[500px]"
    >
      {chartData ? <CommercialReliability {...chartData} /> : <NoData />}
    </LoadingContainer>
  );
}
