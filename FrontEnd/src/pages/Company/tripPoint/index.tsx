import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import {
  fetchCompanyTripPoints,
  updateCompanyTripPoint,
  deleteCompanyTripPoint,
} from "@/redux/thunks/companyTripPointThunks";
import { fetchCompanyTrips } from "@/redux/thunks/companyTripThunks";
import { fetchPointList } from "@/redux/thunks/pointThunks";
import { useEffect, useState, useMemo } from "react";
import type { TripPoint } from "@/types/companyTripPoint";
import { useDebounce } from "@/hooks/useDebounce";
import { TripPointModal } from "./trip-point-modal";
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

export default function TripPointPage() {
  const { tripPoints, loading, pagination } = useSelector((state: RootState) => state.companyTripPoints);
  const { trips } = useSelector((state: RootState) => state.companyTrips);
  const { pointList } = useSelector((state: RootState) => state.points);
  const points = pointList.points || [];
  const dispatch = useDispatch<AppDispatch>();
  
  const [tripPointData, setTripPointData] = useState<TripPoint[]>([]);
  const [isActive, setIsActive] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [tripId, setTripId] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTripPoint, setSelectedTripPoint] = useState<TripPoint | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggle" | "delete";
    tripPointId?: string;
    currentStatus?: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    type: "toggle",
    title: '',
    description: '',
  });
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchCompanyTrips({ page: 1, pageSize: 1000 }));
    dispatch(fetchPointList({ pageNumber: 1, pageSize: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    const active = isActive === "all" ? undefined : isActive === "true";
    const selectedType = type === "all" ? undefined : type;
    const selectedTripId = tripId === "all" ? undefined : tripId;

    dispatch(fetchCompanyTripPoints({
      page: currentPage,
      pageSize,
      search: debouncedSearch || undefined,
      isActive: active,
      type: selectedType,
      tripId: selectedTripId,
    }));
  }, [dispatch, isActive, type, tripId, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setTripPointData(tripPoints || []);
  }, [tripPoints]);

  const handleIsActiveChange = (active: string) => {
    setIsActive(active);
    setCurrentPage(1);
  };

  const handleTypeChange = (pointType: string) => {
    setType(pointType);
    setCurrentPage(1);
  };

  const handleTripChange = (trip: string) => {
    setTripId(trip);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setIsActive("all");
    setType("all");
    setTripId("all");
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

  const handleBulkToggleActive = async (isActive: boolean) => {
    console.log("Bulk toggle active:", isActive);
  };

  const handleExportExcel = async () => {
    console.log("Export to Excel");
  };

  const handleOpenCreateModal = () => {
    setSelectedTripPoint(null);
    setModalOpen(true);
  };

  const handleEditTripPoint = (tripPoint: TripPoint) => {
    setSelectedTripPoint(tripPoint);
    setModalOpen(true);
  };

  const handleToggleActive = (tripPoint: TripPoint) => {
    setConfirmDialog({
      open: true,
      type: "toggle",
      tripPointId: tripPoint.id,
      currentStatus: tripPoint.isActive,
      title: tripPoint.isActive ? 'Xác nhận tạm dừng' : 'Xác nhận kích hoạt',
      description: tripPoint.isActive 
        ? 'Bạn có chắc chắn muốn tạm dừng điểm đón/trả này?'
        : 'Bạn có chắc chắn muốn kích hoạt điểm đón/trả này?',
    });
  };

  const handleDeleteTripPoint = (tripPoint: TripPoint) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      tripPointId: tripPoint.id,
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa điểm đón/trả này? Hành động này không thể hoàn tác.',
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "toggle" && confirmDialog.tripPointId && confirmDialog.currentStatus !== undefined) {
      try {
        await dispatch(updateCompanyTripPoint({
          id: confirmDialog.tripPointId,
          data: { isActive: !confirmDialog.currentStatus }
        })).unwrap();
        refetchTripPoints();
      } catch (error) {
        console.error("Failed to toggle trip point status:", error);
      }
    } else if (confirmDialog.type === "delete" && confirmDialog.tripPointId) {
      try {
        await dispatch(deleteCompanyTripPoint(confirmDialog.tripPointId)).unwrap();
        refetchTripPoints();
      } catch (error) {
        console.error("Failed to delete trip point:", error);
      }
    }
    setConfirmDialog({ open: false, type: "toggle", title: '', description: '' });
  };

  const refetchTripPoints = () => {
    const active = isActive === "all" ? undefined : isActive === "true";
    const selectedType = type === "all" ? undefined : type;
    const selectedTripId = tripId === "all" ? undefined : tripId;

    dispatch(fetchCompanyTripPoints({
      page: currentPage,
      pageSize,
      search: debouncedSearch || undefined,
      isActive: active,
      type: selectedType,
      tripId: selectedTripId,
    }));
  };

  const handleModalSuccess = () => {
    refetchTripPoints();
  };

  const columns = useMemo(
    () => createColumns({
      onEdit: handleEditTripPoint,
      onDelete: handleDeleteTripPoint,
      onToggleActive: handleToggleActive,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý điểm đón/trả theo chuyến</h1>
        <p className="text-gray-500">Quản lý điểm đón/trả theo chuyến</p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={tripPointData}
        loading={loading}
        totalRows={pagination.total || 0}
        isActive={isActive}
        type={type}
        tripId={tripId}
        trips={trips}
        onIsActiveChange={handleIsActiveChange}
        onTypeChange={handleTypeChange}
        onTripChange={handleTripChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateTripPoint={handleOpenCreateModal}
        onBulkToggleActive={handleBulkToggleActive}
        onExportExcel={handleExportExcel}
      />
      
      <TripPointModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tripPoint={selectedTripPoint}
        onSubmit={handleModalSuccess}
        trips={trips}
        points={points}
      />
      
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
}
