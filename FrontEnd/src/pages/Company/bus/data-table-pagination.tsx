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
  Trash2,
} from "lucide-react";
import type { Bus } from "@/types/bus";
import { useState } from "react";

interface DataTablePaginationProps {
  table: Table<Bus>;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: number) => void;
  selectedCount: number;
  onBulkDelete?: (ids: string[]) => void;
}

export function DataTablePagination({
  table,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  onPageSizeChange,
  selectedCount,
  onBulkDelete,
}: DataTablePaginationProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const ids = selectedRows.map(row => row.original.id);
    onBulkDelete?.(ids);
    setConfirmDelete(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {selectedCount > 0 ? (
              <span className="font-medium text-primary">
                {selectedCount} trong số {totalItems} xe được chọn
              </span>
            ) : (
              <span>Tổng số {totalItems} xe</span>
            )}
          </div>

          {selectedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Xóa hàng loạt
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Số hàng mỗi trang</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px] border-gray-400 cursor-pointer">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 25, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Trang {currentPage} của {totalPages}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-gray-400 cursor-pointer"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Trang đầu</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-gray-400 cursor-pointer"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Trang trước</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-gray-400 cursor-pointer"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Trang sau</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex border-gray-400 cursor-pointer"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Trang cuối</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hàng loạt</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedCount} xe đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
