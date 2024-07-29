"use client";

import { AlertCircle } from "lucide-react";

export default function ScheduleError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center h-full flex items-center">
      <div className="text-center w-full">
        <AlertCircle size={50} className="text-red-400 inline-block mb-3" />
        <h2>There was an error loading the schedule</h2>
        <p className="text-slate-400 text-xs my-4">
          {error.message}
          {error.digest && (
            <>
              <br />
              Digest: {error.digest}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
