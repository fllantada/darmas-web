"use server";

import moment from "moment";

import { RotationType } from "@/app/plataform/globalDomain/rotationTypes";
import {
  isNotNullOrUndefined,
  isNullOrUndefined,
} from "@/app/plataform/lib/utils";

import { TVesselArrivingPort } from "./domain/interfaces";

export const serverToDomainArrivingVesselAdapter = (
  serverArrivingVessels: any[],
): TVesselArrivingPort[] => {
  const vesselsArriving: TVesselArrivingPort[] = [];

  serverArrivingVessels.forEach((vessel: any) => {
    if (
      isNullOrUndefined(vessel.arrivalTime) ||
      isNullOrUndefined(vessel.departureTime)
    ) {
      return [];
    }

    const start = moment(vessel.arrivalTime);
    const end = moment(vessel.departureTime);

    const isFuture = moment(start).isAfter(new Date());
    const isActual = !isFuture;

    let vesselType = RotationType.OTHERS;
    switch (vessel.vesselType) {
      case undefined:
        vesselType = RotationType.OTHERS;
        break;
      case null:
        vesselType = RotationType.OTHERS;
        break;
      case "Others":
        vesselType = RotationType.OTHERS;
        break;
      case "Operated":
        vesselType = RotationType.OPERATED;
        break;
      case "Partner":
        vesselType = RotationType.PARTNER;
    }

    let isProforma = false;

    if (
      isNotNullOrUndefined(vessel.proArrivalTime) &&
      isNotNullOrUndefined(vessel.proDepartureTime)
    ) {
      isProforma = true;
    }

    const serviceCode = isNotNullOrUndefined(vessel.service)
      ? vessel.service
      : undefined;

    const vesselName = isNotNullOrUndefined(vessel.vesselName)
      ? vessel.vesselName
      : "-";
    const voyageCode = isNotNullOrUndefined(vessel.voyage)
      ? vessel.voyage
      : "-";

    const arrivingVessel = {
      serviceCode,
      vesselName,
      vesselType,
      voyageCode,
      isFuture,
      isProforma,
      isActual,
      start: start.toDate(),
      end: end.toDate(),
      proformaStart: isProforma
        ? moment(vessel.proArrivalTime).toDate()
        : undefined,
      proformaEnd: isProforma
        ? moment(vessel.proDepartureTime).toDate()
        : undefined,
    };
    vesselsArriving.push(arrivingVessel);
  });

  return vesselsArriving;
};
