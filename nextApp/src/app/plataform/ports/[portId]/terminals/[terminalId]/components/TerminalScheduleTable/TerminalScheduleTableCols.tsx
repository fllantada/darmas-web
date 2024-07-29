"use client";

import { ColumnDef } from "@tanstack/react-table";

const ColHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
    </div>
  );
};

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "vesselId",
    header: () => <ColHeader title="Vessel" />,
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("vesselId")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "vesselId",
    header: () => <ColHeader title="Voyage" />,
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("vesselId")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "operatorId",
    header: () => <ColHeader title="Operator" />,
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("operatorId")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "isActual",
    header: () => <ColHeader title="Proforma / Actual" />,
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.getValue("proformaStartTime") ? "Proforma" : "Actual"}
      </div>
    ),
    enableHiding: false,
  },
];

export default columns;
