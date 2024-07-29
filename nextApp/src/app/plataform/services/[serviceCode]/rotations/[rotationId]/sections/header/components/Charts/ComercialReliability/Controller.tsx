"use client";

import { useEffect, useState } from "react";
import type { CommercialReliabilityPortType } from "@/generated/graphql";

import { NoData } from "@/components/KpisResultOverlays/NoData";
import { LoadingContainer } from "@/components/LoadingContainer";
import { LoadingState } from "@/app/plataform/lib/types";
import { getNextError } from "@/app/plataform/lib/utils";

import { getPortsCommercialReliability } from "../../../../../actions";
import { ScheduleChangeStatus } from "../../../domain/interfaces";
import CommercialReliability, {
  type CommercialReliabilityProps,
} from "./Chart";

type RotationCommercialReliabilityProps = {
  voyageNo: string;
  vesselCode: string;
};

export default function RotationCommercialReliability({
  voyageNo,
  vesselCode,
}: RotationCommercialReliabilityProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<CommercialReliabilityProps>();

  async function refreshData(voyageNo: string, vesselCode: string) {
    try {
      const { data, ports } = await getPortsCommercialReliability(
        voyageNo,
        vesselCode,
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
          const columnIndex = item.sequenceArrival || undefined;
          const rowIndex = item.sequenceDeparture || undefined;

          if (rowIndex !== undefined && columnIndex !== undefined) {
            const isAddedPort =
              item.changeStatusArrival ===
                ScheduleChangeStatus.ADDITIONAL_CALLING ||
              item.changeStatusDeparture ===
                ScheduleChangeStatus.ADDITIONAL_CALLING;

            const isSkipedPort =
              item.changeStatusDeparture ===
                ScheduleChangeStatus.SKIP_CALLING ||
              item.changeStatusArrival === ScheduleChangeStatus.SKIP_CALLING;

            const newMatrixElement = {
              actual: item.actualDays
                ? item.actualDays.toFixed(0)
                : ("--" as string | undefined | number),
              proforma: item.proformaDays
                ? item.proformaDays.toFixed(0)
                : ("--" as number | undefined | string),
              delta: item.delta,
              isForecast: item.calculationType === "forecast",
            };

            if (isAddedPort) {
              newMatrixElement.proforma = "A";
            }
            if (isSkipedPort) {
              newMatrixElement.actual = "S";
            }

            transformedData.matrix[rowIndex - 1][columnIndex - 1] =
              newMatrixElement;
          }
        });

        // Remove the first row as it's the departure port and will always be empty
        transformedData.matrix = transformedData.matrix.map(row =>
          row.slice(1),
        );
        transformedData.podPorts = transformedData.podPorts.slice(1);

        // Populate the matrix once we know the port positions
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
      className="min-h-[500px]"
    >
      {chartData ? <CommercialReliability {...chartData} /> : <NoData />}
    </LoadingContainer>
  );
}
