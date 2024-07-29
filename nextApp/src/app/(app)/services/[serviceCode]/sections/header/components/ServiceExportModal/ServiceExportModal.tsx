"use client";

import { useState } from "react";
import type { ServiceType } from "@/generated/graphql";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { DateTime } from "luxon";

import type { DateRange } from "@/lib/types";
import { type ButtonStateEnum } from "@/components/ui/loading-button";

import { getHeaderKpis, getSchedule, getStaticDetails } from "./actions";
import ExportModal from "./ExportModal";

const csvConfig = mkConfig({ useKeysAsHeaders: true });
const filenames: Record<string, string> = {
  staticDetail: "static-detail",
  headerKpis: "header-kpis",
  schedule: "schedule",
};

function startDownload(filename: string, data: Record<string, string>[]) {
  download({
    ...csvConfig,
    filename,
  })(generateCsv(csvConfig)(data));
}

type ExportModalProps = {
  service: ServiceType;
  timeRange: DateRange;
};

export default function ServiceExportModal({
  service,
  timeRange,
}: ExportModalProps): JSX.Element {
  const [state, setState] = useState<ButtonStateEnum>("idle");

  async function onReportDownload(report: string) {
    try {
      setState("loading");
      const filename = `${filenames[report]}-${service.serviceCode}-${DateTime.fromJSDate(timeRange.start).toFormat("yyyy-MM-dd-HH-mm-ss")}`;

      switch (report) {
        case "staticDetail":
          startDownload(filename, await getStaticDetails(service.serviceCode));
          break;

        case "headerKpis":
          startDownload(
            filename,
            await getHeaderKpis(service.serviceCode, timeRange),
          );
          break;

        case "schedule":
          startDownload(filename, await getSchedule(service.serviceCode));
          break;
      }

      setState("idle");
    } catch (e) {
      setState("error");
      setTimeout(() => {
        setState("idle");
      }, 2000);
    }
  }

  return (
    <ExportModal
      state={state}
      onReportDownload={onReportDownload}
      exportOptions={{
        staticDetail: "Static Detail",
        headerKpis: "Header KPIs",
        schedule: "Schedule",
      }}
    />
  );
}
