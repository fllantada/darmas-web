export enum VesselColors {
  OPERATED = "rgba(0, 193, 210, 1)",
  OPERATED_FORECAST = "rgba(0, 193, 210, 0.5)",
  OPERATED_BORDER = "rgba(0, 153, 167, 1)",

  PARTNER = "rgba(245, 188, 92, 1)",
  PARTNER_FORECAST = "rgba(245, 188, 92, 0.5)",
  PARTNER_BORDER = "rgba(204, 150, 73, 1)",

  OTHERS = "rgb(154, 128, 255)",
  OTHERS_FORECAST = "rgb(154, 128, 255, 0.5)",
  OTHERS_BORDER = "rgb(61, 24, 204)",
  OFF_TIME = "rgba(219, 220, 223, 1)",
}

export const emissionsCiiColors = {
  A: {
    color: "white",
    backgroundColor: "#449c49",
  },
  B: {
    color: "black",
    backgroundColor: "#99ca38",
  },
  C: {
    color: "black",
    backgroundColor: "#f8f62b",
  },
  D: {
    color: "white",
    backgroundColor: "#e6892f",
  },
  E: {
    color: "white",
    backgroundColor: "#de3a2e",
  },
};

export const mapStyles = {
  actual: "mapbox://styles/suteu/clm2yg0jc00sd01pbfgkh8zt4",
  light: "mapbox://styles/mapbox/light-v10",
  streets: "mapbox://styles/mapbox/streets-v11",
  outdoor: "mapbox://styles/mapbox/outdoors-v11",
  dark: "mapbox://styles/mapbox/dark-v10",
  satellite: "mapbox://styles/mapbox/satellite-v9",
  satelliteStreets: "mapbox://styles/mapbox/satellite-streets-v11",
  navigationDay: "mapbox://styles/mapbox/navigation-day-v1",
  navigationNight: "mapbox://styles/mapbox/navigation-night-v1",
};
