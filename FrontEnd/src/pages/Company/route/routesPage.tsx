import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "../../Admin/route/data-table";
import { createColumns } from "../../Admin/route/columns";
import { fetchRoutes, createRouteAsCompany } from "@/redux/thunks/routeThunks";
import { fetchLocationList } from "@/redux/thunks/locationThunks";
import { useEffect, useState, useMemo } from "react";
import type { Route } from "@/types/route";
import { useDebounce } from "@/hooks/useDebounce";
import RouteModal from "../../Admin/route/route-modal";
import { toast } from "sonner";
import { exportRoutesToExcel } from "@/utils/exportExcel";

export const CompanyRoutesPage = () => {
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

  const refetchRoutes = () => {
    dispatch(fetchRoutes({ page: currentPage, pageSize }));
  };

  const handleModalSuccess = () => {
    refetchRoutes();
  };

  const handleCreateRoute = async (data: any) => {
    await dispatch(createRouteAsCompany(data)).unwrap();
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

  // Create columns (no admin actions for company)
  const columns = useMemo(
    () => createColumns({
      onApprove: () => {},
      onReject: () => {},
      isAdmin: false,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý tuyến đường chung</h1>
        <p className="text-muted-foreground mt-1">Quản lý các tuyến đường chung của hệ thống</p>
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
        onExportExcel={handleExportExcel}
        isAdmin={false}
      />
      
      <RouteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        onSuccess={handleModalSuccess}
        onSubmit={handleCreateRoute}
        isAdmin={false}
      />
    </div>
  );
};
