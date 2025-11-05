import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginationData } from "@/types";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import { DataTableViewOptions } from "@/pages/Admin/customer/data-table-view-option";
import { DataTableAdvancedFilters } from "@/pages/Admin/customer/data-table-advanced-filters";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationData;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  accountType: string;
  isVerified: string;
  isActive: string;
  onAccountTypeChange: (type: string) => void;
  onIsVerifiedChange: (verified: string) => void;
  onIsActiveChange: (active: string) => void;
  onResetFilters: () => void;
  onPageSizeChange: (pageSize: number) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  onCreateUser: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  selectedRole,
  onRoleChange,
  accountType,
  isVerified,
  isActive,
  onAccountTypeChange,
  onIsVerifiedChange,
  onIsActiveChange,
  onResetFilters,
  onPageSizeChange,
  searchQuery,
  onSearchChange,
  onCreateUser,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 py-5">
        {/* Search input with debounce */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo email hoặc tên..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9 focus-visible:ring-1"
          />
        </div>

        <div className="ml-auto flex gap-4">
          <DataTableAdvancedFilters
            selectedRole={selectedRole}
            accountType={accountType}
            isVerified={isVerified}
            isActive={isActive}
            onRoleChange={onRoleChange}
            onAccountTypeChange={onAccountTypeChange}
            onIsVerifiedChange={onIsVerifiedChange}
            onIsActiveChange={onIsActiveChange}
            onReset={onResetFilters}
          />
          <DataTableViewOptions table={table} />
          <Button onClick={onCreateUser} size="sm" className="h-8 gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Thêm người dùng</span>
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-100 text-gray-900 border-b border-gray-200"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 text-sm font-semibold text-center border-gray-200"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-primary/5 transition-colors border-b border-gray-200`}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-700 text-center align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} onPageSizeChange={onPageSizeChange} />
    </div>
  );
}
