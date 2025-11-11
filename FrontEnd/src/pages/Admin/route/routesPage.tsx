import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { fetchRoutes, createRouteAsAdmin, updateRouteStatus, bulkUpdateRouteStatus } from "@/redux/thunks/routeThunks";
import { fetchLocationList } from "@/redux/thunks/locationThunks";
import { useEffect, useState, useMemo } from "react";
import type { Route } from "@/types/route";
import { useDebounce } from "@/hooks/useDebounce";
import RouteModal from "./route-modal";
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
import { toast } from "sonner";
import { exportRoutesToExcel } from "@/utils/exportExcel";

export const AdminRoutesPage = () => {
  const { data } = useSelector((state: RootState) => state.routes);
  const dispatch = useDispatch<AppDispatch>();
  const [routeData, setRouteData] = useState<Route[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalRows, setTotalRows] = useState(0);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
  // Confirm dialog state for single actions
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "approve" | "reject";
    routeId?: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: "approve",
    title: '',
    description: '',
  });
  
  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch locations for modal
  useEffect(() => {
    dispatch(fetchLocationList({ pageSize: 100, pageNumber: 1 }));
  }, [dispatch]);

  // Fetch routes when any filter changes
  useEffect(() => {
    dispatch(fetchRoutes({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (data) {
      // Filter by status and search
      let filtered = data;
      
      if (status !== "all") {
        filtered = filtered.filter((route: Route) => route.status === status);
      }
      
      if (debouncedSearch) {
        filtered = filtered.filter((route: Route) => {
          const searchLower = debouncedSearch.toLowerCase();
          return (
            route.startLocation?.name.toLowerCase().includes(searchLower) ||
            route.endLocation?.name.toLowerCase().includes(searchLower)
          );
        });
      }
      
      setRouteData(filtered);
      setTotalRows(filtered.length);
    }
  }, [data, status, debouncedSearch]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatus("all");
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setModalOpen(true);
  };

  const handleApprove = (routeId: string) => {
    setConfirmDialog({
      open: true,
      type: "approve",
      routeId,
      title: 'Xác nhận duyệt tuyến',
      description: 'Bạn có chắc chắn muốn duyệt tuyến đường này?',
    });
  };

  const handleReject = (routeId: string) => {
    setConfirmDialog({
      open: true,
      type: "reject",
      routeId,
      title: 'Xác nhận từ chối',
      description: 'Bạn có chắc chắn muốn từ chối tuyến đường này?',
    });
  };

  const handleConfirmSingleAction = async () => {
    if (confirmDialog.routeId) {
      try {
        const newStatus = confirmDialog.type === "approve" ? "Approved" : "Rejected";
        await dispatch(updateRouteStatus({
          id: confirmDialog.routeId,
          status: newStatus
        })).unwrap();
        
        toast.success(
          confirmDialog.type === "approve" 
            ? "Đã duyệt tuyến đường thành công" 
            : "Đã từ chối tuyến đường"
        );
        
        refetchRoutes();
      } catch (error: any) {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    }
    setConfirmDialog({ open: false, type: "approve", routeId: undefined, title: '', description: '' });
  };

  const handleBulkApprove = async (ids: string[]) => {
    try {
      await dispatch(bulkUpdateRouteStatus({
        ids,
        status: "Approved"
      })).unwrap();
      toast.success(`Đã duyệt ${ids.length} tuyến đường thành công`);
      refetchRoutes();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const handleBulkReject = async (ids: string[]) => {
    try {
      await dispatch(bulkUpdateRouteStatus({
        ids,
        status: "Rejected"
      })).unwrap();
      toast.success(`Đã từ chối ${ids.length} tuyến đường`);
      refetchRoutes();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const handleExportExcel = (routes: Route[]) => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      exportRoutesToExcel(routes, `tuyen-duong-${timestamp}.xlsx`);
      toast.success(`Đã xuất ${routes.length} tuyến đường ra Excel`);
    } catch (error) {
      toast.error('Có lỗi khi xuất Excel');
    }
  };

  const refetchRoutes = () => {
    dispatch(fetchRoutes({ page: currentPage, pageSize }));
  };

  const handleModalSuccess = () => {
    refetchRoutes();
  };

  const handleCreateRoute = async (data: any) => {
    await dispatch(createRouteAsAdmin(data)).unwrap();
  };

  // Create columns with actions
  const columns = useMemo(
    () => createColumns({
      onApprove: handleApprove,
      onReject: handleReject,
      isAdmin: true,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý tuyến đường
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Quản lý và duyệt các tuyến đường trong hệ thống
        </p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={routeData} 
        totalRows={totalRows}
        status={status}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateRoute={handleOpenCreateModal}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        onExportExcel={handleExportExcel}
        isAdmin={true}
      />
      
      <RouteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        onSuccess={handleModalSuccess}
        onSubmit={handleCreateRoute}
        isAdmin={true}
      />
      
      {/* Single Action Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSingleAction}
              className={
                confirmDialog.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
