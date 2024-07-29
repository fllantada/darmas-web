import { ColumnDef } from "@tanstack/react-table";

import { ColHeader } from "./Header";

export interface TPortTableData {
  vesselName: string;
  voyageNumber: string;
  type: string;
  start: string;
  end: string;
  proformaStart?: string;
  proformaEnd?: string;
}

export const ColumnDefinition: ColumnDef<TPortTableData>[] = [
  {
    accessorKey: "vesselName",
    header: () => <ColHeader title="Vessel Name" />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("vesselName")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: () => <ColHeader title="Vessel Type" />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("type")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "voyageNumber",
    header: () => <ColHeader title="Voyage" />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("voyageNumber")}
      </div>
    ),
    enableHiding: false,
  },

  {
    accessorKey: "start",
    header: () => <ColHeader title="Arrival" />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("start")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "proformaStart",
    header: () => <ColHeader title="Proforma Arrival" />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("type") !== "Others"
          ? row.getValue("proformaStart")
          : "-"}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "end",
    header: () => <ColHeader title="Departure" />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("end")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "proformaEnd",
    header: () => <ColHeader title="Proforma Departure" />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("type") !== "Others" ? row.getValue("proformaEnd") : "-"}
      </div>
    ),
    enableHiding: false,
  },
];
