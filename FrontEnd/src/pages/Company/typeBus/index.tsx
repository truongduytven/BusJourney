import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import {
  fetchCompanyTypeBuses,
  deleteCompanyTypeBus,
} from "@/redux/thunks/companyTypeBusThunks";
import { useEffect, useState, useMemo } from "react";
import type { TypeBus } from "@/types/typeBus";
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

export const CompanyTypeBusesPage = () => {
  const { data } = useSelector((state: RootState) => state.companyTypeBuses);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [typeBusData, setTypeBusData] = useState<TypeBus[]>([]);
  const [isFloors, setIsFloors] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "delete";
    typeBusId?: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: "delete",
    title: "",
    description: "",
  });

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch type buses when any filter changes
  useEffect(() => {
    const floorsFilter =
      isFloors === "all" ? undefined : isFloors === "true" ? true : false;

    dispatch(
      fetchCompanyTypeBuses({
        page: currentPage,
        pageSize,
        isFloors: floorsFilter,
        search: debouncedSearch || undefined,
      })
    );
  }, [dispatch, isFloors, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setTypeBusData(data || []);
  }, [data]);

  const handleIsFloorsChange = (newIsFloors: string) => {
    setIsFloors(newIsFloors);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setIsFloors("all");
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
    navigate("/company/type-buses/create");
  };

  const handleEditTypeBus = (typeBusId: string) => {
    navigate(`/company/type-buses/${typeBusId}/edit`);
  };

  const handleDelete = (typeBusId: string) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      typeBusId,
      title: "Xác nhận xóa",
      description:
        "Bạn có chắc chắn muốn xóa loại xe này? Hành động này không thể hoàn tác.",
    });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "delete" && confirmDialog.typeBusId) {
      try {
        await dispatch(deleteCompanyTypeBus(confirmDialog.typeBusId)).unwrap();
        toast.success("Đã xóa loại xe thành công");
        refetchTypeBuses();
      } catch (error: any) {
        toast.error(error || "Có lỗi xảy ra");
      }
    }
    setConfirmDialog({
      open: false,
      type: "delete",
      title: "",
      description: "",
    });
  };

  const refetchTypeBuses = () => {
    const floorsFilter =
      isFloors === "all" ? undefined : isFloors === "true" ? true : false;
    dispatch(
      fetchCompanyTypeBuses({
        page: currentPage,
        pageSize,
        isFloors: floorsFilter,
        search: debouncedSearch || undefined,
      })
    );
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      // Delete each type bus one by one
      await Promise.all(
        ids.map((id) => dispatch(deleteCompanyTypeBus(id)).unwrap())
      );
      toast.success(`Đã xóa ${ids.length} loại xe thành công`);
      refetchTypeBuses();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi xóa");
    }
  };

  // Get initial data for edit mode
  const columns = useMemo(
    () =>
      createColumns({
        onEdit: handleEditTypeBus,
        onDelete: handleDelete,
      }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý loại xe</h1>
        <p className="text-muted-foreground mt-1">Quản lý các loại xe của nhà xe</p>
      </div>

      <DataTable
        columns={columns}
        data={typeBusData}
        totalRows={data?.length || 0}
        isFloors={isFloors}
        onIsFloorsChange={handleIsFloorsChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateTypeBus={handleOpenCreateModal}
        onBulkDelete={handleBulkDelete}
      />

      {/* Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({
            open: false,
            type: "delete",
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
                  type: "delete",
                  title: "",
                  description: "",
                })
              }
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className="bg-red-600 hover:bg-red-700"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
