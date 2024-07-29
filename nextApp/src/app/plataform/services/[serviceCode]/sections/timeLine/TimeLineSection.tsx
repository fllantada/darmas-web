"use client";

import { useEffect, useState } from "react";
import { ServiceType } from "@/generated/graphql";

import ScheduleTable from "@/components/ScheduleTable";

import { Controls } from "./components/Controls";
import { tableColumns } from "./components/ServiceScheduleTable/ServiceScheduleTableCols";
import { ServiceTimeline } from "./components/Timeline";
import { ViewMode } from "./domain/interfaces";
import { useServiceTimeline } from "./store/useServiceTimeline";
import { serverToDomainServiceAdapter } from "./utils";

type IProps = {
  selectedService: ServiceType;
};

export default function TimeLineSection({
  selectedService,
}: IProps): JSX.Element {
  const view = useServiceTimeline(state => state.viewMode);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedService) return;
    const service = serverToDomainServiceAdapter(selectedService);
    useServiceTimeline.getState().initializeServiceTimelineStore(service);
    setLoading(false);
  }, [selectedService]);

  if (loading) return <></>;

  if (selectedService.vessels.length === 0)
    return (
      <div className="w-full text-center bg-white py-7 rounded-md text-slate-300">
        No Vessels
      </div>
    );

  return (
    <div className="mb-80">
      <Controls />
      <div className="services">
        <ServiceTimeline />
      </div>
      {view === ViewMode.Table && (
        <ScheduleTable columns={tableColumns} data={selectedService} />
      )}
    </div>
  );
}
