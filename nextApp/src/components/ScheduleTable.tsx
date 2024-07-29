"use client";

import { useMemo, useState } from "react";
import { ServiceType, VesselType, VoyageType } from "@/generated/graphql";
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

export enum VoyageState {
  START = "Voyage Commence",
  END = "Voyage End",
}

interface ScheduleTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: ServiceType | VoyageType[] | null;
  sort?: SortingState;
  voyageCode?: string;
  vessel?: VesselType;
}

const getVoyage = (data: VoyageType[], voyageCode: string) => {
  if (Array.isArray(data)) {
    return data.find(voyage => voyage.voyageNo === voyageCode);
  }
  return data;
};

export function ScheduleTable<TData>({
  columns,
  data,
  sort,
  voyageCode,
  vessel,
}: ScheduleTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>(sort || []);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });
  const tableData = useMemo(() => {
    if (!voyageCode) {
      return (data as ServiceType).vessels
        .map(({ operator, vesselCode, voyages }) =>
          voyages
            .map(voyage => {
              const common = {
                serviceCode: (data as ServiceType).serviceCode,
                voyageNo: voyage.voyageNo,
                operator,
                vesselCode,
              };

              return [
                {
                  ...common,
                  state: VoyageState.START,
                  proformaTs: voyage.proformaStartDate
                    ? DateTime.fromISO(voyage.proformaStartDate)
                    : null,
                  actualTs: voyage.startDate
                    ? DateTime.fromISO(voyage.startDate)
                    : null,
                },
                {
                  ...common,
                  state: VoyageState.END,
                  proformaTs: voyage.proformaEndDate
                    ? DateTime.fromISO(voyage.proformaEndDate)
                    : null,
                  actualTs: voyage.endDate
                    ? DateTime.fromISO(voyage.endDate)
                    : null,
                },
              ];
            })
            .flat(),
        )
        .flat() as TData[];
    } else {
      const voyage = getVoyage(data as VoyageType[], voyageCode) as VoyageType;

      return voyage.vesselStates.map(
        vesselState =>
          ({
            voyageCode: voyage.vesselCode + voyageCode,
            operator: vessel?.operator || "NA",
            portCode: vesselState.atPort || vesselState.arrivalPort || "NA",
            block: vesselState.status,
            state: vesselState.subStatus,
            proformaTs: vesselState.proformaTs
              ? DateTime.fromISO(vesselState.proformaTs)
              : null,
            actualTs: vesselState.statusTs
              ? DateTime.fromISO(vesselState.statusTs)
              : null,
          }) as TData,
      );
    }
  }, [data, voyageCode, vessel?.operator]);

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
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
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
