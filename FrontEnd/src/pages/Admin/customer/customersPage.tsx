import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { fetchUsers, updateUser, bulkToggleActive } from "@/redux/thunks/userThunks";
import { useEffect, useState, useMemo } from "react";
import type { PaginationData } from "@/types";
import type { UserDataResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";
import { UserModal } from "./user-modal";
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

export const CustomersPage = () => {
  const { list } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const [userData, setUserData] = useState<UserDataResponse[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [accountType, setAccountType] = useState<string>("all");
  const [isVerified, setIsVerified] = useState<string>("all");
  const [isActive, setIsActive] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId?: string;
    currentStatus?: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: '',
    description: '',
  });
  
  // Debounce search query with 2 seconds delay
  const debouncedSearch = useDebounce(searchQuery, 2000);

  const paginationData: PaginationData = {
    totalPage: list.totalPage,
    currentPage: list.currentPage,
    pageSize: list.pageSize,
    totalUsers: list.totalUsers,
  }

  // Fetch users when any filter changes or debounced search changes
  useEffect(() => {
    const roleName = selectedRole === "all" ? undefined : selectedRole;
    const type = accountType === "all" ? undefined : accountType;
    const verified = isVerified === "all" ? undefined : isVerified === "true";
    const active = isActive === "all" ? undefined : isActive === "true";

    dispatch(fetchUsers({ 
      roleName, 
      type,
      isVerified: verified,
      isActive: active,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  }, [dispatch, selectedRole, accountType, isVerified, isActive, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setUserData(list.users || []);
  }, [list]);

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleAccountTypeChange = (type: string) => {
    setAccountType(type);
    setCurrentPage(1);
  };

  const handleIsVerifiedChange = (verified: string) => {
    setIsVerified(verified);
    setCurrentPage(1);
  };

  const handleIsActiveChange = (active: string) => {
    setIsActive(active);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedRole("all");
    setAccountType("all");
    setIsVerified("all");
    setIsActive("all");
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedUserId(undefined);
    setModalOpen(true);
  };

  const handleViewUser = (userId: string) => {
    setModalMode("view");
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleEditUser = (userId: string) => {
    setModalMode("edit");
    setSelectedUserId(userId);
    setModalOpen(true);
  };

  const handleToggleActive = (userId: string, currentIsActive: boolean) => {
    setConfirmDialog({
      open: true,
      userId,
      currentStatus: currentIsActive,
      title: currentIsActive ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản',
      description: currentIsActive 
        ? 'Bạn có chắc chắn muốn khóa tài khoản này? Người dùng sẽ không thể đăng nhập vào hệ thống.'
        : 'Bạn có chắc chắn muốn mở khóa tài khoản này? Người dùng sẽ có thể đăng nhập lại.',
    });
  };

  const handleConfirmToggleActive = async () => {
    setConfirmDialog({ open: false, title: '', description: '' });
    if (confirmDialog.userId && confirmDialog.currentStatus !== undefined) {
      try {
        await dispatch(updateUser({
          id: confirmDialog.userId,
          data: { isActive: !confirmDialog.currentStatus }
        })).unwrap();
        refetchUsers();
      } catch (error) {
        console.error("Failed to toggle user active status:", error);
      }
    }
  };

  const handleBulkToggleActive = async (userIds: string[], isActive: boolean) => {
    try {
      await dispatch(bulkToggleActive({ userIds, isActive })).unwrap();
      refetchUsers();
    } catch (error) {
      console.error("Failed to bulk toggle active:", error);
    }
  };

  const refetchUsers = () => {
    const roleName = selectedRole === "all" ? undefined : selectedRole;
    const type = accountType === "all" ? undefined : accountType;
    const verified = isVerified === "all" ? undefined : isVerified === "true";
    const active = isActive === "all" ? undefined : isActive === "true";

    dispatch(fetchUsers({ 
      roleName, 
      type,
      isVerified: verified,
      isActive: active,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  };

  const handleModalSuccess = () => {
    refetchUsers();
  };

  // Create columns with action handlers
  const columns = useMemo(
    () => createColumns({
      onView: handleViewUser,
      onEdit: handleEditUser,
      onToggleActive: handleToggleActive,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 flex flex-col">
      <div className="mb-10 text-2xl font-semibold tracking-tight">
        Danh sách {selectedRole === "all" ? "người dùng" : selectedRole === "customer" ? "khách hàng" : selectedRole === "admin" ? "quản trị viên" : selectedRole === "driver" ? "tài xế" : "nhân viên"}
      </div>
      <DataTable 
        columns={columns} 
        data={userData} 
        pagination={paginationData}
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        accountType={accountType}
        isVerified={isVerified}
        isActive={isActive}
        onAccountTypeChange={handleAccountTypeChange}
        onIsVerifiedChange={handleIsVerifiedChange}
        onIsActiveChange={handleIsActiveChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateUser={handleOpenCreateModal}
        onBulkToggleActive={handleBulkToggleActive}
      />
      
      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        userId={selectedUserId}
        onSuccess={handleModalSuccess}
      />
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, title: '', description: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialog({ open: false, title: '', description: '' })}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggleActive}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
