import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import type { TripPoint, Trip } from "@/types/companyTripPoint";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableAdvancedFilters } from "./data-table-advanced-filters";

interface DataTableProps {
  columns: ColumnDef<TripPoint>[];
  data: TripPoint[];
  loading: boolean;
  totalRows: number;
  searchQuery: string;
  isActive: string;
  type: string;
  tripId: string;
  trips: Trip[];
  onSearchChange: (search: string) => void;
  onIsActiveChange: (isActive: string) => void;
  onTypeChange: (type: string) => void;
  onTripChange: (tripId: string) => void;
  onPageSizeChange: (pageSize: number) => void;
  onResetFilters: () => void;
  onCreateTripPoint: () => void;
  onBulkToggleActive: (isActive: boolean) => void;
  onExportExcel: () => void;
}

export function DataTable({
  columns,
  data,
  loading,
  totalRows,
  searchQuery,
  isActive,
  type,
  tripId,
  trips,
  onSearchChange,
  onIsActiveChange,
  onTypeChange,
  onTripChange,
  onPageSizeChange,
  onResetFilters,
  onCreateTripPoint,
  onBulkToggleActive,
  onExportExcel,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
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

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 py-5">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên điểm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 focus-visible:ring-1"
          />
        </div>

        <div className="ml-auto flex gap-x-4">
          <DataTableAdvancedFilters
            isActive={isActive}
            type={type}
            tripId={tripId}
            trips={trips}
            onIsActiveChange={onIsActiveChange}
            onTypeChange={onTypeChange}
            onTripChange={onTripChange}
            onReset={onResetFilters}
          />
          <Button onClick={onCreateTripPoint} size="sm" className="h-8 gap-2">
            <Plus className="h-4 w-4" />
            <span>Thêm điểm đón/trả</span>
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

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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

      <div className="py-4">
        <DataTablePagination
          table={table}
          onPageSizeChange={onPageSizeChange}
          selectedCount={selectedCount}
          totalRows={totalRows}
          onBulkToggleActive={onBulkToggleActive}
          onExportExcel={onExportExcel}
        />
      </div>
    </div>
  );
}
