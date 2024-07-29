export const SERVICES_TEXT = {
  HEADER_KPI: {
    SCHEDULE_PERFORMANCE_INFO_TEXT:
      "To measure how well the actual schedule adheres against the planned schedule.",
    COMERCIAL_RELIABILITY_INFO_TEXT:
      "To measure the actual performance against the transit days indicated to customers.",
    OPERATIONAL_EFFICIENCY_INFO_TEXT:
      "To measure the actual bunker consumption, number of port calls and voyage days against the planned.",
    EMISSION_INFO_TEXT:
      "The Carbon Intensity Indicator (CII) is a measure of how efficiently a ship transports goods, covering the year to date performance of all vessels performed in the service.",
  },
};

export const HeaderKpiTitles: Record<
  | "schedulePerformance"
  | "commercialReliability"
  | "operationalEfficiency"
  | "emissions",
  string
> = {
  schedulePerformance: "Schedule Performance",
  commercialReliability: "Commercial Reliability",
  operationalEfficiency: "Operational Efficiency",
  emissions: "Emissions",
};
