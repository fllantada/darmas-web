import { ColumnDef } from "@tanstack/react-table";

import { ProformaItem } from "../interfaces";
import { ColHeader } from "./ColHeader";

export enum ColumnNames {
  VOYAGE_CODE = "Voyage Code",
  VESSEL_NAME = "Vessel Name",
  VESSEL_CLASS = "Vessel Class",
  SCRUBBER = "Scrubber",
  PROFORMA = "Proforma",
}

export const ColumnDefinition: ColumnDef<ProformaItem>[] = [
  {
    accessorKey: "voyageCode",
    header: () => <ColHeader title={ColumnNames.VOYAGE_CODE} />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("voyageCode")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "vesselName",
    header: () => <ColHeader title={ColumnNames.VESSEL_NAME} />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("vesselName")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "vesselClass",
    header: () => <ColHeader title={ColumnNames.VESSEL_CLASS} />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("vesselClass")}
      </div>
    ),
    enableHiding: false,
  },

  {
    accessorKey: "scrubber",
    header: () => <ColHeader title={ColumnNames.SCRUBBER} />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("scrubber")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "proforma",
    header: () => <ColHeader title={ColumnNames.PROFORMA} />,
    cell: ({ row }) => (
      <div className="flex justify-center items-center">
        {row.getValue("proforma")}
      </div>
    ),
    enableHiding: false,
  },
];
