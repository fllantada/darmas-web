import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CrumbSetter } from "@/app/plataform/contexts/BreadcrumbContext";

import { getPageTitle, getServiceByCode, getServicesList } from "./actions";
import HeaderSection from "./sections/header/HeaderSection";
import LiveMapSection from "./sections/liveMap/LiveMapSection";
import ServiceKpisSection from "./sections/serviceKpis/ServiceKpisSection";
import TimeLineSection from "./sections/timeLine/TimeLineSection";

interface ServicePageProps {
  params: {
    serviceCode: string;
  };
}

export async function generateMetadata({
  params: { serviceCode },
}: ServicePageProps): Promise<Metadata> {
  return await getPageTitle(serviceCode);
}

export default async function ServicePage({
  params: { serviceCode },
}: ServicePageProps): Promise<JSX.Element> {
  const [servicesList, { rotations, service }] = await Promise.all([
    getServicesList(),
    getServiceByCode(serviceCode).then(service => {
      return {
        rotations:
          service?.vessels
            .map(v =>
              v.voyages.map(v => ({
                name: `${v.vesselCode}${v.voyageNo}`,
                id: `${v.vesselCode}-${v.voyageNo}`,
              })),
            )
            .flat() || [],
        service,
      };
    }),
  ]);

  if (!service) {
    throw notFound();
  }

  return (
    <>
      <CrumbSetter
        crumbs={[
          {
            name: "Services",
            path: "/services",
          },
          {
            name: `[${service.serviceCode}] ${service.serviceName || ""}`,
            path: `/services/${serviceCode}`,
          },
        ]}
      />

      <HeaderSection
        selectedService={service}
        services={servicesList}
        rotations={rotations}
      />
      <ServiceKpisSection selectedService={service} />

      <LiveMapSection selectedService={service} />

      <TimeLineSection selectedService={service} />
    </>
  );
}
