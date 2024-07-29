import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChevronDownIcon from "@/components/icons/chevronDown";
import { cn } from "@/app/plataform/lib/utils";

import { getProformaAvailability } from "./actions";
import { ProformaAvailability } from "./interfaces";
import { ProformaAvailabilityTable } from "./table/Table";

type ProformaDropdownProps = {
  serviceCode: string;
  className?: string;
};

export default function ProformaDropdown({
  className,
  serviceCode,
}: ProformaDropdownProps): JSX.Element {
  const [proformaData, setProformaData] = useState<ProformaAvailability>(
    {} as ProformaAvailability,
  );
  useEffect(() => {
    getProformaAvailability(serviceCode).then(data => {
      setProformaData(data);
    });
  }, [serviceCode]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          className,
          "bg-white py-3 px-4 font-normal rounded-full text-sm border-[#DBDCDF] border-[1px] select-none",
        )}
      >
        Proforma: {proformaData?.proformaAvailabilityPercent}
        <ChevronDownIcon className="inline" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 drop-shadow-2xl border-[1px] border-[#DBDCDF] mr-3 w-[900px]">
        {proformaData?.items && (
          <ProformaAvailabilityTable tableData={proformaData.items} />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
