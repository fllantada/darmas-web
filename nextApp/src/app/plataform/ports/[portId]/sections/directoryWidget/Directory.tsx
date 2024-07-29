"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoadingContainer } from "@/components/LoadingContainer";
import { LoadingState } from "@/app/plataform/lib/types";

import { getDirectoryTree } from "./actions";
import DirectoryVisualisation from "./DirectoryVisualization";
import { TDirectoryTree } from "./interfaces";

type DirectoryProps = {
  className?: string;
  countryCode: string;
  portCode: string;
};

export default function Directory({
  className,
  countryCode,
  portCode,
}: DirectoryProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [graphData, setGraphData] = useState<TDirectoryTree>();

  useEffect(() => {
    if (open) {
      setLoading(LoadingState.LOADING);
      getDirectoryTree(countryCode, portCode)
        .then(data => {
          setGraphData(data);
          setLoading(LoadingState.SUCCESS);
        })
        .catch(e => {
          setLoading(LoadingState.FAILED), setError(e.message);
        });
    }
  }, [open, countryCode, portCode]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <div className=" underline underline-offset-4 cursor-pointer">
          Directory
        </div>
      </DialogTrigger>
      <DialogContent size="full">
        <LoadingContainer
          state={loading}
          errorDetails={error}
          className="h-[700px]"
        >
          {graphData ? (
            <DirectoryVisualisation data={graphData} />
          ) : (
            <div className="text-slate-400 text-center">
              <AlertCircle className="inline-block mb-2" />
              <br />
              No directory data
            </div>
          )}
        </LoadingContainer>
      </DialogContent>
    </Dialog>
  );
}
