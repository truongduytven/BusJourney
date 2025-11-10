import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchStaffList,
  createStaff,
  toggleStaffStatus,
  bulkToggleStaffActive,
} from "@/redux/thunks/staffThunks";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { CreateStaffModal } from "./create-staff-modal";
import type { CreateStaffPayload } from "@/types/staff";
import { toast } from "sonner";
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

export function StaffPage() {
  const dispatch = useAppDispatch();
  const { staffList, loading, pagination } = useAppSelector(
    (state) => state.staff
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [staffToToggle, setStaffToToggle] = useState<{
    id: string;
    isActive: boolean;
  } | null>(null);

  // Fetch staff list
  useEffect(() => {
    dispatch(
      fetchStaffList({
        search: searchQuery || undefined,
        isActive: statusFilter === "all" ? undefined : statusFilter === "true",
        pageSize: pagination.pageSize,
        pageNumber: pagination.pageNumber,
      })
    );
  }, [
    dispatch,
    searchQuery,
    statusFilter,
    pagination.pageSize,
    pagination.pageNumber,
  ]);

  // Handlers
  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(
      fetchStaffList({
        search: searchQuery || undefined,
        isActive: statusFilter === "all" ? undefined : statusFilter === "true",
        pageSize,
        pageNumber: 1,
      })
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleCreateStaff = async (data: CreateStaffPayload) => {
    try {
      const result = await dispatch(createStaff(data));
      if (createStaff.fulfilled.match(result)) {
        toast.success("Tạo tài khoản nhân viên thành công!");
        setIsCreateModalOpen(false);
        // Refresh list
        dispatch(
          fetchStaffList({
            search: searchQuery || undefined,
            isActive:
              statusFilter === "all" ? undefined : statusFilter === "true",
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
          })
        );
      } else {
        toast.error(
          (result.payload as string) || "Có lỗi xảy ra khi tạo nhân viên"
        );
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo nhân viên");
    }
  };

  const handleToggleStatus = (staffId: string, currentStatus: boolean) => {
    setStaffToToggle({ id: staffId, isActive: currentStatus });
  };

  const confirmToggleStatus = async () => {
    if (!staffToToggle) return;

    try {
      const result = await dispatch(toggleStaffStatus(staffToToggle.id));

      if (toggleStaffStatus.fulfilled.match(result)) {
        toast.success(
          staffToToggle.isActive
            ? "Đã khóa tài khoản nhân viên"
            : "Đã mở khóa tài khoản nhân viên"
        );
        // Refresh list
        dispatch(
          fetchStaffList({
            search: searchQuery || undefined,
            isActive:
              statusFilter === "all" ? undefined : statusFilter === "true",
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
          })
        );
      } else {
        toast.error((result.payload as string) || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setStaffToToggle(null);
    }
  };

  const handleEdit = (_staffId: string) => {
    toast.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const handleBulkToggleActive = async (
    staffIds: string[],
    isActive: boolean
  ) => {
    try {
      const result = await dispatch(
        bulkToggleStaffActive({ staffIds, isActive })
      );

      if (bulkToggleStaffActive.fulfilled.match(result)) {
        const updatedCount = result.payload.updatedCount;
        toast.success(
          isActive
            ? `Đã mở khóa ${updatedCount} nhân viên thành công`
            : `Đã khóa ${updatedCount} nhân viên thành công`
        );
        // Refresh list
        dispatch(
          fetchStaffList({
            search: searchQuery || undefined,
            isActive:
              statusFilter === "all" ? undefined : statusFilter === "true",
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
          })
        );
      } else {
        toast.error((result.payload as string) || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onToggleStatus: handleToggleStatus,
  });

  return (
    <div className="container mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
        <p className="text-gray-600 mt-1">
          Quản lý danh sách nhân viên trong công ty của bạn
        </p>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={staffList}
        totalRows={pagination.total}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPageSizeChange={handlePageSizeChange}
        onResetFilters={handleResetFilters}
        onCreateStaff={() => setIsCreateModalOpen(true)}
        onBulkToggleActive={handleBulkToggleActive}
      />

      {/* Create Staff Modal */}
      <CreateStaffModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateStaff}
        isLoading={loading}
      />

      {/* Confirm Toggle Status Dialog */}
      <AlertDialog
        open={!!staffToToggle}
        onOpenChange={() => setStaffToToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {staffToToggle?.isActive
                ? "Khóa tài khoản?"
                : "Mở khóa tài khoản?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {staffToToggle?.isActive
                ? "Nhân viên sẽ không thể đăng nhập và sử dụng hệ thống khi bị khóa."
                : "Nhân viên sẽ có thể đăng nhập và sử dụng lại hệ thống."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
