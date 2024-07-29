import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DetailFieldNames, FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";

interface IProps {}

export function NavigationalInformationDetails({}: IProps) {
  const selectedFacilty = useTerminalFacilities(
    state => state.selectedFacility,
  );
  const navigationDetails = useTerminalFacilities(
    state => state.navigationalInformationDetails,
  );
  const handlerOpenChange = () => {
    useTerminalFacilities.getState().removeSelectedFacility();
  };
  return (
    <>
      <Dialog
        open={selectedFacilty === FacilityTitles.NavigationalInformation}
        onOpenChange={handlerOpenChange}
      >
        <DialogContent size="5xl" showCloseButton={true}>
          <div className={"mt-[20px] text-[16px]"}>
            <div className={"p-4 bg-[#F1F4F4] flex flex-row   items-center "}>
              <div className={"w-[40%] flex flex-col items-start"}>
                {DetailFieldNames.AirDraftRestriction}
              </div>
              <div className={"w-[30%] flex flex-col items-center"}>
                {navigationDetails?.airDraftRestricyion.value}
              </div>
              <div className={"w-[30%] flex flex-col items-center"}>
                {navigationDetails?.airDraftRestricyion.meters}
              </div>
            </div>
            <div className={"  p-4  flex flex-row   items-center "}>
              <div className={"w-[40%] flex flex-col items-start"}>
                {DetailFieldNames.ChannelDepthAtZeroTide}
              </div>
              <div className={"w-[30%]  flex flex-col items-center  "}>
                {navigationDetails?.channelDepth.value}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
