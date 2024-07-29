import { FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";
import { CardTitle } from "../CardTitle";
import { YardEquipmentDetails } from "./YardEquipmentDetails";

interface IProps {}

export function YardEquipment({}: IProps) {
  const clickHandler = () => {
    useTerminalFacilities
      .getState()
      .selectFacility(FacilityTitles.TerminalYardEquipment);
  };
  return (
    <>
      <CardTitle
        title={FacilityTitles.TerminalYardEquipment}
        clickHandler={clickHandler}
      />
      <YardEquipmentDetails />
    </>
  );
}
