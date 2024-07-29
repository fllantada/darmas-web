import moment from "moment";

import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";

export interface TVesselArrivingTerminal {
  id: string;
  carrierCode: string;
  vesselName: string;
  berthNumber: string;
  berthLOA: number;
  voyageNumber: string;
  type: RotationType;
  isFuture: boolean;
  vesselLoa: number;
  start: Date;
  end: Date;
  proformaStart?: Date;
  proformaEnd?: Date;
}

export const INITIAL_VISIBLE_WINDOW = {
  start: moment()
    .startOf("day")
    .subtract(3, "days")
    .subtract(1, "minute")
    .toDate(),
  end: moment().add(11, "days").startOf("day").toDate(),
};

export enum ViewMode {
  Timeline = "timeline",
  Table = "table",
}
