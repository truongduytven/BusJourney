import type { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserX,
  UserCheck,
  FileSpreadsheet,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  onPageSizeChange?: (pageSize: number) => void
  selectedCount?: number
  totalRows?: number
  onBulkToggleActive?: (isActive: boolean) => void
  onExportExcel?: () => void
}

export function DataTablePagination<TData>({
  table,
  onPageSizeChange,
  selectedCount = 0,
  totalRows = 0,
  onBulkToggleActive,
  onExportExcel,
}: DataTablePaginationProps<TData>) {
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
      description: `Bạn có chắc chắn muốn khóa ${selectedCount} tài khoản đã chọn? Người dùng sẽ không thể đăng nhập vào hệ thống.`,
    });
  };

  const handleConfirmExport = () => {
    setConfirmAction({
      open: true,
      type: 'export',
      title: 'Xác nhận xuất Excel',
      description: `Bạn có muốn xuất ${selectedCount} dòng đã chọn ra file Excel?`,
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
      <div className="flex items-center justify-between px-2 mt-5">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium">{selectedCount} trên {totalRows} dòng đã được chọn</span>
            ) : (
              <span>Tổng số {totalRows} người dùng</span>
            )}
          </div>
          
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
                onClick={() => setConfirmAction({ 
                  open: true, 
                  type: 'unlock', 
                  title: 'Xác nhận mở khóa', 
                  description: `Bạn có chắc chắn muốn mở khóa ${selectedCount} người dùng đã chọn?` 
                })}
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
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Số dòng trên trang</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                const newPageSize = Number(value);
                table.setPageSize(newPageSize);
                // Call the callback to trigger API refetch
                if (onPageSizeChange) {
                  onPageSizeChange(newPageSize);
                }
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
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Trang {table.getState().pagination.pageIndex + 1} trên{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Đi đến trang đầu tiên</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Đi đến trang trước</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Đi đến trang tiếp theo</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Đi đến trang cuối</span>
              <ChevronsRight />
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
  )
}
