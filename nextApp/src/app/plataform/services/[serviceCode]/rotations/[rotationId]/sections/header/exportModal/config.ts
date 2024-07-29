export interface ExportOption {
  fileName: string;
  uiTitle: string;
  id: string;
}

export const vesselReportExport: ExportOption = {
  fileName: "schedule-vessel-report",
  uiTitle: "Schedule - Vessel Report",
  id: "vessel",
};

export const lmsReportExport: ExportOption = {
  fileName: "schedule-lms-data-report",
  uiTitle: "Schedule - LMS Data",
  id: "lms",
};

export const blocksTimestampsReportExport: ExportOption = {
  fileName: "schedule-blocks-timestamps-report",
  uiTitle: "Schedule - Blocks Timestamps",
  id: "blocks",
};

export const selectedKpiExport: ExportOption = {
  fileName: "schedule-selected-kpi-report",
  uiTitle: "KPI Cards",
  id: "selectedKpi",
};

export const headerKpiExport: ExportOption = {
  fileName: "schedule-header-kpis-report",
  uiTitle: "Header KPIs",
  id: "headerKpis",
};

export const staticDetailsExport: ExportOption = {
  fileName: "schedule-static-detail-report",
  uiTitle: "Static Detail",
  id: "staticDetail",
};

export const defaultExportOption = vesselReportExport;
export const exportOptions = [
  staticDetailsExport,
  headerKpiExport,
  vesselReportExport,
  lmsReportExport,
  blocksTimestampsReportExport,
  selectedKpiExport,
];
