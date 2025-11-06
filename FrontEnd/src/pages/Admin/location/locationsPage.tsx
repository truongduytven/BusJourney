import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { fetchLocationList, updateLocation } from "@/redux/thunks/locationThunks";
import { fetchCityList } from "@/redux/thunks/cityThunks";
import { useEffect, useState, useMemo } from "react";
import type { Location } from "@/types/location";
import type { City } from "@/types/city";
import { useDebounce } from "@/hooks/useDebounce";
import LocationModal from "./location-modal";
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

export const LocationsPage = () => {
  const { locationList } = useSelector((state: RootState) => state.locations);
  const { cityList } = useSelector((state: RootState) => state.cities);
  const dispatch = useDispatch<AppDispatch>();
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [cityData, setCityData] = useState<City[]>([]);
  const [isActive, setIsActive] = useState<string>("all");
  const [cityId, setCityId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>();
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggle";
    locationId?: string;
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

  // Fetch cities for filter
  useEffect(() => {
    dispatch(fetchCityList({ pageSize: 100, pageNumber: 1 }));
  }, [dispatch]);

  useEffect(() => {
    setCityData(cityList?.cities || []);
  }, [cityList]);

  // Fetch locations when any filter changes
  useEffect(() => {
    const active = isActive === "all" ? undefined : isActive === "true";
    const selectedCityId = cityId === "all" ? undefined : cityId;

    dispatch(fetchLocationList({ 
      isActive: active,
      cityId: selectedCityId,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  }, [dispatch, isActive, cityId, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setLocationData(locationList?.locations || []);
  }, [locationList]);

  const handleIsActiveChange = (active: string) => {
    setIsActive(active);
    setCurrentPage(1);
  };

  const handleCityChange = (city: string) => {
    setCityId(city);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setIsActive("all");
    setCityId("all");
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
    console.log("Bulk toggle active:", isActive);
    // TODO: Implement bulk toggle active logic when backend supports it
  };

  const handleExportExcel = async () => {
    console.log("Export to Excel");
    // TODO: Implement export Excel logic
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setSelectedLocationId(undefined);
    setModalOpen(true);
  };

  const handleEditLocation = (locationId: string) => {
    setModalMode("edit");
    setSelectedLocationId(locationId);
    setModalOpen(true);
  };

  const handleToggleActive = (locationId: string, currentIsActive: boolean) => {
    setConfirmDialog({
      open: true,
      type: "toggle",
      locationId,
      currentStatus: currentIsActive,
      title: currentIsActive ? 'Xác nhận vô hiệu hóa' : 'Xác nhận kích hoạt',
      description: currentIsActive 
        ? 'Bạn có chắc chắn muốn vô hiệu hóa địa điểm này?'
        : 'Bạn có chắc chắn muốn kích hoạt địa điểm này?',
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "toggle" && confirmDialog.locationId && confirmDialog.currentStatus !== undefined) {
      try {
        await dispatch(updateLocation({
          id: confirmDialog.locationId,
          data: { isActive: !confirmDialog.currentStatus }
        })).unwrap();
        refetchLocations();
      } catch (error) {
        console.error("Failed to toggle location status:", error);
      }
    }
    setConfirmDialog({ open: false, type: "toggle", title: '', description: '' });
  };

  const refetchLocations = () => {
    const active = isActive === "all" ? undefined : isActive === "true";
    const selectedCityId = cityId === "all" ? undefined : cityId;

    dispatch(fetchLocationList({ 
      isActive: active,
      cityId: selectedCityId,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  };

  const handleModalSuccess = () => {
    refetchLocations();
  };

  // Create columns with action handlers
  const columns = useMemo(
    () => createColumns({
      onEdit: handleEditLocation,
      onToggleActive: handleToggleActive,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý danh sách địa điểm
        </h1>
      </div>
      
      <DataTable 
        columns={columns} 
        data={locationData} 
        totalRows={locationList?.totalLocations || 0}
        isActive={isActive}
        cityId={cityId}
        cities={cityData}
        onIsActiveChange={handleIsActiveChange}
        onCityChange={handleCityChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateLocation={handleOpenCreateModal}
        onBulkToggleActive={handleBulkToggleActive}
        onExportExcel={handleExportExcel}
      />
      
      <LocationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        locationId={selectedLocationId}
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
