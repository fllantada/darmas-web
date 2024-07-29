import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  LoadingButton,
  type ButtonStateEnum,
} from "@/components/ui/loading-button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DownloadIicon from "@/components/icons/download";

type ExportOptions = Record<string, string>;

type ExportModalProps = {
  onReportDownload: (report: string) => void;
  state: ButtonStateEnum;
  exportOptions: ExportOptions;
};

export default function ExportModal({
  onReportDownload,
  state,
  exportOptions,
}: ExportModalProps): JSX.Element {
  const [report, setReport] = useState("headerKpis");

  function onDownload() {
    onReportDownload(report);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <DownloadIicon className="inline ml-3 cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Download
            <hr className="mt-2" />
          </DialogTitle>
        </DialogHeader>
        <div className="font-bold">Download Section For</div>
        <RadioGroup value={report} onValueChange={setReport}>
          {Object.keys(exportOptions).map(key => (
            <div className="flex items-center space-x-2" key={key}>
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key}>{exportOptions[key]}</Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <LoadingButton className="mt-4" onClick={onDownload} state={state}>
            {state === "idle" && <DownloadIicon className="mr-2" />}
            Download
          </LoadingButton>
          <DialogClose asChild>
            <Button variant="secondary" className="mt-4">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
