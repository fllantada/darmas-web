import { useState } from "react";

import ToggleGroup from "@/components/ToggleGroup";

import { useRotationStore } from "../../../store/rotationStore";
import { ScheduleView, ViewTimeScale } from "../domain/interfaces";
import Legends from "./Legends";

export const Controls = () => {
  const [view, setView] = useState<ScheduleView>(ScheduleView.Timeline);

  function onViewChangeInternal(newView: ScheduleView) {
    setView(newView);
    useRotationStore.getState().changeView(newView);
  }

  const handleScaleTimeChanged = (newTimeScale: ViewTimeScale) => {
    if (newTimeScale === ViewTimeScale.Day)
      useRotationStore.getState().changeTimeScaleToDay();
    if (newTimeScale === ViewTimeScale.Month)
      useRotationStore.getState().changeTimeScaleToMonth();
  };

  return (
    <div className="flex justify-between space-x-2 my-3">
      <ToggleGroup
        defaultValue={view}
        onValueChange={value => onViewChangeInternal(value as ScheduleView)}
        options={Object.values(ScheduleView)}
      />
      {view === ScheduleView.Timeline && (
        <>
          <div className={`inline-flex  "mx-auto"}`}>
            <Legends />
          </div>

          <ToggleGroup
            defaultValue={useRotationStore.getState().timeScale}
            onValueChange={value =>
              handleScaleTimeChanged(value as ViewTimeScale)
            }
            options={Object.values(ViewTimeScale)}
          />
        </>
      )}
    </div>
  );
};

export default Controls;
