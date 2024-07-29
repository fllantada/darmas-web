"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { DateTime } from "luxon";

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

import { VoyageBlock } from "../../timeline/domain/interfaces";
import { BlocksTableRow } from "./tableConfig";

interface IProps {
  columns: ColumnDef<BlocksTableRow>[];
  blocks: VoyageBlock[];
  sort?: SortingState;
}

export function ScheduleTable({ columns, blocks, sort }: IProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(sort || []);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const tableData = useMemo(() => {
    return blocks.map(block => ({
      portCode: block.atPort,
      block: block.status,
      start: DateTime.fromJSDate(block.startTime),
      end: DateTime.fromJSDate(block.endTime),
    }));
  }, [blocks]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className={"w-1/4"}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className={"w-1/4"}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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

export default ScheduleTable;
