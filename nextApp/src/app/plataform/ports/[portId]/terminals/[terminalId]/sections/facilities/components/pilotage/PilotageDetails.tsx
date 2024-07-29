import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DetailFieldNames, FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";

interface IProps {}

export function PilotageDetails({}: IProps) {
  const selectedFacilty = useTerminalFacilities(
    state => state.selectedFacility,
  );
  const pilotageDetails = useTerminalFacilities(state => state.pilotageDetails);
  const handlerOpenChange = () => {
    useTerminalFacilities.getState().removeSelectedFacility();
  };

  if (!pilotageDetails) return null;

  return (
    <>
      <Dialog
        open={selectedFacilty === FacilityTitles.Pilotage}
        onOpenChange={handlerOpenChange}
      >
        <DialogContent size="5xl" showCloseButton={true}>
          <div
            className={
              "h-[50px] mt-[20px] p-4 bg-[#F1F4F4] flex flex-row  justify-between items-center text-[16px]"
            }
          >
            <div className={"flex flex-col items-center min-w-[150px]"}>
              {DetailFieldNames.PilotCompulsory}
            </div>
            <div className={"flex flex-col items-center min-w-[150px]"}>
              {pilotageDetails.pilotCompulsory.value}
            </div>
            <div className={"flex flex-col items-center min-w-[150px]"}></div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
