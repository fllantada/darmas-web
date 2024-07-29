"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceType } from "@/generated/graphql";

import { useKpiStore } from "../serviceKpis/store/kpiStore";
import Heading from "./components/Heading";
import RotationSearch, { type Rotation } from "./components/RotationSearch";
import ServiceExportModal from "./components/ServiceExportModal/ServiceExportModal";
import ProformaDropdown from "./proformaAvailability/ProformaDropdown";

type IProps = {
  selectedService: ServiceType;
  services: ServiceType[];
  rotations: Rotation[];
  children?: React.ReactNode;
};

export default function HeaderSection({
  selectedService,
  services,
  rotations,
}: IProps): JSX.Element {
  const [rotationLoading, setRotationLoading] = useState(false);
  const selectRange = useKpiStore(state => state.dateRangeSelected);
  const router = useRouter();

  function onRotationChange(rotationId: string) {
    setRotationLoading(true);
    router.push(
      `/services/${selectedService.serviceCode}/rotations/${rotationId.replace("-", "")}`,
    );
  }

  return (
    <div className="flex flex-cols">
      <div className="basis-2/3">
        <Heading selectedService={selectedService} services={services} />
      </div>
      <div className="text-right basis-1/3">
        <ProformaDropdown
          className="inline"
          serviceCode={selectedService.serviceCode}
        />
        <RotationSearch
          rotations={rotations}
          disabled={rotationLoading}
          onNavigateToRotation={onRotationChange}
          className="mb-2 ml-5"
        />
        <ServiceExportModal service={selectedService} timeRange={selectRange} />
      </div>
    </div>
  );
}
