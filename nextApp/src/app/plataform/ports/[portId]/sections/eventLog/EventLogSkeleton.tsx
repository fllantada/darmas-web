import { Skeleton } from "@/components/ui/skeleton";
import CalendarIcon from "@/components/icons/calendar";
import ExpandIcon from "@/components/icons/expand";

export function EventLogSkeleton() {
  return (
    <>
      <h2>
        Event Log <CalendarIcon className="inline ml-5" />
        <ExpandIcon className="inline ml-2 float-right" />
      </h2>
      <Skeleton className="mt-4 h-[20px] w-full mb-4" />
      <Skeleton className="h-[20px] w-full mb-4" />

      <Skeleton className="h-[20px] w-full mb-4" />
    </>
  );
}
