import { CircleDashed } from "lucide-react";

export function TermialLineUpSkeleton() {
  return (
    <>
      <div className="flex w-full mt-[15%] items-center">
        <div className="text-center p-7 rounded bg-white shadow mx-auto">
          <CircleDashed size={55} className="animate-spin inline-block mb-2" />
          <div>{"Loading Terminal Line Up"}..</div>
        </div>
      </div>
    </>
  );
}
