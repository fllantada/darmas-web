import { useMemo } from "react";

import VesselFilledIcon from "@/components/icons/vesselFilled";
import { VesselColors } from "@/app/plataform/theme";

import { VesselInformation, VesselType } from "./interfaces";

type IProps = {
  vessel: VesselInformation;
};

export default function VesselColumn({ vessel }: IProps) {
  const color = useMemo(() => {
    if (vessel.type === VesselType.OPERATED) {
      return VesselColors.OPERATED;
    }
    if (vessel.type === VesselType.OTHERS) {
      return VesselColors.OTHERS;
    }
    if (vessel.type === VesselType.PARTNER) {
      return VesselColors.PARTNER;
    }
  }, [vessel.type]);

  return (
    <span className="font-sm font-medium flex flex-row items-center justify-start">
      <VesselFilledIcon className="inline mr-2" style={{ color: color }} />
      {vessel.name}
    </span>
  );
}
