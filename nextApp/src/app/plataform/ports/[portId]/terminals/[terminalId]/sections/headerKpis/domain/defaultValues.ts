import { TerminalHeaderKpis } from "./interfaces";

export const terminalKpiTitles = {
  vesselTurnaround: { titleText: "Vessel Turnaround", infoText: "" },
  berthOnArrival: "Berth on Arrival",
  congestionImpact: "Congestion Impact",
  terminalEmission: "Port Emission",
};

export const terminalInfoText = {
  vesselTurnaround: "To illustrate the utilization of the assets",
  berthOnArrival: "To illustrate if there is any unnecessary waiting time",
  congestionImpact: "To identify the inefficiency happening in location",
  terminalEmission: "To identify the emission at Port",
};

export const defaultTermnalHeaderKpis: TerminalHeaderKpis = {
  vesselTurnaround: {
    titleText: terminalKpiTitles.vesselTurnaround.titleText,
    infoText: terminalInfoText.vesselTurnaround,
  },
  berthOnArrival: {
    titleText: terminalKpiTitles.berthOnArrival,
    infoText: terminalInfoText.berthOnArrival,
  },
  congestionImpact: {
    titleText: terminalKpiTitles.congestionImpact,
    infoText: terminalInfoText.congestionImpact,
  },
  portEmission: {
    titleText: terminalKpiTitles.terminalEmission,
    infoText: terminalInfoText.terminalEmission,
  },
};
