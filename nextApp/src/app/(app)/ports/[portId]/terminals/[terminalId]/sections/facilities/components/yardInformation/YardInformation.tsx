import { FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";
import { CardTitle } from "../CardTitle";
import { YardInformationDetails } from "./YardInformationDetails";

interface IProps {}

export function YardInformation({}: IProps) {
  const clickHandler = () => {
    useTerminalFacilities
      .getState()
      .selectFacility(FacilityTitles.TerminalYardInformation);
  };
  return (
    <>
      <CardTitle
        title={FacilityTitles.TerminalYardInformation}
        clickHandler={clickHandler}
      />
      <YardInformationDetails />
    </>
  );
}
