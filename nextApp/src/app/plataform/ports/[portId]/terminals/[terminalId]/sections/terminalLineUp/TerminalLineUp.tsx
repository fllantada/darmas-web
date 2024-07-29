"use client";

import { useEffect } from "react";

import TimelineControls from "./controls/TimelineControls";
import { TVesselArrivingTerminal, ViewMode } from "./domain/interfaces";
import { useTerminalTimeline } from "./stores/useTerminalTimeline";
import { VesselArrivingTable } from "./table/VesselArrivingTable";
import { TerminalTimeline } from "./timeline/Timeline";

interface IProps {
  allVesselsArriving: TVesselArrivingTerminal[];
}

export function TerminalLineUp({ allVesselsArriving }: IProps) {
  const viewMode = useTerminalTimeline(state => state.viewMode);
  const visibleVessels = useTerminalTimeline(state => state.visibleVessels);

  useEffect(() => {
    if (useTerminalTimeline.getState().allVessels.length > 0) return;
    useTerminalTimeline
      .getState()
      .initializePortTimelineStore(allVesselsArriving);

    return () => {
      useTerminalTimeline.getState().resetPortTimelineStore();
    };
  }, [allVesselsArriving]);

  return (
    <>
      <TimelineControls showFilters={viewMode === ViewMode.Timeline} />

      <TerminalTimeline visibleVessels={visibleVessels} />

      {viewMode === ViewMode.Table && <VesselArrivingTable />}
    </>
  );
}
