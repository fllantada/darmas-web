import { RotationType } from "@/globalDomain/rotationTypes";
import moment from "moment";

import { TVesselArrivingTerminal } from "../domain/interfaces";
import { TPortTableData } from "./config";

export const getTableFormatedData = (
  visibleArrivingVessels: TVesselArrivingTerminal[],
): TPortTableData[] => {
  const tableData: TPortTableData[] = visibleArrivingVessels.map(vessel => {
    return {
      vesselName: vessel.vesselName,
      voyageNumber:
        vessel.type !== RotationType.OTHERS ? vessel.voyageNumber : "-",
      type: vessel.type,
      carrierCode: vessel.carrierCode,
      start: moment(vessel.start).format("DD/MM/YYYY HH:mm"),
      end: moment(vessel.end).format("DD/MM/YYYY HH:mm"),
      proformaStart: moment(vessel.proformaStart).format("DD/MM/YYYY HH:mm"),
      proformaEnd: moment(vessel.proformaEnd).format("DD/MM/YYYY HH:mm"),
    };
  });

  return tableData;
};
