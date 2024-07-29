import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DetailFieldNames, FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";

interface IProps {}

export function YardInformationDetails({}: IProps) {
  const selectedFacilty = useTerminalFacilities(
    state => state.selectedFacility,
  );
  const yardInformation = useTerminalFacilities(
    state => state.yardInformationDetails,
  );
  const handlerOpenChange = () => {
    useTerminalFacilities.getState().removeSelectedFacility();
  };
  return (
    <>
      <Dialog
        open={selectedFacilty === FacilityTitles.TerminalYardInformation}
        onOpenChange={handlerOpenChange}
      >
        <DialogContent size="5xl" showCloseButton={true}>
          <div className={"mt-[20px] text-[16px]"}>
            <div className={"p-4 bg-[#F1F4F4] flex flex-row   items-center "}>
              <div className={"w-[50%] flex flex-col items-start"}>
                {DetailFieldNames.MaxLOAAtBerth}
              </div>
              <div className={"w-[50%] flex flex-col items-center"}>
                {yardInformation?.maxLOAAtBerth.value}
              </div>
            </div>
            <div className={"  p-4  flex flex-row   items-center "}>
              <div className={"w-[50%] flex flex-col items-start"}>
                {DetailFieldNames.MaxBeamAtBerth}
              </div>
              <div className={"w-[50%]  flex flex-col items-center  "}>
                {yardInformation?.maxBeamAtBerth.value}
              </div>
            </div>
            <div
              className={"  p-4  bg-[#F1F4F4] flex flex-row   items-center "}
            >
              <div className={"w-[50%]  flex flex-col items-start"}>
                {DetailFieldNames.MinDepthZeroTide}
              </div>
              <div className={"w-[50%]  flex flex-col items-center  "}>
                {yardInformation?.minDepthZeroTide.value}
              </div>
            </div>
            <div className={"  p-4   flex flex-row   items-center "}>
              <div className={"w-[50%] flex flex-col items-start"}>
                {DetailFieldNames.MovesPerHourPerCrane}
              </div>
              <div className={"w-[50%]  flex flex-col items-center  "}>
                {yardInformation?.movesPerHourPerCrane.value}
              </div>
            </div>
            <div className={"  p-4 bg-[#F1F4F4] flex flex-row   items-center "}>
              <div className={"w-[50%] flex flex-col items-start"}>
                {DetailFieldNames.YardCapacity}
              </div>
              <div className={"w-[50%]  flex flex-col items-center  "}>
                {yardInformation?.yardCapacity.value}
              </div>
            </div>
            <div className={"  p-4  flex flex-row   items-center "}>
              <div className={"w-[50%] flex flex-col items-start"}>
                {DetailFieldNames.ReeferPlugs}
              </div>
              <div className={"w-[50%]  flex flex-col items-center  "}>
                {yardInformation?.reeferPlugs.value}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
