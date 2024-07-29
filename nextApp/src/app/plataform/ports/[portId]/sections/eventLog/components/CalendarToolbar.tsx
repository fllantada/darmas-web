import { Calendar as CalendarIcon, Table } from "lucide-react";
import {
  Navigate,
  Views,
  type ToolbarProps,
  type View,
} from "react-big-calendar";

import ChevronRightIcon from "../../../../../../../components/icons/chevronRight";
import ToggleGroupIcons from "../../../../../../../components/ToggleGroupIcons";
import { Button } from "../../../../../../../components/ui/button";
import CreateEventDialog from "./form/eventForm/CreateEventDialog";

export default function CalendarToolbar({
  onNavigate,
  onView,
  label,
  view,
}: ToolbarProps) {
  function onViewChanged(view: string) {
    onView(view as View);
  }

  return (
    <div className="flex mb-4">
      <div className="flex-auto text-left">
        <Button
          className="mr-2"
          variant="secondary"
          onClick={() => onNavigate(Navigate.PREVIOUS)}
        >
          <ChevronRightIcon className="rotate-180" />
        </Button>
        <div className="w-44 text-sm font-medium inline-block text-center">
          {label}
        </div>
        <Button
          className="ml-2"
          variant="secondary"
          onClick={() => onNavigate(Navigate.NEXT)}
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div className="flex-none">
        <Button
          className="mr-2 rounded-full"
          variant="outline"
          onClick={() => onNavigate(Navigate.TODAY)}
        >
          Today
        </Button>
        <CreateEventDialog />
        <ToggleGroupIcons
          className="pt-3 pb-2"
          value={view}
          onValueChange={onViewChanged}
          options={[
            {
              value: Views.MONTH,
              element: <CalendarIcon size={16} />,
            },
            {
              value: Views.AGENDA,
              element: <Table size={16} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
