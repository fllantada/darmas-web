"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRotationStore } from "../../store/rotationStore";
import { ScheduleView } from "../timeline/domain/interfaces";
import { LMSTable } from "./lmsReport/LMSReportTable";
import { BlocksTable } from "./scheduleBlocks/scheduleBlocksTable";
import { VesselReportTable } from "./vesselReport/VesselReportTable";

interface IProps {}
const tabsSelectorClassNames =
  "bg-white h-[100%] p-4 border-t-[1px] border-x-[1px] border-slate-300 rounded-b-none  text-slate-300 data-[state=active]:border-[#808080] ";

export function TableSection({}: IProps) {
  const scheduleViewMode = useRotationStore(state => state.scheduleView);

  return (
    <div
      className={`${scheduleViewMode === ScheduleView.Table ? "" : "hidden"}`}
    >
      <Tabs defaultValue="vesselReport">
        <TabsList className={"p-0 flex justify-start"}>
          <TabsTrigger value="vesselReport" className={tabsSelectorClassNames}>
            <div className={"color-red-200"}> Vessel Report</div>
          </TabsTrigger>
          <TabsTrigger value="lmsData" className={tabsSelectorClassNames}>
            LMS Data
          </TabsTrigger>
          <TabsTrigger
            value="blockTimestamps"
            className={tabsSelectorClassNames}
          >
            Blocks Timestamps
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vesselReport" className="mt-0 bg-white">
          <VesselReportTable />
        </TabsContent>
        <TabsContent value="lmsData" className="mt-0 bg-white">
          <LMSTable />
        </TabsContent>
        <TabsContent value="blockTimestamps" className="mt-0 bg-white">
          <BlocksTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
