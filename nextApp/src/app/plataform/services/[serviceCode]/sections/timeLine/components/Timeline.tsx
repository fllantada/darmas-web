"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Timeline from "react-vis-timeline";

import { useKpiStore } from "../../serviceKpis/store/kpiStore";
import { ViewMode, ViewTimeScale } from "../domain/interfaces";
import { useServiceTimeline } from "../store/useServiceTimeline";
import {
  DAY_TIMELINE_OPTIONS,
  dayAxisLegend,
  MONTH_TIMELINE_OPTIONS,
  monthAxisLegend,
} from "./timeLineConfig";

interface IProps {}

export const ServiceTimeline = ({}: IProps) => {
  const timelineRef = useRef<Timeline | null>(null);
  const customTimeId = useRef<string>("month-slider");
  const [items, groups] = useServiceTimeline(state => [
    state.timelineItems,
    state.timelineGroups,
  ]);
  const kpiSelectedDate = useServiceTimeline(state => state.kpiSelectedDate);
  const viewTimeScale = useServiceTimeline(state => state.viewTimeScale);
  const viewTimeScaleRef = useRef(viewTimeScale);

  const viewMode = useServiceTimeline(state => state.viewMode);
  const [goToSelectedFlag, doneGoToSelected] = useServiceTimeline(state => [
    state.goToSelectedFlag,
    state.doneGoToSelected,
  ]);
  const router = useRouter();

  useEffect(() => {
    doneGoToSelected();
    if (!goToSelectedFlag) return;
    if (!timelineRef.current?.timeline) return;

    const timeline = timelineRef.current.timeline;

    const newCenterStart = moment(new Date()).startOf("day").toDate();

    let newCenter: Date;
    if (viewTimeScaleRef.current === ViewTimeScale.Month) {
      newCenter = moment(newCenterStart).add(1, "months").toDate();
    } else {
      newCenter = moment(newCenterStart).add(1, "days").toDate();
    }
    viewTimeScaleRef.current;

    timeline.moveTo(newCenter, {
      animation: true,
    });
  }, [goToSelectedFlag, doneGoToSelected]);

  useEffect(() => {
    viewTimeScaleRef.current = viewTimeScale;
    if (!timelineRef.current?.timeline) return;
    const timeline = timelineRef.current.timeline;
    const serviceCode = useServiceTimeline.getState().serviceCode;

    const { visibleWindow: newVisibleWindow, kpiSelectedDate } =
      useServiceTimeline.getState();
    timeline.setWindow(newVisibleWindow.start, newVisibleWindow.end, {
      animation: false,
    });
    useKpiStore.getState().selectNewDates({
      start: kpiSelectedDate.start,
      end: kpiSelectedDate.end,
    });

    if (viewTimeScale === ViewTimeScale.Month) {
      timeline.setOptions(MONTH_TIMELINE_OPTIONS);
      const visPanel = document
        .getElementsByClassName("vis-panel vis-background")
        .item(0);
      if (visPanel) {
        visPanel.innerHTML = monthAxisLegend(serviceCode);
      }
    }
    if (viewTimeScale === ViewTimeScale.Day) {
      timeline.setOptions(DAY_TIMELINE_OPTIONS);
      const visPanel = document
        .getElementsByClassName("vis-panel vis-background")
        .item(0);
      if (visPanel) {
        visPanel.innerHTML = dayAxisLegend(serviceCode);
      }
    }
  }, [viewTimeScale]);

  useEffect(() => {
    if (!timelineRef.current?.timeline) return;

    const timeline = timelineRef.current.timeline;

    timeline.setItems(items);
    timeline.setGroups(groups);
  }, [items, groups]);

  useEffect(() => {
    const timeline = timelineRef.current?.timeline;
    if (!timeline) return;

    const setCustomTimeOrAdd = (date: Date, id: string) => {
      try {
        timeline?.setCustomTime(date, id);
      } catch (e) {
        timeline?.addCustomTime(date, id);
      }
    };
    const destroyCustomTime = (id: string) => {
      try {
        timeline?.removeCustomTime(id);
      } catch (e) {
        return e;
      }
    };

    if (viewTimeScaleRef.current === ViewTimeScale.Month) {
      destroyCustomTime(customTimeId.current);
      const monthSelected = moment(kpiSelectedDate.start).format("MMM");
      if (monthSelected === "Feb") {
        setCustomTimeOrAdd(kpiSelectedDate.start, "feb-slider");
        customTimeId.current = "feb-slider";
      } else {
        setCustomTimeOrAdd(kpiSelectedDate.start, "month-slider");
        customTimeId.current = "month-slider";
      }
    }
    if (viewTimeScaleRef.current === ViewTimeScale.Day) {
      destroyCustomTime(customTimeId.current);
      setCustomTimeOrAdd(kpiSelectedDate.start, "day-slider");
      customTimeId.current = "day-slider";
    }

    setCustomTimeOrAdd(kpiSelectedDate.start, "left-border-slider");
    setCustomTimeOrAdd(kpiSelectedDate.end, "right-border-slider");
  }, [kpiSelectedDate]);

  const handlerangechange = (start: Date, end: Date): void => {
    useServiceTimeline.getState().moveTimelineToWindow({ start, end });
  };

  const handleTimelineClicked = (props: {
    what: string;
    item: string;
    time: Date;
  }) => {
    if (props.what === "item") {
      const rotationId = props.item.replace("-", "");
      const serviceCode = useServiceTimeline.getState().serviceCode;
      const rotationRoute = `/services/${serviceCode}/rotations/${rotationId}`;
      router.push(rotationRoute);
      return;
    }
    if (props.what === "axis" || props.what === "background") {
      const viewTimeScale = useServiceTimeline.getState().viewTimeScale;
      if (viewTimeScale === ViewTimeScale.Day) {
        selectDifferentDay(props.time);
      }
      if (viewTimeScale === ViewTimeScale.Month)
        selectDifferentMonth(props.time);
    }
  };
  const selectDifferentDay = (time: Date) => {
    const initialDate = moment(time).startOf("day").toDate();
    const endDate = moment(time).endOf("day").toDate();

    useKpiStore.getState().selectNewDates({ start: initialDate, end: endDate });
    useServiceTimeline
      .getState()
      .selectKpiDate({ start: initialDate, end: endDate });
  };
  const selectDifferentMonth = (time: Date) => {
    const initialDate = moment(time).startOf("month").toDate();
    const endDate = moment(time).endOf("month").toDate();
    useKpiStore.getState().selectNewDates({ start: initialDate, end: endDate });
    useServiceTimeline
      .getState()
      .selectKpiDate({ start: initialDate, end: endDate });
  };

  return (
    <div
      className={`border rounded-md  ${viewMode !== ViewMode.Timeline ? "hidden" : ""}`}
    >
      <Timeline
        initialItems={items}
        initialGroups={groups}
        options={MONTH_TIMELINE_OPTIONS}
        ref={timelineRef}
        clickHandler={handleTimelineClicked}
        rangechangedHandler={({ start, end }: { start: Date; end: Date }) =>
          handlerangechange(start, end)
        }
      />
    </div>
  );
};
