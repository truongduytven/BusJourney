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
  UserX,
  UserCheck,
  FileSpreadsheet,
} from "lucide-react";
import * as React from "react";
import type { Staff } from "@/types/staff";
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

interface DataTablePaginationProps {
  table: Table<Staff>;
  onPageSizeChange: (value: number) => void;
  selectedCount: number;
  totalRows: number;
  onBulkToggleActive?: (isActive: boolean) => void;
  onExportExcel?: () => void;
}

export function DataTablePagination({
  table,
  onPageSizeChange,
  selectedCount,
  totalRows,
  onBulkToggleActive,
  onExportExcel,
}: DataTablePaginationProps) {
  const [confirmAction, setConfirmAction] = React.useState<{
    open: boolean;
    type: 'lock' | 'unlock' | 'export' | null;
    title: string;
    description: string;
  }>({
    open: false,
    type: null,
    title: '',
    description: '',
  });

  const handleConfirmLock = () => {
    setConfirmAction({
      open: true,
      type: 'lock',
      title: 'Xác nhận khóa tài khoản',
      description: `Bạn có chắc chắn muốn khóa ${selectedCount} nhân viên đã chọn? Họ sẽ không thể đăng nhập vào hệ thống.`,
    });
  };

  const handleConfirmUnlock = () => {
    setConfirmAction({
      open: true,
      type: 'unlock',
      title: 'Xác nhận mở khóa tài khoản',
      description: `Bạn có chắc chắn muốn mở khóa ${selectedCount} nhân viên đã chọn?`,
    });
  };

  const handleConfirmExport = () => {
    setConfirmAction({
      open: true,
      type: 'export',
      title: 'Xác nhận xuất Excel',
      description: `Bạn có muốn xuất ${selectedCount} nhân viên đã chọn ra file Excel?`,
    });
  };

  const handleConfirm = () => {
    if (confirmAction.type === 'lock' && onBulkToggleActive) {
      onBulkToggleActive(false);
    } else if (confirmAction.type === 'unlock' && onBulkToggleActive) {
      onBulkToggleActive(true);
    } else if (confirmAction.type === 'export' && onExportExcel) {
      onExportExcel();
    }
    setConfirmAction({ open: false, type: null, title: '', description: '' });
  };

  const handleCancel = () => {
    setConfirmAction({ open: false, type: null, title: '', description: '' });
  };

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          {/* Selected count */}
          <div className="text-sm text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium text-primary">
                {selectedCount} trong số {totalRows} nhân viên được chọn
              </span>
            ) : (
              <span>Tổng số {totalRows} nhân viên</span>
            )}
          </div>

          {/* Bulk actions */}
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirmLock}
                className="h-8 gap-2 border-red-500 text-red-500 hover:bg-red-50"
              >
                <UserX className="h-4 w-4" />
                Khóa đã chọn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirmUnlock}
                className="h-8 gap-2 border-green-500 text-green-500 hover:bg-green-50"
              >
                <UserCheck className="h-4 w-4" />
                Mở khóa đã chọn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfirmExport}
                className="h-8 gap-2 border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Xuất Excel
              </Button>
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

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmAction.open} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
