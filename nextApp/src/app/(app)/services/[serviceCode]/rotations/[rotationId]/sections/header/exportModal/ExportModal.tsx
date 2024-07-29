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

import { defaultExportOption, ExportOption } from "./config";

type IProps = {
  onReportDownload: (report: ExportOption) => void;
  downLoadingState: ButtonStateEnum;
  exportOptions: ExportOption[];
};

export default function ExportModal({
  onReportDownload,
  downLoadingState,
  exportOptions,
}: IProps): JSX.Element {
  const [selectedOption, setSelectedOption] =
    useState<ExportOption>(defaultExportOption);

  function onDownload() {
    onReportDownload(selectedOption);
  }
  const handleValueChange = (value: string) => {
    const selected = exportOptions.find(option => option.uiTitle === value);
    if (selected) {
      setSelectedOption(selected);
    }
  };

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
        <RadioGroup
          value={selectedOption.uiTitle}
          onValueChange={handleValueChange}
        >
          {exportOptions.map(option => (
            <div className="flex items-center space-x-2" key={option.id}>
              <RadioGroupItem value={option.uiTitle} id={option.id} />
              <Label htmlFor={option.id}>{option.uiTitle}</Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <LoadingButton
            className="mt-4"
            onClick={onDownload}
            state={downLoadingState}
          >
            {downLoadingState === "idle" && <DownloadIicon className="mr-2" />}
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
