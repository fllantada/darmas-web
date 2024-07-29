"use client";

import { useEffect } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTitle,
} from "@/components/ui/collapsible";

import { NavigationalInformation } from "./components/navegationalInformation/NavigationalInformation";
import { Pilotage } from "./components/pilotage/Pilotage";
import { Tugs } from "./components/tugs/Tugs";
import { YardEquipment } from "./components/yardEquipment/YardEquipment";
import { YardInformation } from "./components/yardInformation/YardInformation";
import { useTerminalFacilities } from "./useTerminalFacilities";

interface IProps {
  terminalId: string;
}

export function TerminalFacilities({ terminalId }: IProps) {
  /*   useEffect(() => {
    getTerminalFacilities(terminalId).then(faclities =>
      useTerminalFacilities.getState().initializeTerminalFacilities(faclities),
    );
  }, [terminalId]); */

  return (
    <div className="mt-4 p-3 border-b-[1px] border-[#DBDCDF]">
      <Collapsible startOpen={true}>
        <CollapsibleTitle>
          <h2 className={"mb-2"}>Facilities</h2>
        </CollapsibleTitle>
        <CollapsibleContent>
          <Pilotage />
          <Tugs />
          <NavigationalInformation />
          <YardInformation />
          <YardEquipment />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
