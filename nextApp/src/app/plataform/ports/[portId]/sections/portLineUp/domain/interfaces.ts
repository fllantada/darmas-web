import moment from "moment";

import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";

export interface TVesselArrivingPort {
  serviceCode?: string;
  vesselName: string;
  vesselType: RotationType;
  voyageCode: string;
  start: Date;
  end: Date;
  proformaStart?: Date;
  proformaEnd?: Date;
  isFuture: boolean;
  isProforma: boolean;
  isActual: boolean;
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

export interface FilterConditions {
  Operated: boolean;
  Partner: boolean;
  Others: boolean;
}
