"use client";

import { useRotationStore } from "../../../store/rotationStore";
import ScheduleTable from "./Table";
import { sort, tableColumns } from "./tableConfig";

interface IProps {}

export function LMSTable({}: IProps) {
  const vesselVoyage = useRotationStore(state => state.vesselVoyage);

  if (!vesselVoyage) return null;

  return (
    <ScheduleTable columns={tableColumns} sort={sort} voyage={vesselVoyage} />
  );
}
