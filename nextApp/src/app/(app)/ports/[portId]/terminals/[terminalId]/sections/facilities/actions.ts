import { faker } from "@faker-js/faker";

import {
  AllFacilities,
  DetailFieldNames,
  NavigationalInformationDetails,
  PilotageDetails,
  TerminalYardEquipmentDetails,
  TugsDetails,
  YardInformationDetails,
} from "./domain";

export const getTerminalFacilities = async (
  terminalId: string,
): Promise<AllFacilities> => {
  if (!terminalId) throw new Error("Terminal ID is required");

  //
  const pilotageDetails: PilotageDetails = {
    pilotCompulsory: {
      fieldName: DetailFieldNames.PilotCompulsory,
      value: faker.helpers.arrayElement(["Y", "N"]),
    },
  };
  const tugsDetails: TugsDetails = {
    numberTugs: {
      fieldName: DetailFieldNames.NumberOfTugs,
      value: faker.number.int({ min: 1, max: 10 }),
    },
    otherInfo: {
      fieldName: "Other Information",
      value: faker.lorem.sentence({ min: 5, max: 30 }),
    },
  };

  //
  const airDraftRestriction = faker.helpers.arrayElement(["Y", "N"]) as
    | "Y"
    | "N";
  const navigationalInformationDetails: NavigationalInformationDetails = {
    airDraftRestricyion: {
      fieldName: DetailFieldNames.AirDraftRestriction,
      value: airDraftRestriction,
      meters:
        airDraftRestriction === "Y"
          ? faker.number.int({ min: 1, max: 1000 }).toString() + " m"
          : "N/A",
    },
    channelDepth: {
      fieldName: DetailFieldNames.ChannelDepthAtZeroTide,
      value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
    },
  };
  //
  const yardInformationDetails: YardInformationDetails = {
    maxLOAAtBerth: {
      fieldName: DetailFieldNames.MaxLOAAtBerth,
      value: faker.number.int({ min: 1, max: 1000 }).toString() + " m",
    },
    maxBeamAtBerth: {
      fieldName: DetailFieldNames.MaxBeamAtBerth,
      value:
        faker.number
          .int({ min: 1, max: 10000 })
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " m",
    },
    minDepthZeroTide: {
      fieldName: DetailFieldNames.MinDepthZeroTide,
      value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
    },
    movesPerHourPerCrane: {
      fieldName: DetailFieldNames.MovesPerHourPerCrane,
      value: faker.number.int({ min: 1, max: 1000 }).toString() + " m",
    },
    yardCapacity: {
      fieldName: DetailFieldNames.YardCapacity,
      value:
        faker.number
          .int({ min: 1000000, max: 100000000 })
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " teus",
    },
    reeferPlugs: {
      fieldName: DetailFieldNames.ReeferPlugs,
      value: faker.number
        .int({ min: 5000, max: 50000 })
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
    },
  };
  //

  const terminalYardEquipmentDetails: TerminalYardEquipmentDetails = {
    totalNumberOfGantryHarbourCranes: {
      fieldName: DetailFieldNames.TotalNumberOfGantryHarbourCranes,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 10 }).toString(),
        },
        {
          berthNumber: "Berth 2",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 10 }).toString(),
        },
        {
          berthNumber: "Berth 3",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 10 }).toString(),
        },
      ],
    },
    maxCraneOutreach: {
      fieldName: DetailFieldNames.MaxCraneOutreach,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
        },
        {
          berthNumber: "Berth 2",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
        },
        {
          berthNumber: "Berth 3",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
        },
      ],
    },
    maxHeightFromYardLevel: {
      fieldName: DetailFieldNames.MaxHeightFromYardLevel,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
        },
        {
          berthNumber: "Berth 2",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
        },
        {
          berthNumber: "Berth 3",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 100 }).toString() + " m",
        },
      ],
    },
    swlSpreader: {
      fieldName: DetailFieldNames.SWLSpreader,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 300 }).toString() + " tonnes",
        },
        {
          berthNumber: "Berth 2",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 300 }).toString() + " tonnes",
        },
        {
          berthNumber: "Berth 3",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 300 }).toString() + " tonnes",
        },
      ],
    },
    swlHook: {
      fieldName: DetailFieldNames.SWLHook,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 300 }).toString() + " tonnes",
        },
        {
          berthNumber: "Berth 2",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 300 }).toString() + " tonnes",
        },
        {
          berthNumber: "Berth 3",
          selection: faker.helpers.arrayElement(["G", "H"]),
          value: faker.number.int({ min: 1, max: 300 }).toString() + " tonnes",
        },
      ],
    },
    twinLiftCapability20: {
      fieldName: DetailFieldNames.TwinLiftCapability20,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          value: faker.lorem.sentence({ min: 2, max: 5 }),
        },
        {
          berthNumber: "Berth 2",
          value: faker.lorem.sentence({ min: 1, max: 4 }),
        },
        {
          berthNumber: "Berth 3",
          value: faker.lorem.sentence({ min: 1, max: 4 }),
        },
      ],
    },
    twinLiftCapability40: {
      fieldName: DetailFieldNames.TwinLiftCapability40,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          value: faker.lorem.sentence({ min: 2, max: 4 }),
        },
        {
          berthNumber: "Berth 2",
          value: faker.lorem.sentence({ min: 2, max: 4 }),
        },
        {
          berthNumber: "Berth 3",
          value: faker.lorem.sentence({ min: 2, max: 4 }),
        },
      ],
    },
    totalNumberOfPrimeMover: {
      fieldName: DetailFieldNames.TotalNumberOfPrimeMover,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          value: faker.number.int({ min: 1000, max: 10000 }).toString(),
        },
        {
          berthNumber: "Berth 2",
          value: faker.number.int({ min: 1000, max: 10000 }).toString(),
        },
        {
          berthNumber: "Berth 3",
          value: faker.number.int({ min: 1000, max: 10000 }).toString(),
        },
      ],
    },
    totalNumberOfRubberRailTypeGantry: {
      fieldName: DetailFieldNames.TotalNumberOfRubberRailTypeGantry,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          value: faker.number.int({ min: 1000, max: 10000 }).toString(),
        },
        {
          berthNumber: "Berth 2",
          value: faker.number.int({ min: 1000, max: 10000 }).toString(),
        },
        {
          berthNumber: "Berth 3",
          value: faker.number.int({ min: 1000, max: 10000 }).toString(),
        },
      ],
    },
    totalNumberOfForkliftCrane: {
      fieldName: DetailFieldNames.TotalNumberOfForkliftCrane,
      berthDetails: [
        {
          berthNumber: "Berth 1",
          value: faker.number
            .int({ min: 1000, max: 10000 })
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        },
        {
          berthNumber: "Berth 2",
          value: faker.number
            .int({ min: 1000, max: 10000 })
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        },
        {
          berthNumber: "Berth 3",
          value: faker.number
            .int({ min: 1000, max: 10000 })
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        },
      ],
    },
  };

  return {
    pilotage: pilotageDetails,
    tugs: tugsDetails,
    navigationalInformation: navigationalInformationDetails,
    yardInformation: yardInformationDetails,
    terminalYardEquipment: terminalYardEquipmentDetails,
  };
};
