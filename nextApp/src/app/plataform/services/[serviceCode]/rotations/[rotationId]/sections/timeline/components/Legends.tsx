import { VesselStatus } from "@/app/plataform/globalDomain/vesselStatus";

interface IProps {}

export const Legends = ({}: IProps) => {
  return (
    <>
      <div className="inline-flex px-1 items-center justify-center ">
        <div className="border-dotted border-2 border-black  w-4 h-4 "></div>

        <span className="text-sm px-2">{"Forecast"}</span>
      </div>
      <div className="inline-flex px-1 items-center justify-center ml-5">
        <span className={`h-4 w-4 mx-2   bg-[#d9e1e0] }`} />
        <span className="px-2 text-sm">{VesselStatus.Passage}</span>
      </div>
      <div className="inline-flex px-1 items-center justify-center ml-5">
        <span className={`h-4 w-4 mx-2   bg-[#727b9d] call-status-port`} />
        <span className="px-2 text-sm">{VesselStatus.Port}</span>
      </div>
      <div className="inline-flex px-1 items-center justify-center ml-5">
        <span
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg,    rgba(219, 220, 223, 0.7),
              rgba(219, 220, 223, 0.7) 0.75px,
              rgba(69, 73, 84, 0.7) 0.75px,
              rgba(69, 73, 84, 0.7) 4px)`,
          }}
          className={"h-4 w-4"}
        />
        <span className="px-2 text-sm">{VesselStatus.Waiting}</span>
      </div>
    </>
  );
};

export default Legends;
