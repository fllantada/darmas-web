import { BerthDetail } from "../../domain";

interface IProps {
  berthDetails?: BerthDetail[];
}

export function DinamicBerthList({ berthDetails }: IProps) {
  if (!berthDetails) {
    return null;
  }
  return (
    <>
      <div className={"w-[10%] flex flex-col items-center"}>
        <div>{berthDetails[0].berthNumber}</div>
        <div>{berthDetails[1].berthNumber}</div>
        <div>{berthDetails[2].berthNumber}</div>
      </div>
      <div className={"w-[10%] flex flex-col items-center"}>
        <div>{berthDetails[0].selection}</div>
        <div>{berthDetails[1].selection}</div>
        <div>{berthDetails[2].selection}</div>
      </div>
      <div className={"w-[35%] flex flex-col items-center"}>
        <div>{berthDetails[0].value}</div>
        <div>{berthDetails[1].value}</div>
        <div>{berthDetails[2].value}</div>
      </div>
    </>
  );
}
