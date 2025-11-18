import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import {
  fetchBusRoutes,
  fetchApprovedRoutes,
  updateBusRouteStatus,
  deleteBusRoute,
} from "@/redux/thunks/busRouteThunks";
import { useEffect, useState, useMemo } from "react";
import type { BusRoute } from "@/types/busRoute";
import { useDebounce } from "@/hooks/useDebounce";
import BusRouteModal from "./busRoute-modal";
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

export const CompanyBusRoutesPage = () => {
  const { data } = useSelector((state: RootState) => state.busRoutes);
  const dispatch = useDispatch<AppDispatch>();
  const [busRouteData, setBusRouteData] = useState<BusRoute[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggle" | "delete";
    busRouteId?: string;
    currentStatus?: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    type: "toggle",
    title: "",
    description: "",
  });

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch approved routes for modal
  useEffect(() => {
    dispatch(fetchApprovedRoutes({ pageSize: 100 }));
  }, [dispatch]);

  // Fetch bus routes when any filter changes
  useEffect(() => {
    const statusFilter =
      status === "all" ? undefined : status === "active" ? true : false;
    dispatch(
      fetchBusRoutes({
        page: currentPage,
        pageSize,
        status: statusFilter,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, pageSize, status, debouncedSearch]);

  useEffect(() => {
    setBusRouteData(data || []);
  }, [data]);

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

  // Bulk operations handlers (for future use)
  const handleBulkToggleActive = async (isActive: boolean) => {
    console.log("Bulk toggle active:", isActive);
    // TODO: Implement bulk toggle active logic when backend supports it
  };

  const handleExportExcel = async () => {
    console.log("Export to Excel");
    // TODO: Implement export Excel logic
  };

  const handleOpenCreateModal = () => {
    setModalOpen(true);
  };

  const handleToggleActive = (busRouteId: string, currentStatus: boolean) => {
    setConfirmDialog({
      open: true,
      type: "toggle",
      busRouteId,
      currentStatus,
      title: currentStatus ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt",
      description: currentStatus
        ? "Bạn có chắc chắn muốn vô hiệu hóa tuyến xe này? Tuyến xe sẽ không thể sử dụng cho chuyến đi mới."
        : "Bạn có chắc chắn muốn kích hoạt tuyến xe này?",
    });
  };

  const handleDelete = (busRouteId: string) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      busRouteId,
      title: "Xác nhận xóa",
      description:
        "Bạn có chắc chắn muốn xóa tuyến xe này? Hành động này không thể hoàn tác.",
    });
  };

  const handleConfirmAction = async () => {
    if (
      confirmDialog.type === "toggle" &&
      confirmDialog.busRouteId &&
      confirmDialog.currentStatus !== undefined
    ) {
      try {
        await dispatch(
          updateBusRouteStatus({
            id: confirmDialog.busRouteId,
            status: !confirmDialog.currentStatus,
          })
        ).unwrap();

        toast.success(
          !confirmDialog.currentStatus
            ? "Đã kích hoạt tuyến xe"
            : "Đã vô hiệu hóa tuyến xe"
        );
        refetchBusRoutes();
      } catch (error: any) {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    } else if (confirmDialog.type === "delete" && confirmDialog.busRouteId) {
      try {
        await dispatch(deleteBusRoute(confirmDialog.busRouteId)).unwrap();
        toast.success("Đã xóa tuyến xe thành công");
        refetchBusRoutes();
      } catch (error: any) {
        toast.error(error.message || "Có lỗi xảy ra");
      }
    }
    setConfirmDialog({
      open: false,
      type: "toggle",
      title: "",
      description: "",
    });
  };

  const refetchBusRoutes = () => {
    const statusFilter =
      status === "all" ? undefined : status === "active" ? true : false;
    dispatch(
      fetchBusRoutes({
        page: currentPage,
        pageSize,
        status: statusFilter,
        search: debouncedSearch,
      })
    );
  };

  const handleModalSuccess = () => {
    refetchBusRoutes();
  };

  // Create columns with action handlers
  const columns = useMemo(
    () =>
      createColumns({
        onToggleActive: handleToggleActive,
        onDelete: handleDelete,
      }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý tuyến đường</h1>
        <p className="text-muted-foreground mt-1">Quản lý các tuyến đường của nhà xe</p>
      </div>

      <DataTable
        columns={columns}
        data={busRouteData}
        totalRows={data?.length || 0}
        status={status}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateBusRoute={handleOpenCreateModal}
        onBulkToggleActive={handleBulkToggleActive}
        onExportExcel={handleExportExcel}
      />

      <BusRouteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleModalSuccess}
      />

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({
            open: false,
            type: "toggle",
            title: "",
            description: "",
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setConfirmDialog({
                  open: false,
                  type: "toggle",
                  title: "",
                  description: "",
                })
              }
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmDialog.type === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : confirmDialog.currentStatus
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-green-600 hover:bg-green-700"
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
