import { Loader2 } from "lucide-react";

type LoadingCenterProps = {
  text: string;
};

export default function LoadingCenter({ text }: LoadingCenterProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
      <div className="w-[300px] rounded border bg-white p-8 text-center shadow">
        <Loader2 size={45} className="m-auto mb-2 block animate-spin" />{" "}
        <span className="text-3xl">{text}</span>
      </div>
    </div>
  );
}
