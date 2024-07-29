interface IProps {}

export function Legends({}: IProps) {
  return (
    <div className={`flex justify-center items-center w-3/4`}>
      <div className="inline-flex items-center justify-center mx-4">
        <div className={`rounded-full w-2 h-2 bg-[#DBDCDF] mx-2`} />
        <span className="text-sm text-gray-500">{"Off Time"}</span>
      </div>
      <div className="inline-flex items-center justify-center mx-4">
        <div className={`rounded-full w-2 h-2 bg-operatedVessel mx-2`} />
        <span className="text-sm text-gray-500">{"On Time (Operated)"}</span>
      </div>
      <div className="inline-flex items-center justify-center mx-4">
        <div className={`rounded-full w-2 h-2 bg-partnerVessel mx-2`} />
        <span className="text-sm text-gray-500">{"On Time (Partner)"}</span>
      </div>
      <div className="inline-flex items-center justify-center ml-[80px] ">
        <div
          className={"border-dotted border-2 border-[#454954] w-4 h-4 mx-2"}
        ></div>

        <span className="text-sm text-gray-500 px-2">{"Forecast"}</span>
      </div>
    </div>
  );
}
