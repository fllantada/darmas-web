"use client";

import { useEffect, useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

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
import DebouncedInput from "@/components/DebouncedInput";

import { useUserStore, type User } from "../../store";
import { columns } from "./columns";

interface UserTableProps {
  users: User[];
}

const fuzzyFilter: FilterFn<User> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function UserTable({ users }: UserTableProps) {
  const { users: storeUsers, initializeStore } = useUserStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });
  useEffect(() => {
    initializeStore(users);
  }, [users, initializeStore]);

  const table = useReactTable({
    data: storeUsers,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      pagination,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="relative">
        <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={value => setGlobalFilter(String(value))}
          className="pl-8 py-2 w-[350px] rounded-lg border"
          placeholder="Search users..."
        />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id} className="text-center">
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
                <TableCell key={cell.id} className="text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
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
    </>
  );
}
