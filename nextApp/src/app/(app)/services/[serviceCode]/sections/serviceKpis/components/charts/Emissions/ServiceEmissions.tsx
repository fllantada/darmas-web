"use client";

import { useMemo } from "react";
import { VesselEmissionsKpiType } from "@/generated/graphql";
import {
  calculateRotationType,
  RotationType,
} from "@/globalDomain/rotationTypes";

import { NoData } from "../NoData";
import Emissions, { type EmissionsProps } from "./Chart";

type ServiceEmissionsProps = {
  data?: VesselEmissionsKpiType[];
};

export default function ServiceEmissions({
  data,
}: ServiceEmissionsProps): JSX.Element {
  const chartData = useMemo<EmissionsProps | undefined>(() => {
    if (data) {
      return {
        xAxisName: "Vessel",
        xAxisLabels: data.map(v => v.vesselCode),
        cii: {
          actual: data.map(v => v.attainedCii || 0),
          proforma: data.map(v => v.proformaCii || 0),
          model: data.map(v => v.modelCii || 0),
        },
        ciiRating: {
          actual: data.map(v => v.ciiRating || ""),
          proforma: data.map(v => v.proformaCiiRating || ""),
          model: data.map(v => v.modelCiiRating || ""),
        },
      };
    }
  }, [data]);

  const onlyPartnerVessels = useMemo(() => {
    let isAllPartners = true;

    if (data) {
      data.forEach(vessel => {
        if (
          calculateRotationType(vessel.vesselCode) === RotationType.OPERATED
        ) {
          isAllPartners = false;
        }
      });
    }

    return isAllPartners;
  }, [data]);

  if (onlyPartnerVessels)
    return (
      <NoData
        text={
          "We do not have access to the Partner’s Vessel information. Try selecting another metric."
        }
      />
    );

  return chartData ? <Emissions {...chartData} /> : <NoData />;
}
