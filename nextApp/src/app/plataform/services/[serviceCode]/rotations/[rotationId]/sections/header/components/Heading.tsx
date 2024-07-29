"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDashed } from "lucide-react";

import ServicesIcon from "@/components/icons/services";

import RotationSearch, {
  type Rotation,
} from "../../../../../sections/header/components/RotationSearch";

type HeadingProps = {
  rotations: Rotation[];
  selectedRotationId: string;
  serviceCode: string;
  vesselName: string;
  operator: string;
  capacity: number | null;
};

export default function Heading({
  rotations,
  serviceCode,
  selectedRotationId,
  vesselName,
  operator,
  capacity,
}: HeadingProps): JSX.Element {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const selectedRotation =
    rotations.find(r => r.name === selectedRotationId) || rotations[0];

  function onRotationChange(rotationId: string) {
    if (rotationId.replace("-", "") !== selectedRotationId) {
      setLoading(true);
      router.push(
        `/services/${serviceCode}/rotations/${rotationId.replace("-", "")}`,
      );
    }
  }

  return (
    <div className="flex items-center">
      <div className="rounded-full bg-slate-200 inline-block p-5 mr-3 float-left">
        {loading ? (
          <CircleDashed size={32} className="animate-spin" />
        ) : (
          <ServicesIcon style={{ width: 32, height: 32 }} />
        )}
      </div>
      <div>
        <div className="text-2xl font-medium mb-2 mt-1 text-[#22242A] cursor-pointer w-[165px]">
          <RotationSearch
            disabled={loading}
            activeRotation={selectedRotation}
            rotations={rotations}
            onNavigateToRotation={onRotationChange}
            className="mb-2"
          />
        </div>
        <h2 className="text-sm font-normal text-[#454954]">
          {[vesselName, operator, `${capacity || "--"} TEUs`].map(
            (text, idx) => (
              <span
                key={idx}
                className="bg-slate-200 mr-2 py-1 px-4 rounded-full"
              >
                {text}
              </span>
            ),
          )}
        </h2>
      </div>
    </div>
  );
}
