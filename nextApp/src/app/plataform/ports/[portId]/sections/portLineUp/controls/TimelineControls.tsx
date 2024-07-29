import { useMemo } from "react";
import moment from "moment";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ResetIcon from "@/components/icons/reset";
import ToggleGroup from "@/components/ToggleGroup";

import { INITIAL_VISIBLE_WINDOW, ViewMode } from "../domain/interfaces";
import { usePortTimeline } from "../stores/usePortTimeline";
import { TimelineFilters } from "./Filter";

interface IProps {
  showFilters?: boolean;
}

export const TimelineControls = ({ showFilters = true }: IProps) => {
  const visibleWindow = usePortTimeline(state => state.visibleWindow);
  const viewMode = usePortTimeline(state => state.viewMode);

  const handleChangeViewMode = () => {
    const newMode =
      viewMode === ViewMode.Timeline ? ViewMode.Table : ViewMode.Timeline;
    usePortTimeline.getState().changeViewMode(newMode);
  };
  const handleProformaChecked = (checked: boolean) => {
    if (checked) {
      usePortTimeline.getState().enableProforma();
    } else {
      usePortTimeline.getState().disableProforma();
    }
  };
  const handleGoToToday = () => {
    usePortTimeline.getState().moveToInitialWindow();
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
      <div className="flex items-center justify-end w-full ">
        <div className={"mr-4 flex items-center "}>
          <Switch onCheckedChange={handleProformaChecked} />
          <span className="text-sm px-2">{"Proforma"}</span>
        </div>

        <div className={" mr-4"}>
          <TimelineFilters />
        </div>
        {showResetButton ? (
          <div className="flex items-center pr-3 w-[100px]">
            <Button onClick={handleGoToToday} variant="roundedDark">
              <ResetIcon className="mr-1" />
              Now
            </Button>
          </div>
        ) : (
          <div className="w-[100px] bg-pink-500"></div>
        )}

        <ToggleGroup
          defaultValue={ViewMode.Timeline}
          onValueChange={handleChangeViewMode}
          options={Object.values(ViewMode)}
        />
      </div>
    </div>
  );
};

export default TimelineControls;
