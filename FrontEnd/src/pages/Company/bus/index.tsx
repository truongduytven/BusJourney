import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import {
  fetchCompanyBuses,
  deleteCompanyBus,
  createCompanyBus,
  updateCompanyBus,
} from "@/redux/thunks/companyBusThunks";
import { fetchCompanyTypeBuses } from "@/redux/thunks/companyTypeBusThunks";
import { useEffect, useState } from "react";
import type { Bus } from "@/types/bus";
import { useDebounce } from "@/hooks/useDebounce";
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
import BusModal from "./bus-modal";
import BusImagesModal from "./bus-images-modal";

export const CompanyBusesPage = () => {
  const { buses, pagination } = useSelector((state: RootState) => state.companyBuses);
  const { data: typeBuses } = useSelector((state: RootState) => state.companyTypeBuses);
  const dispatch = useDispatch<AppDispatch>();
  
  const [busData, setBusData] = useState<Bus[]>([]);
  const [typeBusFilter, setTypeBusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  
  const [imagesModalOpen, setImagesModalOpen] = useState(false);
  const [selectedBusForImages, setSelectedBusForImages] = useState<Bus | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "delete";
    busId?: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: "delete",
    title: '',
    description: '',
  });
  
  const debouncedSearch = useDebounce(searchQuery, 1500);

  useEffect(() => {
    dispatch(fetchCompanyTypeBuses({ page: 1, pageSize: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const typeBusId = typeBusFilter === "all" ? undefined : typeBusFilter;

    dispatch(fetchCompanyBuses({ 
      page: currentPage,
      pageSize,
      typeBusId,
      search: debouncedSearch || undefined,
    }));
  }, [dispatch, typeBusFilter, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setBusData(buses || []);
  }, [buses]);

  const handleTypeBusFilterChange = (newFilter: string) => {
    setTypeBusFilter(newFilter);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTypeBusFilter("all");
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
    setEditingBus(null);
    setModalOpen(true);
  };

  const handleEditBus = (busId: string) => {
    const bus = busData.find((b) => b.id === busId);
    if (bus) {
      setEditingBus(bus);
      setModalMode("edit");
      setModalOpen(true);
    }
  };

  const handleDelete = (busId: string) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      busId,
      title: 'Xác nhận xóa',
      description: 'Bạn có chắc chắn muốn xóa xe này? Hành động này không thể hoàn tác.',
    });
  };

  const handleViewImages = (busId: string) => {
    const bus = busData.find((b) => b.id === busId);
    if (bus) {
      setSelectedBusForImages(bus);
      setImagesModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "delete" && confirmDialog.busId) {
      try {
        await dispatch(deleteCompanyBus(confirmDialog.busId)).unwrap();
        toast.success("Đã xóa xe thành công");
        refetchBuses();
      } catch (error: any) {
        toast.error(error || "Có lỗi xảy ra");
      }
    }
    setConfirmDialog({ open: false, type: "delete", title: '', description: '' });
  };

  const refetchBuses = () => {
    const typeBusId = typeBusFilter === "all" ? undefined : typeBusFilter;
    dispatch(fetchCompanyBuses({ 
      page: currentPage,
      pageSize,
      typeBusId,
      search: debouncedSearch || undefined,
    }));
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(
        ids.map((id) => dispatch(deleteCompanyBus(id)).unwrap())
      );
      toast.success(`Đã xóa ${ids.length} xe thành công`);
      refetchBuses();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi xóa");
    }
  };

  const handleModalSubmit = async (payload: {
    data: {
      licensePlate: string;
      typeBusId: string;
      extensions?: string[];
      images?: string[];
    };
    images?: File[];
  }) => {
    if (modalMode === "create") {
      await dispatch(createCompanyBus(payload)).unwrap();
    } else if (editingBus) {
      await dispatch(updateCompanyBus({ 
        id: editingBus.id, 
        data: payload.data,
        images: payload.images 
      })).unwrap();
    }
  };

  const handleModalSuccess = () => {
    refetchBuses();
  };

  const columns = createColumns({
    onEdit: handleEditBus,
    onDelete: handleDelete,
    onViewImages: handleViewImages,
  });

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý xe</h1>
        <p className="text-muted-foreground mt-1">Quản lý các xe của nhà xe</p>
      </div>

      <DataTable
        columns={columns}
        data={busData}
        isFloorsFilterValue={typeBusFilter}
        onIsFloorsFilterChange={handleTypeBusFilterChange}
        onResetFilters={handleResetFilters}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        onAddNew={handleOpenCreateModal}
        onBulkDelete={handleBulkDelete}
        typeBuses={typeBuses || []}
      />

      <BusModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initialData={editingBus || undefined}
        typeBuses={typeBuses || []}
        onSubmit={handleModalSubmit}
        onSuccess={handleModalSuccess}
      />

      <BusImagesModal
        open={imagesModalOpen}
        onOpenChange={setImagesModalOpen}
        bus={selectedBusForImages}
      />

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => {
        if (!open) {
          setConfirmDialog({ open: false, type: "delete", title: '', description: '' });
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} className="bg-red-600 hover:bg-red-700">
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
