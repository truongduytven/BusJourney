import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { fetchUsers } from "@/redux/thunks/userThunks";
import { useEffect, useState } from "react";
import type { PaginationData } from "@/types";
import type { UserDataResponse } from "@/types/user";

export const CustomersPage = () => {
  const { list } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  const [userData, setUserData] = useState<UserDataResponse[]>([]);

  const paginationData: PaginationData = {
    totalPage: list.totalPage,
    currentPage: list.currentPage,
    pageSize: list.pageSize,
    totalUsers: list.totalUsers,
  }

  useEffect(() => {
    dispatch(fetchUsers({ roleName: "customer", pageSize: 10, pageNumber: 1 }));
  }, [dispatch]);

  useEffect(() => {
    setUserData(list.users || []);
  }, [list]);

  return (
    <div className="container mx-auto py-4 flex flex-col">
      <div className="mb-10 text-2xl font-semibold tracking-tight">Danh sách khách hàng</div>
      <DataTable columns={columns} data={userData} pagination={paginationData} />
    </div>
  );
};
