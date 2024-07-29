import { FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";
import { CardTitle } from "../CardTitle";
import { TugsDetails } from "./TugsDetails";

interface IProps {}

export function Tugs({}: IProps) {
  const clickHandler = () => {
    useTerminalFacilities.getState().selectFacility(FacilityTitles.Tugs);
  };
  return (
    <>
      <CardTitle title={FacilityTitles.Tugs} clickHandler={clickHandler} />
      <TugsDetails />
    </>
  );
}
