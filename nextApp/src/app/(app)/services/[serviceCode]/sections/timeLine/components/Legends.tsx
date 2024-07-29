import { Button } from "@/components/ui/button";
import ResetIcon from "@/components/icons/reset";

interface IProps {
  showResetButton: boolean;
  handleResetButtonClick: () => void;
}

export function Legends({ showResetButton, handleResetButtonClick }: IProps) {
  return (
    <>
      <div className={`inline-flex justify-between items-center w-3/4 `}>
        <div className={"w-[80%] inline-flex justify-center items-center"}>
          <div className="inline-flex items-center justify-center mx-4">
            <div className={`rounded-full w-2 h-2 bg-operatedVessel mx-2`} />
            <span className="text-sm text-gray-500">{"Operated"}</span>
          </div>
          <div className="inline-flex items-center justify-center mx-4">
            <div className={`rounded-full w-2 h-2 bg-partnerVessel mx-2`} />
            <span className="text-sm text-gray-500">{"Partner"}</span>
          </div>
          <div className="inline-flex items-center justify-center ml-[80px] ">
            <div
              className={"border-dotted border-2 border-[#454954] w-4 h-4 mx-2"}
            ></div>

            <span className="text-sm text-gray-500 px-2">{"Forecast"}</span>
          </div>
        </div>
        <div className="flex items-center w-[20%] ml-auto justify-end  ">
          {showResetButton && (
            <Button onClick={handleResetButtonClick} variant="roundedDark">
              <ResetIcon className="" />
              Now
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
