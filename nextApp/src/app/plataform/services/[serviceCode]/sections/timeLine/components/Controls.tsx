import { useMemo } from "react";
import moment from "moment";

import ToggleGroup from "@/components/ToggleGroup";

import { ViewMode, ViewTimeScale } from "../domain/interfaces";
import { useServiceTimeline } from "../store/useServiceTimeline";
import { Legends } from "./Legends";

interface IProps {}

export const Controls = ({}: IProps) => {
  const view = useServiceTimeline(state => state.viewMode);
  const visibleWindow = useServiceTimeline(state => state.visibleWindow);

  const showResetButton = useMemo(() => {
    if (!visibleWindow) return false;

    const today = moment(new Date()).startOf("day");

    const isBeforeToday = moment(visibleWindow.end).isBefore(today);
    const isAfterToday = moment(visibleWindow.start).isAfter(today);

    const shouldShowResetButton = isBeforeToday || isAfterToday;

    return shouldShowResetButton;
  }, [visibleWindow]);

  function onViewChangeInternal(newView: ViewMode) {
    useServiceTimeline.getState().changeViewMode(newView);
  }
  const handleTimeScaleChange = (timeScale: ViewTimeScale) => {
    if (timeScale === ViewTimeScale.Day) {
      useServiceTimeline.getState().changeTimeScaleToDay();
    }
    if (timeScale === ViewTimeScale.Month) {
      useServiceTimeline.getState().changeTimeScaleToMonth();
    }
  };
  const handleResetButtonClick = () => {
    useServiceTimeline.getState().moveToToday();
  };

  return (
    <div className="flex justify-between space-x-2 my-3">
      <ToggleGroup
        defaultValue={ViewMode.Timeline}
        onValueChange={value => onViewChangeInternal(value as ViewMode)}
        options={Object.values(ViewMode)}
      />
      {view === ViewMode.Timeline && (
        <>
          <Legends
            showResetButton={showResetButton}
            handleResetButtonClick={handleResetButtonClick}
          />

          <ToggleGroup
            defaultValue={useServiceTimeline.getState().viewTimeScale}
            onValueChange={value =>
              handleTimeScaleChange(value as ViewTimeScale)
            }
            options={Object.values(ViewTimeScale)}
          />
        </>
      )}
    </div>
  );
};
