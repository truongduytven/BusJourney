import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { fetchPartnerList, updatePartnerStatus } from "@/redux/thunks/partnerThunks";
import { useEffect, useState, useMemo } from "react";
import type { Partner } from "@/types/partner";
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

export const PartnersPage = () => {
  const { partnerList } = useSelector((state: RootState) => state.partners);
  const dispatch = useDispatch<AppDispatch>();
  
  const [partnerData, setPartnerData] = useState<Partner[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Toggle status state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    partnerId?: string;
    partnerIds?: string[];
    currentStatus?: string;
    targetStatus?: 'processed' | 'unprocessed';
    isBulk?: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: '',
    description: '',
  });
  
  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch partners
  const refetchPartners = () => {
    const filterStatus = status === "all" ? undefined : status as any;

    dispatch(fetchPartnerList({ 
      status: filterStatus,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  };

  useEffect(() => {
    refetchPartners();
  }, [dispatch, status, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setPartnerData(partnerList?.partners || []);
  }, [partnerList]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatus("all");
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handleToggleStatus = (partnerId: string, currentStatus: string) => {
    setConfirmDialog({
      open: true,
      partnerId,
      currentStatus,
      isBulk: false,
      title: currentStatus === "processed" ? 'Xác nhận chuyển về chưa xử lí' : 'Xác nhận đánh dấu đã xử lí',
      description: currentStatus === "processed"
        ? 'Bạn có chắc chắn muốn chuyển đăng ký này về trạng thái chưa xử lí?'
        : 'Bạn có chắc chắn muốn đánh dấu đăng ký này là đã xử lí?',
    });
  };

  const handleBulkToggleStatus = (partnerIds: string[], targetStatus: string) => {
    setConfirmDialog({
      open: true,
      partnerIds,
      targetStatus: targetStatus as 'processed' | 'unprocessed',
      isBulk: true,
      title: targetStatus === "processed" ? 'Xác nhận đánh dấu đã xử lí hàng loạt' : 'Xác nhận đánh dấu chưa xử lí hàng loạt',
      description: targetStatus === "processed"
        ? `Bạn có chắc chắn muốn đánh dấu ${partnerIds.length} đăng ký là đã xử lí?`
        : `Bạn có chắc chắn muốn đánh dấu ${partnerIds.length} đăng ký là chưa xử lí?`,
    });
  };

  const handleConfirmToggle = async () => {
    if (confirmDialog.isBulk) {
      // Bulk update
      if (!confirmDialog.partnerIds || !confirmDialog.targetStatus) return;

      try {
        // Update each partner
        const updatePromises = confirmDialog.partnerIds.map(partnerId =>
          dispatch(updatePartnerStatus({
            partnerId,
            status: confirmDialog.targetStatus!,
          })).unwrap()
        );

        await Promise.all(updatePromises);

        toast.success(
          confirmDialog.targetStatus === "processed"
            ? `Đã đánh dấu ${confirmDialog.partnerIds.length} đăng ký là đã xử lí`
            : `Đã đánh dấu ${confirmDialog.partnerIds.length} đăng ký là chưa xử lí`
        );
        refetchPartners();
      } catch (error: any) {
        toast.error(error || "Có lỗi xảy ra khi cập nhật trạng thái");
      } finally {
        setConfirmDialog({
          open: false,
          title: '',
          description: '',
        });
      }
    } else {
      // Single update
      if (!confirmDialog.partnerId || !confirmDialog.currentStatus) return;

      const newStatus = confirmDialog.currentStatus === "processed" ? "unprocessed" : "processed";

      try {
        await dispatch(updatePartnerStatus({
          partnerId: confirmDialog.partnerId,
          status: newStatus,
        })).unwrap();

        toast.success(
          newStatus === "processed"
            ? "Đã đánh dấu là đã xử lí"
            : "Đã chuyển về chưa xử lí"
        );
        refetchPartners();
      } catch (error: any) {
        toast.error(error || "Có lỗi xảy ra khi cập nhật trạng thái");
      } finally {
        setConfirmDialog({
          open: false,
          title: '',
          description: '',
        });
      }
    }
  };

  const columns = useMemo(
    () =>
      createColumns({
        onToggleStatus: handleToggleStatus,
      }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý đối tác
        </h1>
      </div>

      <DataTable
        columns={columns}
        data={partnerData}
        totalRows={partnerList?.totalPartners || 0}
        searchQuery={searchQuery}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPageSizeChange={handlePageSizeChange}
        onResetFilters={handleResetFilters}
        onBulkToggleStatus={handleBulkToggleStatus}
      />

      {/* Toggle Status Confirmation Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ 
          open: false,
          title: '',
          description: '',
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
              title: '',
              description: '',
            })}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggle}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PartnersPage;
