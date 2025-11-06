import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { fetchPointList, updatePoint } from "@/redux/thunks/pointThunks";
import { useEffect, useState, useMemo } from "react";
import type { Point } from "@/types/point";
import { useDebounce } from "@/hooks/useDebounce";
import PointModal from "./point-modal";
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

export const PointsPage = () => {
  const { pointList } = useSelector((state: RootState) => state.points);
  const dispatch = useDispatch<AppDispatch>();
  const [pointData, setPointData] = useState<Point[]>([]);
  const [isActive, setIsActive] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPointId, setSelectedPointId] = useState<string | undefined>();
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggle";
    pointId?: string;
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

  // Fetch points when any filter changes
  useEffect(() => {
    const active = isActive === "all" ? undefined : isActive === "true";
    const selectedType = type === "all" ? undefined : type;

    dispatch(fetchPointList({ 
      isActive: active,
      type: selectedType,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  }, [dispatch, isActive, type, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setPointData(pointList?.points || []);
  }, [pointList]);

  const handleIsActiveChange = (active: string) => {
    setIsActive(active);
    setCurrentPage(1);
  };

  const handleTypeChange = (pointType: string) => {
    setType(pointType);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setIsActive("all");
    setType("all");
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
    setSelectedPointId(undefined);
    setModalOpen(true);
  };

  const handleEditPoint = (pointId: string) => {
    setModalMode("edit");
    setSelectedPointId(pointId);
    setModalOpen(true);
  };

  const handleToggleActive = (pointId: string, currentIsActive: boolean) => {
    setConfirmDialog({
      open: true,
      type: "toggle",
      pointId,
      currentStatus: currentIsActive,
      title: currentIsActive ? 'Xác nhận vô hiệu hóa' : 'Xác nhận kích hoạt',
      description: currentIsActive 
        ? 'Bạn có chắc chắn muốn vô hiệu hóa điểm đón/trả này?'
        : 'Bạn có chắc chắn muốn kích hoạt điểm đón/trả này?',
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "toggle" && confirmDialog.pointId && confirmDialog.currentStatus !== undefined) {
      try {
        await dispatch(updatePoint({
          id: confirmDialog.pointId,
          data: { isActive: !confirmDialog.currentStatus }
        })).unwrap();
        refetchPoints();
      } catch (error) {
        console.error("Failed to toggle point status:", error);
      }
    }
    setConfirmDialog({ open: false, type: "toggle", title: '', description: '' });
  };

  const refetchPoints = () => {
    const active = isActive === "all" ? undefined : isActive === "true";
    const selectedType = type === "all" ? undefined : type;

    dispatch(fetchPointList({ 
      isActive: active,
      type: selectedType,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  };

  const handleModalSuccess = () => {
    refetchPoints();
  };

  // Create columns with action handlers
  const columns = useMemo(
    () => createColumns({
      onEdit: handleEditPoint,
      onToggleActive: handleToggleActive,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý danh sách điểm đón/trả
        </h1>
      </div>
      
      <DataTable 
        columns={columns} 
        data={pointData} 
        totalRows={pointList?.totalPoints || 0}
        isActive={isActive}
        type={type}
        onIsActiveChange={handleIsActiveChange}
        onTypeChange={handleTypeChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreatePoint={handleOpenCreateModal}
        onBulkToggleActive={handleBulkToggleActive}
        onExportExcel={handleExportExcel}
      />
      
      <PointModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        pointId={selectedPointId}
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
