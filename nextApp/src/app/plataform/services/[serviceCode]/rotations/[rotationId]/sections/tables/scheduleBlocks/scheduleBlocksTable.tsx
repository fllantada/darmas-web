"use client";

import { useRotationStore } from "../../../store/rotationStore";
import ScheduleTable from "./Table";
import { tableColumns } from "./tableConfig";

interface IProps {}

export function BlocksTable({}: IProps) {
  const blocks = useRotationStore(state => state.actualVoyageBlocks);

  if (!blocks || blocks.length === 0) return null;

  return <ScheduleTable columns={tableColumns} blocks={blocks} />;
}
