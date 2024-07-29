"use client";

import { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import Timeline from "react-vis-timeline";

import {
  INITIAL_VISIBLE_WINDOW,
  TVesselArrivingPort,
  ViewMode,
} from "../domain/interfaces";
import { usePortTimeline } from "../stores/usePortTimeline";
import { timelineOptions } from "./timelineConfig";
import { createTimelineItems } from "./utils";

import "./Timeline.css";

interface IProps {
  visibleVessels: TVesselArrivingPort[];
}
const getAxisLegend = (text: string | string[]): string => {
  return `<div class="flex-row items-center vis-axis-legend">
      <div>
        <span>${text}</span>
      </div>
    </div>`;
};

export const PortTimeline = ({ visibleVessels }: IProps) => {
  const timelineRef = useRef<Timeline | null>(null);
  const viewMode = usePortTimeline(state => state.viewMode);
  const proformaEnable = usePortTimeline(state => state.proformaEnable);
  const [goToTodayFlag, doneGoToToday] = usePortTimeline(state => [
    state.goToTodayFlag,
    state.doneGoToToday,
  ]);

  const { items, groups } = useMemo(() => {
    return createTimelineItems(visibleVessels, proformaEnable);
  }, [visibleVessels, proformaEnable]);

  useEffect(() => {
    if (!timelineRef.current?.timeline) return;
    const timeline = timelineRef.current.timeline;
    timeline.setWindow(
      INITIAL_VISIBLE_WINDOW.start,
      INITIAL_VISIBLE_WINDOW.end,
      { animation: false },
    );
    const visPanel = document
      .getElementsByClassName("vis-panel vis-background")
      .item(0);
    if (visPanel) {
      visPanel.innerHTML = getAxisLegend("DATE");
    }
  }, []);
  useEffect(() => {
    if (!goToTodayFlag) return;
    if (!timelineRef.current?.timeline) return;
    const timeline = timelineRef.current.timeline;
    timeline.moveTo(
      moment()
        .add(3, "days")
        .subtract(1, "minute")

        .toDate(),
      {
        animation: true,
      },
    );
    doneGoToToday();
  }, [goToTodayFlag, doneGoToToday]);
  useEffect(() => {
    if (!timelineRef.current?.timeline) return;
    const timeline = timelineRef.current.timeline;

    timeline.setItems(items);
    timeline.setGroups(groups);
  }, [items, groups]);

  const handlerangechange = (start: Date, end: Date): void => {
    usePortTimeline.getState().moveTimelineToWindow({ start, end });
  };

  return (
    <div
      className={`border rounded-md port-timeline ${viewMode !== ViewMode.Timeline ? "hidden" : ""}`}
    >
      <Timeline
        initialItems={items}
        initialGroups={groups}
        options={timelineOptions}
        ref={timelineRef}
        rangechangedHandler={({ start, end }: { start: Date; end: Date }) =>
          handlerangechange(start, end)
        }
      />
    </div>
  );
};
