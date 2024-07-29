import { TerminalType } from "@/generated/graphql";
import { DateTime } from "luxon";

import {
  calculateRotationType,
  RotationType,
} from "@/app/plataform/globalDomain/rotationTypes";
import { isNotNullOrUndefined } from "@/app/plataform/lib/utils";

import { TVesselArrivingTerminal } from "./domain/interfaces";

export function vesselArrivingTerminalAdapter(
  serverVessels: TerminalType,
): TVesselArrivingTerminal[] {
  const vesselsArriving: TVesselArrivingTerminal[] = [];

  serverVessels.terminalLineup.forEach(serverVessel => {
    const vesselLoa = serverVessel.vesselLoa || 150;
    const spaceLetter = vesselLoa <= 150 ? 8 : 9;
    const uniqueId = `${serverVessel.vesselName}-${serverVessel.rotation}-${serverVessel.arrivalTime}`;
    const vesselIsFuture =
      DateTime.fromISO(serverVessel.arrivalTime) > DateTime.now();

    const vessel: TVesselArrivingTerminal = {
      id: uniqueId,
      carrierCode: isNotNullOrUndefined(serverVessel.carrier)
        ? serverVessel.carrier
        : "",
      berthNumber: `${Math.floor(Math.random() * 4) + 1}`,
      berthLOA: 1500,
      vesselName: serverVessel.vesselName,
      voyageNumber: isNotNullOrUndefined(serverVessel.rotation)
        ? serverVessel.rotation.slice(0, 4) +
          "-" +
          serverVessel.rotation.slice(4)
        : serverVessel.vesselName.slice(0, spaceLetter),
      type: isNotNullOrUndefined(serverVessel?.rotation)
        ? calculateRotationType(serverVessel?.rotation)
        : RotationType.OTHERS,
      isFuture: vesselIsFuture,
      start: DateTime.fromISO(serverVessel.arrivalTime).toJSDate(),
      end: DateTime.fromISO(serverVessel.departureTime).toJSDate(),
      proformaStart: isNotNullOrUndefined(serverVessel.proArrivalTime)
        ? DateTime.fromISO(serverVessel.proArrivalTime).toJSDate()
        : undefined,
      proformaEnd: isNotNullOrUndefined(serverVessel.proDepartureTime)
        ? DateTime.fromISO(serverVessel.proDepartureTime).toJSDate()
        : undefined,
      vesselLoa: isNotNullOrUndefined(serverVessel.vesselLoa)
        ? serverVessel.vesselLoa
        : 0,
    };
    vesselsArriving.push(vessel);
  });

  return vesselsArriving;
}
