import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DetailFieldNames, FacilityTitles } from "../../domain";
import { useTerminalFacilities } from "../../useTerminalFacilities";
import { DinamicBerthList } from "../yardInformation/DinamicBerthList";

interface IProps {}

export function YardEquipmentDetails({}: IProps) {
  const selectedFacilty = useTerminalFacilities(
    state => state.selectedFacility,
  );
  const yardEquipment = useTerminalFacilities(
    state => state.terminalYardEquipmentDetails,
  );
  const handlerOpenChange = () => {
    useTerminalFacilities.getState().removeSelectedFacility();
  };
  return (
    <>
      <Dialog
        open={selectedFacilty === FacilityTitles.TerminalYardEquipment}
        onOpenChange={handlerOpenChange}
      >
        <DialogContent size="5xl" showCloseButton={true}>
          <div className={"mt-[20px] text-[14px]"}>
            <div className={"p-2 bg-[#F1F4F4] flex flex-row   items-center "}>
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.TotalNumberOfGantryHarbourCranes}
              </div>
              <DinamicBerthList
                berthDetails={
                  yardEquipment?.totalNumberOfGantryHarbourCranes.berthDetails
                }
              />
            </div>
            <div className={"  p-2  flex flex-row   items-center "}>
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.MaxCraneOutreach}
              </div>
              <DinamicBerthList
                berthDetails={yardEquipment?.maxCraneOutreach.berthDetails}
              />
            </div>
            <div
              className={"  p-2  bg-[#F1F4F4] flex flex-row   items-center "}
            >
              <div className={"w-[45%]  flex flex-col items-start"}>
                {DetailFieldNames.MaxHeightFromYardLevel}
              </div>
              <DinamicBerthList
                berthDetails={
                  yardEquipment?.maxHeightFromYardLevel.berthDetails
                }
              />
            </div>
            <div className={"  p-2   flex flex-row   items-center "}>
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.SWLSpreader}
              </div>
              <DinamicBerthList
                berthDetails={yardEquipment?.swlSpreader.berthDetails}
              />
            </div>
            <div className={"  p-2 bg-[#F1F4F4] flex flex-row   items-center "}>
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.SWLHook}
              </div>
              <DinamicBerthList
                berthDetails={yardEquipment?.swlHook.berthDetails}
              />
            </div>
            <div className={"  p-2  flex flex-row   items-center "}>
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.TwinLiftCapability20}
              </div>
              <DinamicBerthList
                berthDetails={yardEquipment?.twinLiftCapability20.berthDetails}
              />
            </div>
            <div
              className={"  p-2  bg-[#F1F4F4]  flex flex-row   items-center "}
            >
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.TwinLiftCapability40}
              </div>
              <DinamicBerthList
                berthDetails={yardEquipment?.twinLiftCapability40.berthDetails}
              />
            </div>
            <div className={"  p-2  flex flex-row   items-center "}>
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.TotalNumberOfPrimeMover}
              </div>

              <DinamicBerthList
                berthDetails={
                  yardEquipment?.totalNumberOfPrimeMover.berthDetails
                }
              />
            </div>
            <div
              className={"  p-2 bg-[#F1F4F4]  flex flex-row   items-center "}
            >
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.TotalNumberOfRubberRailTypeGantry}
              </div>
              <DinamicBerthList
                berthDetails={
                  yardEquipment?.totalNumberOfRubberRailTypeGantry.berthDetails
                }
              />
            </div>
            <div className={"  p-2  flex flex-row   items-center "}>
              <div className={"w-[45%] flex flex-col items-start"}>
                {DetailFieldNames.TotalNumberOfForkliftCrane}
              </div>
              <DinamicBerthList
                berthDetails={
                  yardEquipment?.totalNumberOfForkliftCrane.berthDetails
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
