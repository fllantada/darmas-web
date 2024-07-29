"use client";

import { useMemo, useState } from "react";
import { VesselType, VoyageType } from "@/generated/graphql";
import { AlertCircle } from "lucide-react";
import { DateTime } from "luxon";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ServiceRouteMap from "@/components/ServiceRouteMap/Map";

type IProps = {
  vessel: VesselType;
  selectedVesselVoyage: VoyageType;
  nextVesselVoyage?: VoyageType;
};

export default function LiveMapSection({
  vessel,
  selectedVesselVoyage,
  nextVesselVoyage,
}: IProps): JSX.Element {
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const vessels = useMemo(() => [vessel], [vessel]); // We need to memoize this to prevent re-rendering of the map on showLabels change

  return (
    <>
      <h2 className="text-base font-semibold flex justify-between">
        <div>Vessels&apos; Live Position</div>
        <div className="flex items-center space-x-2">
          <Switch
            id="vessel-labels"
            checked={showLabels}
            onCheckedChange={setShowLabels}
          />
          <Label htmlFor="vessel-labels">Vessel Label</Label>
        </div>
      </h2>
      <div className="bg-white p-3 rounded-md mt-2">
        {vessel && vessel.latestPosition ? (
          <ServiceRouteMap
            className="h-[300px]"
            vessels={vessels}
            mapStyle="light"
            labelsAlwaysVisible={showLabels}
          />
        ) : (
          <div className="mt-3 text-center text-slate-400 h-[70px]">
            <AlertCircle size={24} className="inline mb-2" />
            <br />
            {DateTime.fromISO(selectedVesselVoyage.endDate) < DateTime.now() &&
            !nextVesselVoyage ? (
              <>
                This vessel is no longer active in this service. To find the
                live position of this vessel, please refer to the vessel&lsquo;s
                current service
              </>
            ) : (
              <>
                We&lsquo;re currently unable to display the AIS position of this
                vessel. Our team is actively working to retrieve the data.
                Please check back shortly.
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
