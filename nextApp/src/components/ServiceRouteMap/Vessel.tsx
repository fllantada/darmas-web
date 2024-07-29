import { useEffect, useMemo, useState } from "react";
import { Marker } from "react-map-gl";

import VesselMarker from "@/components/icons/vesselMarker";
import {
  calculateRotationType,
  RotationType,
} from "@/app/plataform/globalDomain/rotationTypes";

export type VeseelForMap = any & {
  latestPosition: {
    latitude: number;
    longitude: number;
    course: number;
  };
};

type VesselProps = {
  vessel: VeseelForMap;
  size: number;
  labelsAlwaysVisible: boolean;
};

export default function Vessel({
  vessel,
  size,
  labelsAlwaysVisible,
}: VesselProps): JSX.Element {
  const [showName, setShowName] = useState(labelsAlwaysVisible);

  const vesselTypeClassName = useMemo(() => {
    const type = calculateRotationType(vessel.vesselCode);

    if (type === RotationType.OPERATED) {
      return "fill-operatedVessel";
    }
    if (type === RotationType.PARTNER) {
      return "fill-partnerVessel";
    }

    if (type === RotationType.OTHERS) {
      return "fill-otherVessel";
    }
    return "fill-current";
  }, [vessel.vesselCode]);

  useEffect(() => {
    setShowName(labelsAlwaysVisible);
  }, [labelsAlwaysVisible]);

  return (
    <Marker
      longitude={vessel.latestPosition.longitude}
      latitude={vessel.latestPosition.latitude}
    >
      <div
        className="relative text-primary"
        onMouseEnter={() => !labelsAlwaysVisible && setShowName(true)}
        onMouseLeave={() => !labelsAlwaysVisible && setShowName(false)}
      >
        <VesselMarker
          className={vesselTypeClassName}
          size={size * (showName && !labelsAlwaysVisible ? 1.2 : 1)}
          rotation={vessel.latestPosition.course || 0}
          style={showName ? { transition: "width 0.5s" } : undefined}
        />
        {showName && (
          <div
            className={`absolute text-center text-xs bottom-[-20px] whitespace-nowrap px-2 inline-block bg-white rounded-md text-black`}
          >
            {vessel.vesselName}
          </div>
        )}
      </div>
    </Marker>
  );
}
