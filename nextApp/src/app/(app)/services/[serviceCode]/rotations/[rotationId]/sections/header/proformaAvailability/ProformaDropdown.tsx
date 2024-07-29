"use client";

import { cn } from "@/lib/utils";

import { useRotationStore } from "../../../store/rotationStore";

type IProps = {
  className?: string;
};

export default function ProformaDropdown({ className }: IProps): JSX.Element {
  const vesselVoyage = useRotationStore(state => state.vesselVoyage);

  return (
    <div
      className={cn(
        className,
        "bg-white py-3 px-4 font-normal rounded-full text-sm border-[#DBDCDF] border-[1px] select-none",
      )}
    >
      Proforma: {vesselVoyage?.proformaAvailability || "-"}
    </div>
  );
}
