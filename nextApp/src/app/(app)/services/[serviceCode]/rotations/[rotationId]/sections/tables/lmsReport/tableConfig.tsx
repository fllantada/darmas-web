import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DateTime } from "luxon";

export type LMSTableRow = {
  portCode: string;
  changeStatus: string;
  etaDate: DateTime;
  etbDate: DateTime;
  etdDate: DateTime;
  proformaEtaDate: DateTime;
  proformaEtbDate: DateTime;
  proformaEtdDate: DateTime;
};

const ColHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
    </div>
  );
};

export const tableColumns: ColumnDef<LMSTableRow>[] = [
  {
    accessorKey: "portCode",
    header: () => <ColHeader title="Port" />,
    cell: ({ row }) => <div>{row.original.portCode}</div>,
  },

  {
    accessorKey: "changeStatus",
    header: () => <ColHeader title="Schedule Change Status" />,
    cell: ({ row }) => (
      <div className=" capitalize">{row.original.changeStatus}</div>
    ),
  },

  {
    accessorKey: "etaDate",
    header: () => <ColHeader title="ETA/ATA" />,
    cell: ({ row }) => (
      <div>{row.original.etaDate?.toFormat("dd/LL/yyyy HH:mm") || "NA"}</div>
    ),
  },
  {
    accessorKey: "etbDate",
    header: () => <ColHeader title="ETB/ATB" />,
    cell: ({ row }) => (
      <div>{row.original.etbDate?.toFormat("dd/LL/yyyy HH:mm") || "NA"}</div>
    ),
  },
  {
    accessorKey: "etdDate",
    header: () => <ColHeader title="ETD/ATD" />,
    cell: ({ row }) => (
      <div>{row.original.etdDate?.toFormat("dd/LL/yyyy HH:mm") || "NA"}</div>
    ),
  },
  {
    accessorKey: "proformaEtaDate",
    header: () => <ColHeader title="Proforma ETA" />,
    cell: ({ row }) => (
      <div>
        {row.original.proformaEtaDate?.toFormat("dd/LL/yyyy HH:mm") || "NA"}
      </div>
    ),
  },
  {
    accessorKey: "proformaEtbDate",
    header: () => <ColHeader title="Proforma ETB" />,
    cell: ({ row }) => (
      <div>
        {row.original.proformaEtbDate?.toFormat("dd/LL/yyyy HH:mm") || "NA"}
      </div>
    ),
  },
  {
    accessorKey: "proformaEtdDate",
    header: () => <ColHeader title="Proforma ETD" />,
    cell: ({ row }) => (
      <div>
        {row.original.proformaEtdDate?.toFormat("dd/LL/yyyy HH:mm") || "NA"}
      </div>
    ),
  },
];

export const sort: SortingState = [
  {
    id: "etaDate",
    desc: false,
  },
];
