"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import moment from "moment";
import Timeline from "react-vis-timeline";
import { TimelineGroup, TimelineItem } from "vis-timeline/types";

import { useRotationStore } from "../../../store/rotationStore";
import { ScheduleView, ViewTimeScale } from "../domain/interfaces";
import { getTimelineOptions } from "./timelineConfig";

import "./Timeline.css";

import { getDayAxisLegend, getMonthAxisLegend } from "../../../utils";

interface IProps {}

const tlInit = (
  timelineRef: MutableRefObject<Timeline | null>,

  data: [TimelineItem[], TimelineGroup[]],

  windowRange: { start: Date; end: Date },

  axisLegend?: string,
): void => {
  const timeline = timelineRef.current?.timeline;
  if (!timeline) return;

  // Timeline setup
  const [items, groups] = data;
  const { start, end } = windowRange;

  const min = moment(start).toDate();
  const max = moment(end).toDate();
  const itemsWithBorders = items.map(item => {
    const today = moment();
    const startShip = moment(item.start);
    const isAfterToday = startShip.isAfter(today);

    if (isAfterToday)
      return {
        ...item,
        style: `${item.style} border-style: dotted; border-width: 2px; border-color: #FFFFF;`,
      };
    return item;
  });

  timeline.setOptions({ min, max });
  timeline.setGroups(groups);
  timeline.setItems(itemsWithBorders);

  timeline.setWindow(start, end, { animation: false });

  timeline.on("select", ({ items }) => {
    if (!items || items.length === 0)
      useRotationStore.getState().unSelectItem();
    useRotationStore.getState().selectItem(items[0]);
  });
  timeline.on("click", ({ what }) => {
    if (what !== "item") useRotationStore.getState().unSelectItem();
  });

  if (axisLegend) {
    const visPanel = document
      .getElementsByClassName("vis-panel vis-background")
      .item(0);
    if (visPanel) {
      visPanel.innerHTML = axisLegend;
    }
  }
};

export const RotationTimeline = ({}: IProps) => {
  const timelineRef = useRef<Timeline | null>(null);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const scheduleViewMode = useRotationStore(state => state.scheduleView);
  const [monthWindowRange, dayWindowRange] = useRotationStore(state => [
    state.monthWindowRange,
    state.dayWindowRange,
  ]);
  const [groups, items] = useRotationStore(state => [
    state.timelineGroups,
    state.timelineItems,
  ]);
  const vesselCode = useRotationStore(state => state.vesselCode);
  const timeScale = useRotationStore(state => state.timeScale);
  const options = getTimelineOptions(timeScale);

  useEffect(() => {
    if (!isFirstLoading) return;
    if (!timelineRef?.current?.timeline) return;
    const axisLegend = getMonthAxisLegend(vesselCode);
    tlInit(timelineRef, [items, groups], monthWindowRange, axisLegend);
    setFirstLoading(false);
  }, [
    timelineRef,
    items,
    groups,
    monthWindowRange,
    isFirstLoading,
    vesselCode,
  ]);

  useEffect(() => {
    if (!timelineRef?.current?.timeline) return;
    const timeline = timelineRef.current.timeline;

    const newItems = useRotationStore.getState().timelineItems;
    const newGroups = useRotationStore.getState().timelineGroups;

    if (timeScale === ViewTimeScale.Day) {
      const axisLegend = getDayAxisLegend(vesselCode);
      const visPanel = document
        .getElementsByClassName("vis-panel vis-background")
        .item(0);
      if (visPanel) {
        visPanel.innerHTML = axisLegend;
      }
      timeline.setWindow(dayWindowRange.start, dayWindowRange.end, {
        animation: false,
      });
    }
    if (timeScale === ViewTimeScale.Month) {
      const axisLegend = getMonthAxisLegend(vesselCode);
      const visPanel = document
        .getElementsByClassName("vis-panel vis-background")
        .item(0);
      if (visPanel) {
        visPanel.innerHTML = axisLegend;
      }
      timeline.setWindow(monthWindowRange.start, monthWindowRange.end, {
        animation: false,
      });
    }
    timeline.setItems(newItems);
    timeline.setGroups(newGroups);
  }, [timeScale, dayWindowRange, monthWindowRange, vesselCode]);

  return (
    <div
      className={`border rounded-md rotations ${scheduleViewMode !== ScheduleView.Timeline ? "hidden" : ""}`}
    >
      <Timeline options={options} ref={timelineRef} />
    </div>
  );
};
