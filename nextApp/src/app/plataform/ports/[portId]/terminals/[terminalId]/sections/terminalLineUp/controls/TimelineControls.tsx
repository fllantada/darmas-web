import { useMemo } from "react";
import moment from "moment";

import { Button } from "@/components/ui/button";
import ResetIcon from "@/components/icons/reset";
import ToggleGroup from "@/components/ToggleGroup";

import { INITIAL_VISIBLE_WINDOW, ViewMode } from "../domain/interfaces";
import { useTerminalTimeline } from "../stores/useTerminalTimeline";

interface IProps {
  showFilters?: boolean;
}

export const TimelineControls = ({ showFilters = true }: IProps) => {
  const visibleWindow = useTerminalTimeline(state => state.visibleWindow);
  const viewMode = useTerminalTimeline(state => state.viewMode);

  const handleChangeViewMode = () => {
    const newMode =
      viewMode === ViewMode.Timeline ? ViewMode.Table : ViewMode.Timeline;
    useTerminalTimeline.getState().changeViewMode(newMode);
  };
  const handleGoToToday = () => {
    useTerminalTimeline.getState().moveToInitialWindow();
  };
  const showResetButton = useMemo(() => {
    if (!visibleWindow) return false;
    const shouldShowResetButton =
      moment(visibleWindow.start).isBefore(
        moment(INITIAL_VISIBLE_WINDOW.start).subtract(6, "days"),
      ) ||
      moment(visibleWindow.end).isAfter(
        moment(INITIAL_VISIBLE_WINDOW.end).add(3, "days"),
      );
    return shouldShowResetButton;
  }, [visibleWindow]);

  return (
    <div
      className={`flex ${
        showFilters ? "justify-between" : "justify-end"
      } my-2 space-x-2 w-full`}
    >
      {viewMode === ViewMode.Timeline && (
        <div className={`ml-[15px] inline-flex`}>
          <div className="inline-flex items-center justify-center mx-4">
            <div className={`rounded-full w-2 h-2 bg-operatedVessel mx-2`} />
            <span className="text-sm">{"Operated"}</span>
          </div>
          <div className="inline-flex items-center justify-center mx-4">
            <div className={`rounded-full w-2 h-2 bg-partnerVessel mx-2`} />
            <span className="text-sm">{"Partner"}</span>
          </div>
          <div className="inline-flex items-center justify-center mx-4">
            <div className={`rounded-full w-2 h-2 bg-otherVessel mx-2`} />
            <span className="text-sm">{"Others"}</span>
          </div>
          <div className="inline-flex items-center justify-center ml-[80px] ">
            <div
              className={"border-dotted border-2 border-[#2461FF] w-4 h-4 mx-2"}
            ></div>

            <span className="text-sm px-2">{"Forecast"}</span>
          </div>
        </div>
      )}
      {showResetButton && (
        <div className="flex items-center !ml-auto pr-3">
          <Button onClick={handleGoToToday} variant="roundedDark">
            <ResetIcon className="mr-1" />
            Now
          </Button>
        </div>
      )}
      <ToggleGroup
        defaultValue={ViewMode.Timeline}
        onValueChange={handleChangeViewMode}
        options={Object.values(ViewMode)}
      />
    </div>
  );
};

export default TimelineControls;
