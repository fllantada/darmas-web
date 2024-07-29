import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { DateTime } from "luxon";
import { CalendarProps, Navigate } from "react-big-calendar";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EventType, eventTypesLabels, type Event } from "../interfaces";
import { getScoreColor, iconMap } from "../utils";

AgendaView.title = (date: Date) => {
  return `${DateTime.fromJSDate(date).toFormat("MMMM yyyy")}`;
};

AgendaView.range = (date: Date) => [
  new Date(date.getFullYear(), date.getMonth(), 1),
  new Date(date.getFullYear(), date.getMonth() + 1, 0),
];

AgendaView.navigate = (
  date: Date,
  action: string,
  { localizer }: CalendarProps,
) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "month");

    case Navigate.NEXT:
      return localizer.add(date, 1, "month");

    default:
      return date;
  }
};

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "type",
    header: "Event Type",
    cell: ({ row }) => {
      const type: EventType = row.getValue("type");
      const Icon = iconMap[type];

      return (
        <>
          <Icon className="inline-block mr-2" /> {eventTypesLabels[type]}
        </>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Event Name",
    cell: ({ row }) => row.getValue("title"),
  },
  {
    accessorKey: "start",
    header: "Start",
    cell: ({ row }) =>
      DateTime.fromJSDate(row.getValue("start")).toLocaleString(
        DateTime.DATETIME_MED,
      ),
  },
  {
    accessorKey: "end",
    header: "End",
    cell: ({ row }) =>
      DateTime.fromJSDate(row.getValue("end")).toLocaleString(
        DateTime.DATETIME_MED,
      ),
  },
  {
    accessorKey: "riskScore",
    header: "Risk Score",
    cell: ({ row }) => {
      const riskScore: number = row.getValue("riskScore");

      return (
        <span
          className="text-base font-medium px-2 py-1 rounded text-white"
          style={{
            backgroundColor: getScoreColor(riskScore),
          }}
        >
          {riskScore}
        </span>
      );
    },
  },
  {
    accessorKey: "id",
  },
];

export default function AgendaView({
  events,
  date,
  localizer,
  onSelectEvent,
}: CalendarProps<Event>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 30,
  });

  const visibleEvents = useMemo(() => {
    const range = date ? AgendaView.range(date as Date) : undefined;
    if (range && events) {
      return (
        (
          events.filter(event =>
            // @ts-expect-error: bad types definition for react-big-calendar
            localizer.inEventRange({
              event,
              range: {
                start: range[0],
                end: range[1],
              },
            }),
          ) || []
        )
          // @ts-expect-error: bad types definition for react-big-calendar
          .sort((a, b) => localizer.sortEvents({ evtA: a, evtB: b }))
          .map(event => ({
            ...event,
            riskScore: event.impactScore * event.likelihoodScore,
          }))
      );
    }
    return [];
  }, [date, localizer, events]);

  const table = useReactTable({
    data: visibleEvents,
    columns,
    state: {
      pagination,
      columnVisibility: {
        id: false,
      },
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-y-auto absolute bottom-0 top-0 right-5 left-5 mt-[70px] mb-5">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={e => {
                  if (onSelectEvent) {
                    const event = events?.find(
                      event => event.id == row.getValue("id"),
                    );
                    if (event) {
                      onSelectEvent(event, e);
                    }
                  }
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No Events.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            />
          </PaginationItem>
          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={pagination.pageIndex === i}
                href="#"
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
