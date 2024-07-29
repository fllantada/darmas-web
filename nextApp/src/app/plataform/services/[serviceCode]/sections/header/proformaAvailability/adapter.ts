import { ProformaAvailabilityReportType } from "@/generated/graphql";

import {
  isNotNullOrUndefined,
  isNullOrUndefined,
  numberToDecimalStringPercentage,
} from "@/app/plataform/lib/utils";

import { ProformaAvailability, ProformaItem } from "./interfaces";

export function proformaAvailabilityAdapter(
  serverProforma?: ProformaAvailabilityReportType,
): ProformaAvailability {
  const proformaAvailability = {
    proformaAvailabilityPercent: "-",
    items: [],
  };
  if (!serverProforma) {
    return proformaAvailability;
  }

  const availabilityPercent = serverProforma.proformaAvailabilityPercent;

  const isAvailable = isNotNullOrUndefined(availabilityPercent);

  let percent: string;
  if (isAvailable) {
    const percentageString =
      numberToDecimalStringPercentage(availabilityPercent);

    percent = percentageString ?? "-";
  } else {
    percent = "-";
  }

  const items =
    serverProforma?.proformaAvailability?.map(serverItem => {
      let scrubber;
      if (isNullOrUndefined(serverItem.scrubber)) {
        scrubber = "-";
      } else {
        scrubber = serverItem.scrubber ? "Y" : "N";
      }
      const proformaItem: ProformaItem = {
        voyageCode: serverItem.voyageCode ?? "-",
        vesselName: serverItem.vesselName ?? "-",
        vesselClass: serverItem.vesselClass ?? "-",
        scrubber: scrubber,
        proforma: serverItem.proforma ?? "-",
      };
      return proformaItem;
    }) ?? [];

  return {
    proformaAvailabilityPercent: percent,
    items: items,
  };
}
