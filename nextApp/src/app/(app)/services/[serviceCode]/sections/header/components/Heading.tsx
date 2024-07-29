"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceType } from "@/generated/graphql";
import { CircleDashed } from "lucide-react";

import ServicesIcon from "@/components/icons/services";

import ServiceSearch from "./ServiceSearch";

type HeadingProps = {
  services: ServiceType[];
  selectedService: ServiceType;
};

export default function Heading({
  services,
  selectedService,
}: HeadingProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onServiceChange(serviceCode: string) {
    if (serviceCode !== selectedService.serviceCode) {
      setLoading(true);
      router.push(`/services/${serviceCode}`);
    }
  }

  return (
    <div className="flex items-center">
      <div className="p-5 mr-3 rounded-full bg-slate-200">
        {loading ? (
          <CircleDashed size={32} className="animate-spin" />
        ) : (
          <ServicesIcon style={{ width: 32, height: 32 }} />
        )}
      </div>
      <div>
        <ServiceSearch
          activeService={selectedService}
          services={services}
          disabled={loading}
          onNavigateToService={onServiceChange}
          className="mb-2"
        />
        <h2 className="text-sm font-normal text-[#454954]">
          Voyage Days:&nbsp;
          {selectedService.voyageLengthDays?.toFixed(0) || "--"} | Frequency:
          &nbsp;
          {selectedService.voyageLengthDays && selectedService.vesselCount
            ? (
                selectedService.voyageLengthDays / selectedService.vesselCount
              ).toFixed(0)
            : "--"}
          &nbsp;Days
        </h2>
      </div>
    </div>
  );
}
