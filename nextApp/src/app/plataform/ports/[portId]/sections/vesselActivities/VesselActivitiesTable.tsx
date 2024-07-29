import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortDirection,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpZA, Filter } from "lucide-react";
import { DateTime } from "luxon";

import {
  ComboMultiSelect,
  type Option,
} from "@/components/ui/combo-multi-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingContainer } from "@/components/LoadingContainer";
import { CalculationType } from "@/app/plataform/globalDomain/calculationTypes";
import { LoadingState } from "@/app/plataform/lib/types";
import { cn } from "@/app/plataform/lib/utils";

import {
  PortEvents,
  PortSnapshot,
  ValidPortEvent,
  VesselInformation,
  VesselType,
} from "./interfaces";
import VesselColumn from "./VesselColumn";

const columnHelper = createColumnHelper<PortEvents>();

const columns = [
  columnHelper.accessor("vessel", {
    header: "Vessel",
    cell: info => <VesselColumn vessel={info.getValue()} />,
    filterFn: (row, _, filterValue) =>
      filterValue.length == 0 ||
      filterValue.indexOf((row.getValue("vessel") as VesselInformation).type) >=
        0,
  }),

  columnHelper.accessor("operator", {
    cell: info => (
      <span className="text-sm font-medium">{info.getValue()}</span>
    ),
    header: "Operator",
  }),

  columnHelper.accessor("event", {
    cell: info => (
      <span className="text-sm font-medium">{info.getValue()}</span>
    ),
    header: "Status",
    filterFn: (row, _, filterValue) =>
      filterValue.length == 0 ||
      filterValue.indexOf(row.getValue("event")) >= 0,
  }),
  columnHelper.accessor("arrivalTime", {
    cell: info => {
      const isFuture =
        info.row.original.arrivalTimeCalType === CalculationType.FORECAST;

      return (
        <span
          className={`text-sm font-normal ${isFuture ? "text-blue-500" : ""}`}
        >
          {DateTime.fromJSDate(info.getValue()).toLocaleString(
            DateTime.DATE_SHORT,
          )}
          <br />
          {DateTime.fromJSDate(info.getValue()).toLocaleString(
            DateTime.TIME_WITH_SHORT_OFFSET,
          )}
        </span>
      );
    },
    header: "Arrival",
  }),
  columnHelper.accessor("berthTime", {
    cell: info => {
      const value = info.getValue();
      const isFuture =
        info.row.original.berthTimeCalType === CalculationType.FORECAST;
      if (value === null) {
        return <span className="text-sm font-normal">{"-"}</span>;
      }

      return (
        <span
          className={`text-sm font-normal ${isFuture ? "text-blue-500" : ""}`}
        >
          {DateTime.fromJSDate(value).toLocaleString(DateTime.DATE_SHORT)}

          <br />
          {DateTime.fromJSDate(value).toLocaleString(
            DateTime.TIME_WITH_SHORT_OFFSET,
          )}
        </span>
      );
    },

    header: "Berth",
  }),
  columnHelper.accessor("waitTime", {
    cell: info => {
      const isFuture =
        info.row.original.departureTimeCalType === CalculationType.FORECAST;
      return (
        <span
          className={`text-sm font-medium ${isFuture ? "text-blue-500" : ""}`}
        >{`${info.getValue()}hs`}</span>
      );
    },
    header: "Wait",
  }),
  columnHelper.accessor("departureTime", {
    cell: info => {
      const value = info.getValue();
      const isFuture =
        info.row.original.departureTimeCalType === CalculationType.FORECAST;
      if (value === null) {
        return <span className="text-sm font-normal">{"-"}</span>;
      }

      return (
        <div className={`${isFuture ? "text-blue-500" : ""}`}>
          {DateTime.fromJSDate(value).toLocaleString(DateTime.DATE_SHORT)}
          <br />
          {DateTime.fromJSDate(value).toLocaleString(
            DateTime.TIME_WITH_SHORT_OFFSET,
          )}
        </div>
      );
    },
    header: "Departure",
  }),

  columnHelper.accessor("terminal", {
    cell: info => (
      <span className="text-sm font-medium">{info.getValue()}</span>
    ),
    header: "Terminal",
  }),
  columnHelper.accessor("berthName", {
    cell: info => (
      <span className="text-sm font-medium">{info.getValue()}</span>
    ),
    header: "Berth Name",
  }),
];

interface IProps {
  portActivities: PortSnapshot | undefined;
}

export default function VesselActivitiesTable({ portActivities }: IProps) {
  const [data, setData] = useState<PortEvents[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [vesselTypeFilter, setVesselTypeFilter] = useState<Option[]>([
    {
      label: "Operated",
      key: VesselType.OPERATED,
      selected: false,
    },
    {
      label: "Partner",
      key: VesselType.PARTNER,
      selected: false,
    },
    {
      label: "Others",
      key: VesselType.OTHERS,
      selected: false,
    },
  ]);
  const [vesselStatusFilter, setVesselStatusFilter] = useState<Option[]>([
    {
      label: "Arriving",
      key: ValidPortEvent.ARRIVING,
      selected: false,
    },
    {
      label: "Waiting",
      key: ValidPortEvent.WAITING,
      selected: false,
    },
    {
      label: "At Berth",
      key: ValidPortEvent.AT_BERTH,
      selected: false,
    },
    {
      label: "Departed",
      key: ValidPortEvent.DEPARTED,
      selected: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  function filterToggle(options: Option[], key: string) {
    const option = options.find(o => o.key === key);
    if (option !== undefined) {
      option.selected = !option.selected;
    }
  }

  useEffect(() => {
    setData(portActivities?.portEvents ?? []);
  }, [portActivities]);

  return (
    <LoadingContainer
      state={LoadingState.SUCCESS}
      className="min-h-[300px] overflow-auto"
      errorMessage="Error loading vessel activities"
    >
      <div className="p-2 text-right">
        <ComboMultiSelect
          icon={<Filter size={15} className="mr-2" />}
          popoverClassName="vessel-activities-popover"
          title="Vessel Type"
          options={vesselTypeFilter}
          onChange={options => {
            filterToggle(vesselTypeFilter, options.key);
            setVesselTypeFilter([...vesselTypeFilter]);
            table
              .getColumn("vessel")
              ?.setFilterValue(
                vesselTypeFilter
                  .filter(status => status.selected)
                  .map(status => status.key),
              );
          }}
          onReset={() => {
            setVesselTypeFilter(
              vesselTypeFilter.map(o => ({ ...o, selected: false })),
            );
            table.getColumn("vessel")?.setFilterValue([]);
          }}
        />
        <ComboMultiSelect
          icon={<Filter size={15} className="mr-2" />}
          popoverClassName="vessel-activities-popover"
          title="Status"
          options={vesselStatusFilter}
          onChange={options => {
            filterToggle(vesselStatusFilter, options.key);
            setVesselStatusFilter([...vesselStatusFilter]);
            table
              .getColumn("event")
              ?.setFilterValue(
                vesselStatusFilter
                  .filter(status => status.selected)
                  .map(status => status.key),
              );
          }}
          onReset={() => {
            setVesselStatusFilter(
              vesselStatusFilter.map(o => ({ ...o, selected: false })),
            );
            table.getColumn("status")?.setFilterValue([]);
          }}
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn({
                      "cursor-pointer": header.column.getCanSort(),
                    })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {{
                      asc: (
                        <ArrowDownAZ className="inline-block ml-2" size={17} />
                      ),
                      desc: (
                        <ArrowUpZA className="inline-block ml-2" size={17} />
                      ),
                    }[header.column.getIsSorted() as SortDirection] ?? null}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </LoadingContainer>
  );
}
