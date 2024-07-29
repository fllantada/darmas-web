"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DateTime } from "luxon";

import { VoyageState } from "@/components/ScheduleTable";

export type ServiceScheduleTableRow = {
  serviceCode: string;
  voyageNo: string;
  vesselCode: string;
  operator: string;
  state: VoyageState;
  proformaTs: DateTime;
  actualTs: DateTime;
};

const ColHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
    </div>
  );
};

export const tableColumns: ColumnDef<ServiceScheduleTableRow>[] = [
  {
    accessorKey: "vesselCode",
    header: () => <ColHeader title="Vessel Code" />,
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("vesselCode")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "voyageCode",
    header: () => <ColHeader title="Voyage" />,
    cell: ({ row }) => (
      <div className="w-[80px]">
        <Link
          href={`/services/${row.original.serviceCode}/rotations/${row.original.vesselCode}${row.original.voyageNo}`}
        >
          {row.original.vesselCode + row.original.voyageNo}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "operator",
    header: () => <ColHeader title="Operator" />,
    cell: ({ row }) => (
      <div className="w-[80px]">{`${row.original.operator}`}</div>
    ),
  },
  {
    accessorKey: "State",
    header: () => <ColHeader title="State" />,
    cell: ({ row }) => <div>{`${row.original.state}`}</div>,
  },
  {
    accessorKey: "proformaTimestamp",
    header: () => <ColHeader title="Proforma Timestamp" />,
    cell: ({ row }) => (
      <div>{`${row.original.proformaTs?.toFormat("dd/LL/yyyy HH:mm") || "NA"}`}</div>
    ),
  },
  {
    accessorKey: "actualTimestamp",
    header: () => <ColHeader title="Actual Timestamp" />,
    cell: ({ row }) => (
      <div>{`${row.original.actualTs?.toFormat("dd/LL/yyyy HH:mm") || "NA"}`}</div>
    ),
  },
];

export default tableColumns;
