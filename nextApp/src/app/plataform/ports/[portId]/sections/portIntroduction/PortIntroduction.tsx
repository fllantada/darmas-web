import { PortType } from "@/generated/graphql";
import { Globe } from "lucide-react";

import PointOfContact from "./ controls/PointsOfContact";

type PortIntroductionProps = {
  port: PortType;
  className?: string;
};

export default function PortIntroduction({
  port,
  className,
}: PortIntroductionProps) {
  return (
    <div className={className}>
      <h2 className="text-base font-semibold my-2">Port Introduction</h2>
      <h3 className="text-sm font-semibold my-2">Overview:</h3>
      <p className="text-xs font-normal">{port.overview}</p>
      {port.website && (
        <>
          <h3 className="text-sm font-semibold mt-4 mb-2">Website:</h3>
          <a
            href={`https://${port.website}`}
            target="_port"
            className="text-sm front-nornal text-green-500"
          >
            <Globe className="inline-block mr-3" size={14} />
            {port.website}
          </a>
        </>
      )}
      <PointOfContact contacts={port.contacts || []} />
    </div>
  );
}
