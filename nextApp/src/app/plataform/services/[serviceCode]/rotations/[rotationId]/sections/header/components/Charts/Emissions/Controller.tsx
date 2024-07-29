"use client";

import { useEffect, useState } from "react";

import { LoadingContainer } from "@/components/LoadingContainer";
import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";
import { LoadingState } from "@/app/plataform/lib/types";
import { getNextError } from "@/app/plataform/lib/utils";

import { getRotationEmissions } from "../../../../../actions";
import { useRotationStore } from "../../../../../store/rotationStore";
import { NoData } from "../../NoData";
import Emissions, { type EmissionsProps } from "./Emissions";

type RotationEmissionsProps = {
  voyageNo: string;
  vesselCode: string;
};

export default function RotationEmissions({
  voyageNo,
  vesselCode,
}: RotationEmissionsProps): JSX.Element {
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [chartData, setChartData] = useState<EmissionsProps>();
  const rotationHasStart = useRotationStore(state => state.rotationHasStart);
  const rotationType = useRotationStore(state => state.rotationType);

  async function refreshData(voyageNo: string, vesselCode: string) {
    try {
      const data = await getRotationEmissions(voyageNo, vesselCode);
      if (data) {
        setChartData({
          xAxisName: "Rotation",
          xAxisLabels: [`${vesselCode}${voyageNo}`],
          cii: {
            actual: [data.attainedCii || 0],
            proforma: [data.proformaCii || 0],
            model: [data.modelCii || 0],
          },
          ciiRating: {
            actual: [data.ciiRating || ""],
            proforma: [data.proformaCiiRating || ""],
            model: [data.modelCiiRating || ""],
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
    if (!rotationHasStart) {
      setLoading(LoadingState.SUCCESS);
      return;
    }
    refreshData(voyageNo, vesselCode);
  }, [voyageNo, vesselCode, rotationHasStart]);

  if (rotationType === RotationType.PARTNER) {
    return (
      <div className={"pt-[48px] h-[502px]"}>
        <NoData text="We do not have access to the Partner’s Vessel information to compute this metric. Try selecting another vessel." />
      </div>
    );
  }

  if (!rotationHasStart) {
    return (
      <div className={"pt-[48px] h-[502px]"}>
        <NoData text="We do not have enough information to compute this metric for voyage in the future. Come back again when the voyage commence." />
      </div>
    );
  }

  return (
    <LoadingContainer
      state={loading}
      errorDetails={error}
      className="min-h-[500px]"
    >
      {chartData ? <Emissions {...chartData} /> : <NoData />}
    </LoadingContainer>
  );
}
