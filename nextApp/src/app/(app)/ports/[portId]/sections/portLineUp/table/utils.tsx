import moment from "moment";

import { TVesselArrivingPort } from "../domain/interfaces";
import { TPortTableData } from "./config";

export const getTableFormatedData = (
  visibleArrivingVessels: TVesselArrivingPort[],
): TPortTableData[] => {
  const tableData: TPortTableData[] = visibleArrivingVessels.map(vessel => {
    return {
      vesselName: vessel.vesselName,
      voyageNumber: vessel.voyageCode,
      type: vessel.vesselType.toUpperCase(),

      start: moment(vessel.start).format("DD/MM/YYYY HH:mm"),
      end: moment(vessel.end).format("DD/MM/YYYY HH:mm"),
      proformaStart: moment(vessel.proformaStart).format("DD/MM/YYYY HH:mm"),
      proformaEnd: moment(vessel.proformaEnd).format("DD/MM/YYYY HH:mm"),
    };
  });

  return tableData;
};
