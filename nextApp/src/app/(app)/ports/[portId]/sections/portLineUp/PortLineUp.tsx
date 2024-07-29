"use client";

import { useEffect } from "react";

import TimelineControls from "./controls/TimelineControls";
import { TVesselArrivingPort, ViewMode } from "./domain/interfaces";
import { usePortTimeline } from "./stores/usePortTimeline";
import { VesselArrivingTable } from "./table/VesselArrivingTable";
import { PortTimeline } from "./timeline/Timeline";

interface IProps {
  vesselsArriving: TVesselArrivingPort[];
}

export function PortLineUp({ vesselsArriving }: IProps) {
  const viewMode = usePortTimeline(state => state.viewMode);
  const visibleVessels = usePortTimeline(state => state.visibleVessels);

  useEffect(() => {
    usePortTimeline.getState().initializePortTimelineStore(vesselsArriving);
  }, [vesselsArriving]);

  return (
    <>
      <TimelineControls showFilters={viewMode === ViewMode.Timeline} />

      <PortTimeline visibleVessels={visibleVessels} />

      {viewMode === ViewMode.Table && <VesselArrivingTable />}
    </>
  );
}
