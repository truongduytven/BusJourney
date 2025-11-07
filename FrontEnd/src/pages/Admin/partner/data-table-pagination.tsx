import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { Partner } from "@/types/partner";

interface DataTablePaginationProps {
  table: Table<Partner>;
  onPageSizeChange: (value: number) => void;
  selectedCount: number;
  totalRows: number;
  onBulkMarkProcessed?: () => void;
  onBulkMarkUnprocessed?: () => void;
}

export function DataTablePagination({
  table,
  onPageSizeChange,
  selectedCount,
  totalRows,
  onBulkMarkProcessed,
  onBulkMarkUnprocessed,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-4">
        {/* Selected count */}
        <div className="flex-1 text-sm text-muted-foreground">
          {selectedCount > 0 ? (
            <span className="font-medium text-primary">
              {selectedCount} trong số {totalRows} đăng ký được chọn
            </span>
          ) : (
            <span>Tổng số {totalRows} đăng ký</span>
          )}
        </div>
        
        {/* Bulk action buttons - only show when items are selected */}
        {selectedCount > 0 && (
          <>
            <Button
              onClick={onBulkMarkProcessed}
              size="sm"
              variant="outline"
              className="h-8 gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Đánh dấu đã xử lí
            </Button>
            <Button
              onClick={onBulkMarkUnprocessed}
              size="sm"
              variant="outline"
              className="h-8 gap-2 border-amber-600 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            >
              <XCircle className="h-4 w-4" />
              Đánh dấu chưa xử lí
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Page size selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Số hàng mỗi trang</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border-gray-400 cursor-pointer">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Trang {table.getState().pagination.pageIndex + 1} của{" "}
          {table.getPageCount()}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-gray-400 cursor-pointer"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Trang đầu</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-gray-400 cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Trang trước</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-gray-400 cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Trang sau</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-gray-400 cursor-pointer"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Trang cuối</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
