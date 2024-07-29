"use client";

import { useMemo, useState } from "react";
import { ServiceType } from "@/generated/graphql";
import { AlertCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ServiceRouteMap from "@/components/ServiceRouteMap/Map";

type IProps = {
  selectedService: ServiceType;
};

export default function LiveMapSection({
  selectedService,
}: IProps): JSX.Element {
  // Filter out vessels that are not active. In a voyage right now
  const vessels = useMemo(() => {
    if (selectedService.vessels && selectedService.vessels.length > 0) {
      const today = new Date();
      return selectedService.vessels.filter(v =>
        v.voyages.some(
          voyage =>
            new Date(voyage.startDate) <= today &&
            new Date(voyage.endDate) >= today,
        ),
      );
    }
    return [];
  }, [selectedService.vessels]);

  const [showLabels, setShowLabels] = useState<boolean>(false);

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
        {vessels.length > 0 ? (
          <div className={"my-4"}>
            <ServiceRouteMap
              labelsAlwaysVisible={showLabels}
              className="h-[300px]"
              vessels={vessels}
              mapStyle="light"
            />
          </div>
        ) : (
          <div className="mt-3 text-center text-slate-400 h-[70px]">
            <AlertCircle size={24} className="inline mb-2" />
            <br />
            No Voyage data
          </div>
        )}
      </div>
    </>
  );
}
