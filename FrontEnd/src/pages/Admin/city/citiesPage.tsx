import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { fetchCityList, updateCity } from "@/redux/thunks/cityThunks";
import { useEffect, useState, useMemo } from "react";
import type { PaginationData } from "@/types";
import type { City } from "@/types/city";
import { useDebounce } from "@/hooks/useDebounce";
import { CityModal } from "./city-modal";
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

export const CitiesPage = () => {
  const { cityList } = useSelector((state: RootState) => state.cities);
  const dispatch = useDispatch<AppDispatch>();
  const [cityData, setCityData] = useState<City[]>([]);
  const [isActive, setIsActive] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>();
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggle";
    cityId?: string;
    currentStatus?: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    type: "toggle",
    title: '',
    description: '',
  });
  
  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  const paginationData: PaginationData = {
    totalPage: cityList.totalPage,
    currentPage: cityList.currentPage,
    pageSize: cityList.pageSize,
    totalUsers: cityList.totalCities,
  };

  // Fetch cities when any filter changes
  useEffect(() => {
    const active = isActive === "all" ? undefined : isActive === "true";

    dispatch(fetchCityList({ 
      isActive: active,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  }, [dispatch, isActive, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setCityData(cityList.cities || []);
  }, [cityList]);

  const handleIsActiveChange = (active: string) => {
    setIsActive(active);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setIsActive("all");
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

  // Bulk operations handlers
  const handleBulkToggleActive = async (isActive: boolean) => {
    // Get selected city IDs from the table
    // This will be called from DataTablePagination
    // For now, we'll need to track selected rows in the parent
    console.log("Bulk toggle active:", isActive);
    // TODO: Implement bulk toggle active logic when backend supports it
  };

  const handleExportExcel = async () => {
    // Export selected cities to Excel
    console.log("Export to Excel");
    // TODO: Implement export Excel logic
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedCityId(undefined);
    setModalOpen(true);
  };

  const handleEditCity = (cityId: string) => {
    setModalMode("edit");
    setSelectedCityId(cityId);
    setModalOpen(true);
  };

  const handleToggleActive = (cityId: string, currentIsActive: boolean) => {
    setConfirmDialog({
      open: true,
      type: "toggle",
      cityId,
      currentStatus: currentIsActive,
      title: currentIsActive ? 'Xác nhận vô hiệu hóa' : 'Xác nhận kích hoạt',
      description: currentIsActive 
        ? 'Bạn có chắc chắn muốn vô hiệu hóa thành phố này?'
        : 'Bạn có chắc chắn muốn kích hoạt thành phố này?',
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "toggle" && confirmDialog.cityId && confirmDialog.currentStatus !== undefined) {
      try {
        await dispatch(updateCity({
          id: confirmDialog.cityId,
          data: { isActive: !confirmDialog.currentStatus }
        })).unwrap();
        refetchCities();
      } catch (error) {
        console.error("Failed to toggle city status:", error);
      }
    }
    setConfirmDialog({ open: false, type: "toggle", title: '', description: '' });
  };

  const refetchCities = () => {
    const active = isActive === "all" ? undefined : isActive === "true";

    dispatch(fetchCityList({ 
      isActive: active,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  };

  const handleModalSuccess = () => {
    refetchCities();
  };

  // Create columns with action handlers
  const columns = useMemo(
    () => createColumns({
      onEdit: handleEditCity,
      onToggleActive: handleToggleActive,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý danh sách thành phố
        </h1>
      </div>
      
      <DataTable 
        columns={columns} 
        data={cityData} 
        totalRows={paginationData.totalUsers}
        isActive={isActive}
        onIsActiveChange={handleIsActiveChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateCity={handleOpenCreateModal}
        onBulkToggleActive={handleBulkToggleActive}
        onExportExcel={handleExportExcel}
      />
      
      <CityModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        cityId={selectedCityId}
        onSuccess={handleModalSuccess}
      />
      
      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => !open && setConfirmDialog({ 
          open: false, 
          type: "toggle", 
          title: '', 
          description: '' 
        })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialog({ 
              open: false, 
              type: "toggle", 
              title: '', 
              description: '' 
            })}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
