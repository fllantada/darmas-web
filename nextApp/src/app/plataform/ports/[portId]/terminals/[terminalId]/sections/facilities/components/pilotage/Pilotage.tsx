import { FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";
import { CardTitle } from "../CardTitle";
import { PilotageDetails } from "./PilotageDetails";

interface IProps {}

export function Pilotage({}: IProps) {
  const clickHandler = () => {
    useTerminalFacilities.getState().selectFacility(FacilityTitles.Pilotage);
  };
  return (
    <>
      <CardTitle title={FacilityTitles.Pilotage} clickHandler={clickHandler} />
      <PilotageDetails />
    </>
  );
}
