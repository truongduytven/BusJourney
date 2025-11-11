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
  CheckCircle,
  XCircle,
  FileSpreadsheet
} from "lucide-react";
import type { Route } from "@/types/route";
import { useState } from "react";

interface DataTablePaginationProps {
  table: Table<Route>;
  onPageSizeChange: (value: number) => void;
  selectedCount: number;
  totalRows: number;
  onBulkApprove?: (ids: string[]) => void;
  onBulkReject?: (ids: string[]) => void;
  onExportExcel?: (selectedRows: Route[]) => void;
  isAdmin?: boolean;
}

export function DataTablePagination({
  table,
  onPageSizeChange,
  selectedCount,
  totalRows,
  onBulkApprove,
  onBulkReject,
  onExportExcel,
  isAdmin = false,
}: DataTablePaginationProps) {
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject" | "export";
    open: boolean;
  }>({ type: "approve", open: false });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedRoutes = selectedRows.map(row => row.original);
  const selectedIds = selectedRoutes.map(route => route.id);

  const handleConfirmAction = () => {
    if (confirmAction.type === "approve" && onBulkApprove) {
      onBulkApprove(selectedIds);
      table.resetRowSelection();
    } else if (confirmAction.type === "reject" && onBulkReject) {
      onBulkReject(selectedIds);
      table.resetRowSelection();
    } else if (confirmAction.type === "export" && onExportExcel) {
      onExportExcel(selectedRoutes);
      table.resetRowSelection();
    }
    setConfirmAction({ type: "approve", open: false });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          {/* Selected count */}
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium text-primary">
                {selectedCount} trong số {totalRows} tuyến đường được chọn
              </span>
            ) : (
              <span>Tổng số {totalRows} tuyến đường</span>
            )}
          </div>

          {/* Bulk Actions - Right side of selected text */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              {isAdmin && onBulkApprove && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-green-400 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => setConfirmAction({ type: "approve", open: true })}
                >
                  <CheckCircle className="h-4 w-4" />
                  Duyệt
                </Button>
              )}
              {isAdmin && onBulkReject && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setConfirmAction({ type: "reject", open: true })}
                >
                  <XCircle className="h-4 w-4" />
                  Từ chối
                </Button>
              )}
              {onExportExcel && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setConfirmAction({ type: "export", open: true })}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Xuất Excel
                </Button>
              )}
            </div>
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

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={confirmAction.open}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction.type === "approve" && "Xác nhận duyệt"}
              {confirmAction.type === "reject" && "Xác nhận từ chối"}
              {confirmAction.type === "export" && "Xác nhận xuất Excel"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.type === "approve" &&
                `Bạn có chắc chắn muốn duyệt ${selectedCount} tuyến đường đã chọn?`}
              {confirmAction.type === "reject" &&
                `Bạn có chắc chắn muốn từ chối ${selectedCount} tuyến đường đã chọn?`}
              {confirmAction.type === "export" &&
                `Bạn có muốn xuất ${selectedCount} tuyến đường đã chọn ra file Excel?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmAction.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : confirmAction.type === "reject"
                  ? "bg-red-600 hover:bg-red-700"
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
