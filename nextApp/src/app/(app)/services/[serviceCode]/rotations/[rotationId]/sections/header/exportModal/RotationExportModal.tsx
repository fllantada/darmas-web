"use client";

import { useMemo, useState } from "react";
import type { VoyageType } from "@/generated/graphql";
import { DateTime } from "luxon";

import { type ButtonStateEnum } from "@/components/ui/loading-button";

import { useRotationStore } from "../../../store/rotationStore";
import { getHeaderKpis, getStaticDetails } from "./actions";
/* import { getKpiCards } from "./actions"; */
import {
  blocksTimestampsReportExport,
  ExportOption,
  exportOptions,
  headerKpiExport,
  lmsReportExport,
  selectedKpiExport,
  staticDetailsExport,
  vesselReportExport,
} from "./config";
import { capitalizeWords, startDownload } from "./downloadUtils";
import ExportModal from "./ExportModal";
import {
  createAtPortKpiDownloadContent,
  createAtSeaKpiDownloadContent,
  createEndKpiDownloadContent,
} from "./kpiReportUtils";

type IProps = {
  rotation: VoyageType;
};

export default function RotationExportModal({ rotation }: IProps): JSX.Element {
  const [downloadingState, setDownloadingState] =
    useState<ButtonStateEnum>("idle");
  const selectedItem = useRotationStore(state => state.selectedItem);

  async function onReportDownload(report: ExportOption) {
    try {
      setDownloadingState("loading");
      const filename = `${report.fileName}-${
        rotation.vesselCode + rotation.voyageNo
      }`;

      switch (report.id) {
        case vesselReportExport.id:
          const data = useRotationStore.getState().vesselVoyage;

          if (!data) return;

          const vesselReportTableData = data.vesselStates.map(vesselState => ({
            Port: vesselState.atPort || vesselState.arrivalPort || "NA",

            State: capitalizeWords(vesselState.subStatus.replace(/_/g, " ")),

            ["Actual Timestamp"]: vesselState.statusTs
              ? DateTime.fromISO(vesselState.statusTs).toFormat(
                  "dd/LL/yyyy HH:mm",
                )
              : "NA",
          }));

          if (vesselReportTableData.length === 0)
            vesselReportTableData.push({
              Port: "-",
              State: "-",
              ["Actual Timestamp"]: "-",
            });

          startDownload(filename, vesselReportTableData);

          break;

        case lmsReportExport.id:
          const portCalls = useRotationStore.getState().vesselVoyage?.portCalls;
          if (!portCalls) return;
          const lmsReportTableData = portCalls.map(portCall => ({
            Port: portCall.portCode,
            ["Schedule Change Status"]: portCall.changeStatus || "-",
            ["ETA/ATA"]: portCall.etaDate
              ? DateTime.fromISO(portCall.etaDate).toFormat("dd/LL/yyyy HH:mm")
              : "NA",
            ["ETB/ATB"]: portCall.etbDate
              ? DateTime.fromISO(portCall.etbDate).toFormat("dd/LL/yyyy HH:mm")
              : "NA",
            ["ETD/ATD"]: portCall.etdDate
              ? DateTime.fromISO(portCall.etdDate).toFormat("dd/LL/yyyy HH:mm")
              : "NA",
            ["Proforma ETA"]: portCall.proEtaDate
              ? DateTime.fromISO(portCall.proEtaDate).toFormat(
                  "dd/LL/yyyy HH:mm",
                )
              : "NA",
            ["Proforma ETB"]: portCall.proEtbDate
              ? DateTime.fromISO(portCall.proEtbDate).toFormat(
                  "dd/LL/yyyy HH:mm",
                )
              : "NA",
            ["Proforma ETD"]: portCall.proEtdDate
              ? DateTime.fromISO(portCall.proEtdDate).toFormat(
                  "dd/LL/yyyy HH:mm",
                )
              : "NA",
          }));
          startDownload(filename, lmsReportTableData);
          break;

        case blocksTimestampsReportExport.id:
          const blocks = useRotationStore.getState().actualVoyageBlocks;
          if (!blocks) return;
          const blocksReportTableData = blocks.map(block => ({
            Port: block.atPort,
            Block: block.status,
            Start: DateTime.fromJSDate(block.startTime).toFormat(
              "dd/LL/yyyy HH:mm",
            ),
            End: DateTime.fromJSDate(block.endTime).toFormat(
              "dd/LL/yyyy HH:mm",
            ),
          }));
          startDownload(filename, blocksReportTableData);

          break;

        case selectedKpiExport.id:
          if (!selectedItem) return;
          const itemType = selectedItem?.id.toString().split("-").reverse()[0];
          const selectedDate = useRotationStore.getState().selectedDate;

          const fileNameWithDate = `${rotation.vesselCode}${selectedItem?.group}-${DateTime.fromJSDate(selectedDate).toFormat("dd-LL-yyyy HH:mm")}`;

          switch (itemType) {
            case "end":
              const endKpiData = useRotationStore.getState().endRotationKpis;

              if (!endKpiData) return;
              const formatedEndKpiData = createEndKpiDownloadContent(
                endKpiData,
                `${rotation.vesselCode} ${selectedItem?.group}`,
              );

              startDownload(fileNameWithDate, formatedEndKpiData);

              break;
            case "port":
              const portKpiData = useRotationStore.getState().portRotationKpis;
              if (!portKpiData) return;

              const formatedPortKpiData = createAtPortKpiDownloadContent(
                portKpiData,
                selectedDate,
              );

              startDownload(fileNameWithDate, formatedPortKpiData);
              break;
            case "sea":
              const seaKpiData = useRotationStore.getState().seaRotationKpis;
              if (!seaKpiData) return;
              const formatedSeaKpiData = createAtSeaKpiDownloadContent(
                seaKpiData,
                selectedDate,
              );

              startDownload(fileNameWithDate, formatedSeaKpiData);
              break;
          }

          break;
        case headerKpiExport.id:
          startDownload(
            filename,
            await getHeaderKpis(rotation.vesselCode, rotation.voyageNo),
          );
          break;
        case staticDetailsExport.id:
          startDownload(filename, [
            await getStaticDetails(rotation.vesselCode, rotation.voyageNo),
          ]);
          break;
      }

      setDownloadingState("idle");
    } catch (e) {
      setDownloadingState("error");
      setTimeout(() => {
        setDownloadingState("idle");
      }, 2000);
    }
  }

  const dynamicOptions = useMemo(() => {
    if (!selectedItem)
      return exportOptions.filter(option => option.id !== selectedKpiExport.id);

    const itemType = selectedItem?.id?.toString().split("-").reverse()[0];
    const isValidTypeForExport =
      itemType === "port" || itemType === "sea" || itemType === "end";
    if (isValidTypeForExport) {
      return exportOptions;
    }
    return exportOptions.filter(option => option.id !== selectedKpiExport.id);
  }, [selectedItem]);

  return (
    <ExportModal
      downLoadingState={downloadingState}
      onReportDownload={onReportDownload}
      exportOptions={dynamicOptions}
    />
  );
}
