import { AlertCircle } from "lucide-react";

interface IProps {
  text?: string;
}

export function NoData({ text }: IProps): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center text-center text-slate-400  mt-[150px]">
      <AlertCircle size="48" className="inline-block mb-2" />
      <div className="text-2xl mt-12 w-[500px]">{text ?? "No data"}</div>
    </div>
  );
}
