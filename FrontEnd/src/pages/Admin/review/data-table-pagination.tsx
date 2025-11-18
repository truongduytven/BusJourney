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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Eye,
  EyeOff,
  FileSpreadsheet
} from "lucide-react";
import type { Review } from "@/types/review";
import { useState } from "react";

interface DataTablePaginationProps {
  table: Table<Review>;
  onPageSizeChange: (value: number) => void;
  selectedCount: number;
  totalRows: number;
  onBulkToggleVisibility: (visible: boolean) => void;
  onExportExcel: () => void;
}

export function DataTablePagination({
  table,
  onPageSizeChange,
  selectedCount,
  totalRows,
  onBulkToggleVisibility,
  onExportExcel,
}: DataTablePaginationProps) {
  const [confirmAction, setConfirmAction] = useState<{
    type: "hide" | "show" | "export";
    open: boolean;
  }>({ type: "hide", open: false });

  const handleConfirmAction = () => {
    if (confirmAction.type === "hide") {
      onBulkToggleVisibility(false);
    } else if (confirmAction.type === "show") {
      onBulkToggleVisibility(true);
    } else if (confirmAction.type === "export") {
      onExportExcel();
    }
    setConfirmAction({ type: "hide", open: false });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          {/* Selected count */}
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium text-primary">
                {selectedCount} trong số {totalRows} đánh giá được chọn
              </span>
            ) : (
              <span>Tổng số {totalRows} đánh giá</span>
            )}
          </div>

          {/* Bulk Actions - Right side of selected text */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-orange-400 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                onClick={() => setConfirmAction({ type: "hide", open: true })}
              >
                <EyeOff className="h-4 w-4" />
                Ẩn
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => setConfirmAction({ type: "show", open: true })}
              >
                <Eye className="h-4 w-4" />
                Hiển thị
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setConfirmAction({ type: "export", open: true })}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 lg:gap-8">
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
            <p className="text-sm font-medium">đánh giá/trang</p>
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

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={confirmAction.open}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction.type === "hide" && "Xác nhận ẩn đánh giá"}
              {confirmAction.type === "show" && "Xác nhận hiển thị đánh giá"}
              {confirmAction.type === "export" && "Xuất dữ liệu Excel"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.type === "hide" &&
                `Bạn có chắc chắn muốn ẩn ${selectedCount} đánh giá đã chọn?`}
              {confirmAction.type === "show" &&
                `Bạn có chắc chắn muốn hiển thị ${selectedCount} đánh giá đã chọn?`}
              {confirmAction.type === "export" &&
                `Bạn có chắc chắn muốn xuất ${selectedCount} đánh giá đã chọn ra file Excel?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmAction.type === "hide"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : confirmAction.type === "show"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
