import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { fetchUsers } from "@/redux/thunks/userThunks";
import { useEffect, useState } from "react";
import type { PaginationData } from "@/types";
import type { UserDataResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";

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
  
  // Debounce search query with 2 seconds delay
  const debouncedSearch = useDebounce(searchQuery, 1500);

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
      />
    </div>
  );
};
