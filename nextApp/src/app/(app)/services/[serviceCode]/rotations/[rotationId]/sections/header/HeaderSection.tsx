import { useMemo } from "react";
import { HeaderVoyageKpIs, VesselType, VoyageType } from "@/generated/graphql";

import Heading from "./components/Heading";
import RotationHeadereKpis from "./components/RotationHeaderKpis";
import { adaptServerKpisToDomainFormat } from "./domain/adapter";
import { RotationHeaderKpis } from "./domain/interfaces";
import RotationExportModal from "./exportModal/RotationExportModal";
import ProformaDropdown from "./proformaAvailability/ProformaDropdown";

interface IProps {
  rotationsList: { name: string; id: string }[];
  selectedVesselVoyage: VoyageType;
  serviceCode: string;
  vessel: VesselType;
  headerKpis?: HeaderVoyageKpIs;
  voyageNo: string;
  vesselCode: string;
  nextVesselVoyage?: VoyageType;
}

export function HeaderSection({
  rotationsList,
  selectedVesselVoyage,
  serviceCode,
  vessel,
  headerKpis: serverHeaderKpis,
  voyageNo,
  vesselCode,
}: IProps) {
  const rotationHeaderKpis: RotationHeaderKpis | undefined = useMemo(() => {
    if (!serverHeaderKpis) return undefined;
    const kpis = adaptServerKpisToDomainFormat(serverHeaderKpis);
    return kpis;
  }, [serverHeaderKpis]);
  return (
    <>
      <div className="flex flex-cols">
        <div className="basis-2/3">
          <Heading
            rotations={rotationsList || []}
            selectedRotationId={
              selectedVesselVoyage.vesselCode + selectedVesselVoyage.voyageNo
            }
            serviceCode={serviceCode}
            vesselName={vessel.vesselName}
            operator={vessel.operator}
            capacity={vessel.capacity}
          />
        </div>
        <div className="basis-1/3 text-right flex justify-end items-center ">
          <ProformaDropdown className="inline" />
          <RotationExportModal rotation={selectedVesselVoyage} />
        </div>
      </div>

      {rotationHeaderKpis && (
        <RotationHeadereKpis
          data={rotationHeaderKpis}
          voyageNo={voyageNo}
          vesselCode={vesselCode}
        />
      )}
    </>
  );
}
