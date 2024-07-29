import { ColumnDef } from "@tanstack/react-table";
import { DateTime } from "luxon";

export type BlocksTableRow = {
  portCode: string;
  block: string;
  start: DateTime;
  end: DateTime;
};

const ColHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
    </div>
  );
};

export const tableColumns: ColumnDef<BlocksTableRow>[] = [
  {
    accessorKey: "portCode",
    header: () => <ColHeader title="Port" />,
    cell: ({ row }) => <div>{row.original.portCode}</div>,
  },

  {
    accessorKey: "block",
    header: () => <ColHeader title="Block" />,
    cell: ({ row }) => {
      const isWaiting =
        row.original.block.split(" ")[0].toLowerCase() === "waiting";
      return (
        <div className=" capitalize">
          {isWaiting ? "Waiting" : row.original.block}
        </div>
      );
    },
  },

  {
    accessorKey: "start",
    header: () => <ColHeader title="Start" />,
    cell: ({ row }) => (
      <div>{row.original.start?.toFormat("dd/LL/yyyy HH:mm") || "NA"}</div>
    ),
  },
  {
    accessorKey: "end",
    header: () => <ColHeader title="End" />,
    cell: ({ row }) => (
      <div>{row.original.end?.toFormat("dd/LL/yyyy HH:mm") || "NA"}</div>
    ),
  },
];
