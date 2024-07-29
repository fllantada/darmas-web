"use client";

import { AlertCircle } from "lucide-react";

export function TableErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-slate-400 py-8 text-center  h-full w-full flex flex-col justify-center items-center">
      <AlertCircle className="inline mb-2" size={40} />
      <br />
      <span>{message}</span>
    </div>
  );
}
