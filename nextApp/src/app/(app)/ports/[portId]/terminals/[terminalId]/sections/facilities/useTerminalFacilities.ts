import { create } from "zustand";

import {
  AllFacilities,
  FacilityTitles,
  NavigationalInformationDetails,
  PilotageDetails,
  TerminalYardEquipmentDetails,
  TugsDetails,
  YardInformationDetails,
} from "./domain";

interface TStore {
  selectedFacility?: FacilityTitles;
  pilotageDetails?: PilotageDetails;
  tugsDetails?: TugsDetails;
  navigationalInformationDetails?: NavigationalInformationDetails;
  yardInformationDetails?: YardInformationDetails;
  terminalYardEquipmentDetails?: TerminalYardEquipmentDetails;
}

interface TActions {
  initializeTerminalFacilities: (facilitiesDetails: AllFacilities) => void;
  selectFacility: (selectedFacility: FacilityTitles) => void;
  removeSelectedFacility: () => void;
}

export const useTerminalFacilities = create<TStore & TActions>(set => ({
  initializeTerminalFacilities: (facilitiesDetails: AllFacilities) => {
    const {
      pilotage,
      tugs,
      navigationalInformation,
      yardInformation,
      terminalYardEquipment,
    } = facilitiesDetails;
    set(state => ({
      ...state,
      pilotageDetails: pilotage ? pilotage : undefined,
      tugsDetails: tugs ? tugs : undefined,
      navigationalInformationDetails: navigationalInformation
        ? navigationalInformation
        : undefined,
      yardInformationDetails: yardInformation ? yardInformation : undefined,
      terminalYardEquipmentDetails: terminalYardEquipment
        ? terminalYardEquipment
        : undefined,
    }));
  },
  selectFacility: selectedFacility => {
    set(state => ({ ...state, selectedFacility }));
  },
  removeSelectedFacility: () => {
    set(state => ({ ...state, selectedFacility: undefined }));
  },
}));
