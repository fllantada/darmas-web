export enum FacilityTitles {
  Pilotage = "Pilotage",
  Tugs = "Tugs",
  NavigationalInformation = "Navigational Information",
  TerminalYardInformation = "Terminal Yard Information",
  TerminalYardEquipment = "Terminal Yard Equipment",
}
export enum DetailFieldNames {
  PilotCompulsory = "Pilot Compulsory",
  NumberOfTugs = "Number of Tugs Used for Berthing and Unberthing",
  OtherInformation = "Other Information",
  AirDraftRestriction = "Air Draft Restriction",
  ChannelDepthAtZeroTide = "Channel Depth at Zero Tide",
  MaxLOAAtBerth = "Max LOA at Berth",
  MaxBeamAtBerth = "Max Beam at Berth",
  MinDepthZeroTide = "Min Depth Zero Tide",
  MovesPerHourPerCrane = "Moves per Hour per Crane",
  YardCapacity = "Yard Capacity",
  ReeferPlugs = "Reefer Plugs",
  TotalNumberOfGantryHarbourCranes = "Total Number of Gantry/Harbour Crane per Berth",
  MaxCraneOutreach = "Max Crane Outreach of Gantry/Harbour Crane",
  MaxHeightFromYardLevel = "Max Height from Yard Level of Gantry/Harbour Crane",
  SWLSpreader = "SWL Spreader",
  SWLHook = "SWL Hook",
  TwinLiftCapability20 = "Twin Lift Capability - 20’ft Container",
  TwinLiftCapability40 = "Twin Lift Capability - 40’ft Container",
  TotalNumberOfPrimeMover = "Total Number of Prime Mover",
  TotalNumberOfRubberRailTypeGantry = "Total Number of Rubber/Rail Type Gantry for Yard",
  TotalNumberOfForkliftCrane = "Total Number of Forklift Crane for Yard",
}

export interface PilotageDetails {
  pilotCompulsory: {
    fieldName: DetailFieldNames.PilotCompulsory;
    value: "Y" | "N";
  };
}

export interface TugsDetails {
  numberTugs: {
    fieldName: DetailFieldNames.NumberOfTugs;
    value: number;
  };
  otherInfo: {
    fieldName: "Other Information";
    value: string;
  };
}

export interface NavigationalInformationDetails {
  airDraftRestricyion: {
    fieldName: DetailFieldNames.AirDraftRestriction;
    value: "Y" | "N";
    meters: string;
  };

  channelDepth: {
    fieldName: DetailFieldNames.ChannelDepthAtZeroTide;
    value: string;
  };
}

export interface YardInformationDetails {
  maxLOAAtBerth: {
    fieldName: DetailFieldNames.MaxLOAAtBerth;
    value: string;
  };
  maxBeamAtBerth: {
    fieldName: DetailFieldNames.MaxBeamAtBerth;
    value: string;
  };
  minDepthZeroTide: {
    fieldName: DetailFieldNames.MinDepthZeroTide;
    value: string;
  };
  movesPerHourPerCrane: {
    fieldName: DetailFieldNames.MovesPerHourPerCrane;
    value: string;
  };
  yardCapacity: {
    fieldName: DetailFieldNames.YardCapacity;
    value: string;
  };
  reeferPlugs: {
    fieldName: DetailFieldNames.ReeferPlugs;
    value: string;
  };
}

export interface TerminalYardEquipmentDetails {
  totalNumberOfGantryHarbourCranes: {
    fieldName: DetailFieldNames.TotalNumberOfGantryHarbourCranes;
    berthDetails: BerthDetail[];
  };
  maxCraneOutreach: {
    fieldName: DetailFieldNames.MaxCraneOutreach;
    berthDetails: BerthDetail[];
  };
  maxHeightFromYardLevel: {
    fieldName: DetailFieldNames.MaxHeightFromYardLevel;
    berthDetails: BerthDetail[];
  };
  swlSpreader: {
    fieldName: DetailFieldNames.SWLSpreader;
    berthDetails: BerthDetail[];
  };
  swlHook: {
    fieldName: DetailFieldNames.SWLHook;
    berthDetails: BerthDetail[];
  };
  twinLiftCapability20: {
    fieldName: DetailFieldNames.TwinLiftCapability20;
    berthDetails: BerthDetail[];
  };
  twinLiftCapability40: {
    fieldName: DetailFieldNames.TwinLiftCapability40;
    berthDetails: BerthDetail[];
  };
  totalNumberOfPrimeMover: {
    fieldName: DetailFieldNames.TotalNumberOfPrimeMover;
    berthDetails: BerthDetail[];
  };
  totalNumberOfRubberRailTypeGantry: {
    fieldName: DetailFieldNames.TotalNumberOfRubberRailTypeGantry;
    berthDetails: BerthDetail[];
  };
  totalNumberOfForkliftCrane: {
    fieldName: DetailFieldNames.TotalNumberOfForkliftCrane;
    berthDetails: BerthDetail[];
  };
}

export interface AllFacilities {
  pilotage: PilotageDetails;
  tugs: TugsDetails;
  navigationalInformation: NavigationalInformationDetails;
  yardInformation: YardInformationDetails;
  terminalYardEquipment: TerminalYardEquipmentDetails;
}

export interface BerthDetail {
  berthNumber: string;
  selection?: "G" | "H";
  value: string;
}
