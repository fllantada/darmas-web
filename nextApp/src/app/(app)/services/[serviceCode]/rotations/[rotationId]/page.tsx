import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrumbSetter } from "@/contexts/BreadcrumbContext";

import { getPageEssentials, getSurroundingVoyages } from "./actions";
import { HeaderSection } from "./sections/header/HeaderSection";
import LiveMapSection from "./sections/liveMap/LiveMapSection";
import { TableSection } from "./sections/tables/TableSection";
import { TimelineSection } from "./sections/timeline/TimelineSection";

interface IProps {
  params: {
    rotationId: string;
    serviceCode: string;
  };
}

export async function generateMetadata({
  params: { rotationId },
}: IProps): Promise<Metadata> {
  const [vesselCode, voyageNo] = [rotationId.slice(0, 4), rotationId.slice(4)];
  if (vesselCode && voyageNo) {
    return {
      title: rotationId + " | Services",
    };
  } else {
    return {
      title: "Not Found",
    };
  }
}

export default async function RotationPage({
  params: { rotationId, serviceCode },
}: IProps): Promise<JSX.Element> {
  const [vesselCode, voyageNo] = [rotationId.slice(0, 4), rotationId.slice(4)];

  const { selectedVesselVoyage, vessel, service, headerKpis } =
    await getPageEssentials(`${vesselCode}-${voyageNo}`, serviceCode);

  if (
    !selectedVesselVoyage ||
    !vessel ||
    !selectedVesselVoyage.startDate ||
    !selectedVesselVoyage.endDate
  ) {
    notFound();
  }

  const rotationsList =
    service?.vessels
      .map(vessel =>
        vessel.voyages
          .filter(
            voyage =>
              voyage.vesselCode === vesselCode &&
              voyage.startDate &&
              voyage.endDate,
          )
          .map(voyage => {
            return {
              name: `${voyage.vesselCode}${voyage.voyageNo}`,
              id: `${voyage.vesselCode}-${voyage.voyageNo}`,
            };
          }),
      )
      .flat() ?? [];

  const { prevVesselVoyage, nextVesselVoyage } = await getSurroundingVoyages(
    rotationsList,
    selectedVesselVoyage.vesselCode + selectedVesselVoyage.voyageNo,
  );

  return (
    <>
      <CrumbSetter
        crumbs={[
          {
            name: "Services",
            path: "/services",
          },
          {
            name: `[${service?.serviceCode}] ${service?.serviceName || ""}`,
            path: `/services/${serviceCode}`,
          },
          {
            name: rotationId,
            path: `/services/${serviceCode}/rotations/${rotationId}`,
          },
        ]}
      />
      <div className="min-h-[850px]">
        <HeaderSection
          rotationsList={rotationsList}
          selectedVesselVoyage={selectedVesselVoyage}
          serviceCode={serviceCode}
          vessel={vessel}
          headerKpis={headerKpis}
          voyageNo={voyageNo}
          vesselCode={vesselCode}
        />
        <LiveMapSection
          selectedVesselVoyage={selectedVesselVoyage}
          vessel={vessel}
          nextVesselVoyage={nextVesselVoyage}
        />

        <TimelineSection
          prevVesselVoyage={prevVesselVoyage}
          nextVesselVoyage={nextVesselVoyage}
          vesselVoyage={selectedVesselVoyage}
        />
        <TableSection />
      </div>
    </>
  );
}
