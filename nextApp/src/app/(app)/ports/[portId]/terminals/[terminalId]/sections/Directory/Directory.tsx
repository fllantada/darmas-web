"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { LoadingState } from "@/lib/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoadingContainer } from "@/components/LoadingContainer";

import { getDirectoryTree } from "./actions";
import type { TreeChartData } from "./actions";
import DirectoryVisualisation from "./DirectoryVisualization";

type DirectoryProps = {
  className?: string;
  portId: string;
  terminalId?: string;
};

export function TerminalDirectory({
  className,
  portId,
  terminalId,
}: DirectoryProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<LoadingState>(LoadingState.LOADING);
  const [error, setError] = useState<string>();
  const [graphData, setGraphData] = useState<TreeChartData>();

  useEffect(() => {
    if (open) {
      setLoading(LoadingState.LOADING);
      getDirectoryTree(portId, terminalId)
        .then(data => {
          setGraphData(data);
          setLoading(LoadingState.SUCCESS);
        })
        .catch(e => {
          setLoading(LoadingState.FAILED), setError(e.message);
        });
    }
  }, [portId, terminalId, open]);

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
