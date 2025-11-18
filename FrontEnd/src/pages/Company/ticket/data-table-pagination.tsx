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
  LockKeyhole,
  UnlockKeyhole,
  FileSpreadsheet
} from "lucide-react";
import type { Ticket } from "@/types/ticket";
import { useState } from "react";

interface DataTablePaginationProps {
  table: Table<Ticket>;
  onPageSizeChange: (value: number) => void;
  selectedCount: number;
  totalRows: number;
  onBulkToggleStatus: (status: "cancelled" | "confirmed") => void;
  onExportExcel: () => void;
}

export function DataTablePagination({
  table,
  onPageSizeChange,
  selectedCount,
  totalRows,
  onBulkToggleStatus,
  onExportExcel,
}: DataTablePaginationProps) {
  const [confirmAction, setConfirmAction] = useState<{
    type: "cancel" | "confirm" | "export";
    open: boolean;
  }>({ type: "cancel", open: false });

  const handleConfirmAction = () => {
    if (confirmAction.type === "cancel") {
      onBulkToggleStatus("cancelled");
    } else if (confirmAction.type === "confirm") {
      onBulkToggleStatus("confirmed");
    } else if (confirmAction.type === "export") {
      onExportExcel();
    }
    setConfirmAction({ type: "cancel", open: false });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          {/* Selected count */}
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium text-primary">
                {selectedCount} trong số {totalRows} vé được chọn
              </span>
            ) : (
              <span>Tổng số {totalRows} vé</span>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setConfirmAction({ type: "cancel", open: true })}
              >
                <LockKeyhole className="h-4 w-4" />
                Hủy vé
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2 border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => setConfirmAction({ type: "confirm", open: true })}
              >
                <UnlockKeyhole className="h-4 w-4" />
                Xác nhận
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
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Hiển thị</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
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
            <p className="text-sm font-medium">vé/trang</p>
          </div>

          {/* Pagination info */}
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Trang đầu</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Trang trước</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Trang sau</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
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
              {confirmAction.type === "cancel" && "Xác nhận hủy vé"}
              {confirmAction.type === "confirm" && "Xác nhận vé"}
              {confirmAction.type === "export" && "Xuất dữ liệu Excel"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.type === "cancel" &&
                `Bạn có chắc chắn muốn hủy ${selectedCount} vé đã chọn?`}
              {confirmAction.type === "confirm" &&
                `Bạn có chắc chắn muốn xác nhận ${selectedCount} vé đã chọn?`}
              {confirmAction.type === "export" &&
                `Bạn có chắc chắn muốn xuất ${selectedCount} vé đã chọn ra file Excel?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
