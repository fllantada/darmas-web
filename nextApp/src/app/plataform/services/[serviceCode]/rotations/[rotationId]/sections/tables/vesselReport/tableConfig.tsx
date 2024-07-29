import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DateTime } from "luxon";

export type VesselReportTableRow = {
  portCode: string;
  state: string;
  actualTs: DateTime;
};

const ColHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
    </div>
  );
};

export const tableColumns: ColumnDef<VesselReportTableRow>[] = [
  {
    accessorKey: "portCode",
    header: () => <ColHeader title="Port" />,
    cell: ({ row }) => <div>{row.original.portCode}</div>,
  },

  {
    accessorKey: "state",
    header: () => <ColHeader title="State" />,
    cell: ({ row }) => (
      <div className=" capitalize">{row.original.state.replace(/_/g, " ")}</div>
    ),
  },

  {
    id: "actualTimestamp",
    accessorKey: "statusTs",
    header: () => <ColHeader title="Actual Timestamp" />,
    cell: ({ row }) => (
      <div>{row.original.actualTs?.toFormat("dd/LL/yyyy HH:mm") || "NA"}</div>
    ),
  },
];

export const sort: SortingState = [
  {
    id: "actualTimestamp",
    desc: false,
  },
];
