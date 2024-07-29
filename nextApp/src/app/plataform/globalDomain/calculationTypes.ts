export enum CalculationType {
  ACTUAL = "actual",
  FORECAST = "forecast",
  OTHER = "other",
}

export const getCalculationType = (type?: string): CalculationType => {
  if (!type) return CalculationType.OTHER;
  switch (type) {
    case "actual":
      return CalculationType.ACTUAL;
    case "forecast":
      return CalculationType.FORECAST;
    default:
      return CalculationType.OTHER;
  }
};
