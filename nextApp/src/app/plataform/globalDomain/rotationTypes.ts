export enum RotationType {
  PARTNER = "partner",
  OTHERS = "others",
  OPERATED = "operated",
}

export const calculateRotationType = (vesselCode: string): RotationType => {
  const firstLetterVesselCode = vesselCode.charAt(0).toUpperCase();

  let rotationType = RotationType.OTHERS;

  if (firstLetterVesselCode === "K" || firstLetterVesselCode === "C") {
    rotationType = RotationType.OPERATED;
  }
  if (firstLetterVesselCode === "V" || firstLetterVesselCode === "P") {
    rotationType = RotationType.PARTNER;
  }
  return rotationType;
};
