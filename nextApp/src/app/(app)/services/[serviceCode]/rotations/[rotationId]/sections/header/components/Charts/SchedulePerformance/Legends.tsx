import { RotationType } from "@/globalDomain/rotationTypes";

import { useRotationStore } from "../../../../../store/rotationStore";

interface IProps {}

export function Legends({}: IProps) {
  const rotationType = useRotationStore(state => state.rotationType);

  return (
    <div className={`flex justify-center items-center w-3/4`}>
      <div className="inline-flex items-center justify-center mx-4">
        <div
          className={`rounded-full w-2 h-2 ${rotationType === RotationType.OPERATED ? "bg-operatedVessel" : "bg-partnerVessel"} mx-2`}
        />
        <span className="text-sm text-gray-500">{"Actual"}</span>
      </div>

      <div className="inline-flex items-center justify-center ml-[80px] ">
        <div
          className={`border-dotted border-2  ${rotationType === RotationType.OPERATED ? "bg-operatedVesselForecast border-operatedVesselForecast" : "bg-partnerVesselForecast border-partnerVesselForecast"}  w-4 h-4 mx-2`}
        ></div>

        <span className="text-sm text-gray-500 px-2">{"Forecast"}</span>
      </div>

      <div className="inline-flex items-center justify-center ml-[80px] ">
        <div className={" border-2 border-[#D8F256] w-4 h-4 mx-2"}></div>

        <span className="text-sm text-gray-500 px-2">{"Skip Calling"}</span>
      </div>

      <div className="inline-flex items-center justify-center ml-[80px] ">
        <div className={" border-2 border-[#F99FC8] w-4 h-4 mx-2"}></div>

        <span className="text-sm text-gray-500 px-2">
          {"Additional Calling"}
        </span>
      </div>
    </div>
  );
}
