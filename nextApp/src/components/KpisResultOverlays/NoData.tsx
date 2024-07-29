import { AlertCircle } from "lucide-react";

export function NoData(): JSX.Element {
  return (
    <div className="text-center text-slate-400  mt-[150px]">
      <AlertCircle size="32" className="inline-block mb-2" />
      <div className="text-2xl">No data</div>
    </div>
  );
}
