"use client";

import { ServiceType } from "@/generated/graphql";

import ServiceHeaderKpis from "./components/ServiceHeaderKpis";
import { useKpiStore } from "./store/kpiStore";

type IProps = {
  selectedService: ServiceType;
};

export default function ServiceKpisSection({
  selectedService,
}: IProps): JSX.Element {
  const selectRange = useKpiStore(state => state.dateRangeSelected);

  return (
    <ServiceHeaderKpis
      serviceCode={selectedService.serviceCode}
      timeRange={selectRange}
    />
  );
}
