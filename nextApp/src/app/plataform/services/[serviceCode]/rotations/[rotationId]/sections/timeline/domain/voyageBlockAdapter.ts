import { VoyageBlockType } from "@/generated/graphql";
import moment from "moment";

import { VesselStatus } from "@/app/plataform/globalDomain/vesselStatus";

import { VoyageBlock } from "./interfaces";

export const voyageBlockAdapter = (
  serverBlocks: VoyageBlockType[],
): { blocks: VoyageBlock[]; start: Date; end: Date } => {
  if (!serverBlocks) return { start: new Date(), end: new Date(), blocks: [] };
  if (serverBlocks.length === 0)
    return { start: new Date(), end: new Date(), blocks: [] };

  let startDate = moment(serverBlocks[0].startTime + "Z");
  let endDate = moment(serverBlocks[0].startTime + "Z");

  const voyageBlocks: VoyageBlock[] = serverBlocks.map((serverBlock, index) => {
    const startBlockMoment = moment(serverBlock.startTime + "Z");
    const endBlockMoment = moment(serverBlock.endTime + "Z");
    const hasProformaValues: boolean =
      serverBlock.proStartTime && serverBlock.proEndTime;

    const block = {
      blockNumber: index,
      vesselCode: serverBlock.vesselCode ?? "",
      voyageNumber: serverBlock.voyageNumber ?? "",
      status: getBlockStatus(serverBlock?.block ?? ""),
      atPort: serverBlock?.atPort ?? "",
      sequence: serverBlock?.sequence ?? index,
      startTime: serverBlock?.startTime
        ? new Date(serverBlock.startTime + "Z")
        : new Date(serverBlock.endTime + "Z"),
      endTime: serverBlock?.endTime
        ? new Date(serverBlock.endTime + "Z")
        : new Date(serverBlock.startTime + "Z"),
      delta: hasProformaValues
        ? deltaDayCalculation(serverBlock.startTime, serverBlock.proStartTime)
        : undefined,
    };

    if (startBlockMoment.isValid() && startBlockMoment.isBefore(startDate)) {
      startDate = startBlockMoment;
    }
    if (endBlockMoment.isValid() && endBlockMoment.isAfter(endDate)) {
      endDate = endBlockMoment;
    }

    return block;
  });

  return {
    blocks: voyageBlocks,
    start: startDate.toDate(),
    end: endDate.toDate(),
  };
};

const getBlockStatus = (status: string): VesselStatus => {
  switch (status) {
    case "Sea Passage":
      return VesselStatus.Passage;
    case "Waiting Time":
      return VesselStatus.Waiting;
    case "At Port":
      return VesselStatus.Port;
    case "Voyage Commence":
      return VesselStatus.Start;
    case "Voyage End":
      return VesselStatus.End;
    case "Waiting Time Before Berth":
      return VesselStatus.WaitingBeforeBerth;
    case "Waiting Time After Berth":
      return VesselStatus.WaitingAfterBerth;
    default:
      return VesselStatus.Unknown;
  }
};

const deltaDayCalculation = (startTime: Date, endTime: Date): string => {
  const start = moment(startTime);
  const end = moment(endTime);
  const duration = moment.duration(start.diff(end));
  const days = duration.asDays().toFixed(0);

  return days;
};
