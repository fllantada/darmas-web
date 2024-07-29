import React from "react";
import { AlertCircle, CircleDashed } from "lucide-react";

import { LoadingState } from "@/lib/types";
import { cn } from "@/lib/utils";

type LoadingContainerProps = {
  state: LoadingState;
  children: React.ReactNode;
  errorDetails?: string;
  loadingMessage?: string;
  errorMessage?: string;
  className?: string;
};

export function LoadingContainer({
  state,
  errorDetails,
  children,
  loadingMessage = "Loading data",
  errorMessage = "Error loading data",
  className,
}: LoadingContainerProps) {
  return (
    <>
      {state === LoadingState.LOADING && (
        <div
          className={cn(
            "text-center text-xl flex items-center justify-center",
            className,
          )}
        >
          <div>
            <CircleDashed className="animate-spin inline mb-3" size={35} />
            <br />
            {loadingMessage}
          </div>
        </div>
      )}
      {state === LoadingState.FAILED && (
        <div
          className={cn(
            "text-center text-xl h-full flex items-center justify-center text-red-500",
            className,
          )}
        >
          <div>
            <AlertCircle className="inline mb-3" size={35} />
            <div> {errorMessage}</div>
            <div className="text-xs text-slate-400 mt-2">{errorDetails}</div>
          </div>
        </div>
      )}
      {state === LoadingState.SUCCESS && (
        <div className={className}>{children}</div>
      )}
    </>
  );
}
