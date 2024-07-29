import { CircleDashed } from "lucide-react";

interface IProps {
  message?: string;
}

export default function PageLoading({ message }: IProps) {
  return (
    <div className="flex w-full mt-[15%] items-center">
      <div className="text-center p-7 rounded bg-white shadow mx-auto">
        <CircleDashed size={55} className="animate-spin inline-block mb-2" />
        <div>{message || "Loading"}...</div>
      </div>
    </div>
  );
}
