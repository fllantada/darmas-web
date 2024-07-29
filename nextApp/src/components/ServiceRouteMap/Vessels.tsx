import { linearZoomInterpolation } from "@/lib/mapUtils";

import Vessel, { type VeseelForMap } from "./Vessel";

type VesselProps = {
  vessels: VeseelForMap[];
  zoom: number;
  labelsAlwaysVisible: boolean;
};

export default function Vessels({
  vessels,
  zoom,
  labelsAlwaysVisible,
}: VesselProps): JSX.Element {
  return (
    <>
      {vessels.map(vessel => (
        <Vessel
          labelsAlwaysVisible={labelsAlwaysVisible}
          key={vessel.vesselCode}
          vessel={vessel}
          size={linearZoomInterpolation(zoom)}
        />
      ))}
    </>
  );
}
