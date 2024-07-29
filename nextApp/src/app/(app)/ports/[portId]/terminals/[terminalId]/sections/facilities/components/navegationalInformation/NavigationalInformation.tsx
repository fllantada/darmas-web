import { FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";
import { CardTitle } from "../CardTitle";
import { NavigationalInformationDetails } from "./NavigationalInformationDetails";

interface IProps {}

export function NavigationalInformation({}: IProps) {
  const clickHandler = () => {
    useTerminalFacilities
      .getState()
      .selectFacility(FacilityTitles.NavigationalInformation);
  };
  return (
    <>
      <CardTitle
        title={FacilityTitles.NavigationalInformation}
        clickHandler={clickHandler}
      />
      <NavigationalInformationDetails />
    </>
  );
}
