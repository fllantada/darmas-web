import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DetailFieldNames, FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";

interface IProps {}

export function TugsDetails({}: IProps) {
  const selectedFacilty = useTerminalFacilities(
    state => state.selectedFacility,
  );
  const tugsDetails = useTerminalFacilities(state => state.tugsDetails);
  const handlerOpenChange = () => {
    useTerminalFacilities.getState().removeSelectedFacility();
  };
  return (
    <>
      <Dialog
        open={selectedFacilty === FacilityTitles.Tugs}
        onOpenChange={handlerOpenChange}
      >
        <DialogContent size="5xl" showCloseButton={true}>
          <div className={"mt-[20px] text-[16px]"}>
            <div className={"p-4 bg-[#F1F4F4] flex flex-row   items-center "}>
              <div className={"w-[50%] flex flex-col items-start"}>
                {DetailFieldNames.NumberOfTugs}
              </div>
              <div className={"w-[50%] flex flex-col items-center"}>
                {tugsDetails?.numberTugs.value}
              </div>
            </div>
            <div className={"  p-4  flex flex-row   items-center "}>
              <div className={"w-[50%] flex flex-col items-start"}>
                {DetailFieldNames.OtherInformation}
              </div>
              <div className={"w-[50%]  flex flex-col items-center  "}>
                {tugsDetails?.otherInfo.value}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
