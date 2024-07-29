"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center">
      <AlertCircle size={50} className="text-red-400 inline-block mb-3" />
      <h2>There was an error executing your request</h2>
      <p className="text-slate-400 text-xs my-4">
        {error.message}
        {error.digest && (
          <>
            <br />
            Digest: {error.digest}
          </>
        )}
      </p>
      <Button
        variant="default"
        className="mt-4 bg-green-700  hover:bg-green-700/90"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
