import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { 
  fetchCouponList, 
  toggleCouponStatus
} from "@/redux/thunks/couponThunks";
import { useEffect, useState, useMemo } from "react";
import type { Coupon } from "@/types/coupon";
import { useDebounce } from "@/hooks/useDebounce";
import CouponModal from "./coupon-modal";
import ExtendCouponModal from "@/pages/Admin/coupon/extend-coupon-modal";
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

export const CouponsPage = () => {
  const { couponList } = useSelector((state: RootState) => state.coupons);
  const dispatch = useDispatch<AppDispatch>();
  const [couponData, setCouponData] = useState<Coupon[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [discountType, setDiscountType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCouponId, setSelectedCouponId] = useState<string | undefined>();
  
  // Extend modal state
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [extendCouponId, setExtendCouponId] = useState<string>("");
  const [extendCurrentValidTo, setExtendCurrentValidTo] = useState<string>("");
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggle";
    couponId?: string;
    currentStatus?: string;
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

  // Fetch coupons when any filter changes
  useEffect(() => {
    const selectedStatus = status === "all" ? undefined : status;
    const selectedDiscountType = discountType === "all" ? undefined : discountType;

    dispatch(fetchCouponList({ 
      status: selectedStatus,
      discountType: selectedDiscountType,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  }, [dispatch, status, discountType, currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    setCouponData(couponList?.coupons || []);
  }, [couponList]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleDiscountTypeChange = (type: string) => {
    setDiscountType(type);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatus("all");
    setDiscountType("all");
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
    setSelectedCouponId(undefined);
    setModalOpen(true);
  };

  const handleEditCoupon = (couponId: string) => {
    setModalMode("edit");
    setSelectedCouponId(couponId);
    setModalOpen(true);
  };

  const handleToggleStatus = (couponId: string, currentStatus: string) => {
    setConfirmDialog({
      open: true,
      type: "toggle",
      couponId,
      currentStatus,
      title: currentStatus === "active" ? 'Xác nhận vô hiệu hóa' : 'Xác nhận kích hoạt',
      description: currentStatus === "active"
        ? 'Bạn có chắc chắn muốn vô hiệu hóa mã giảm giá này?'
        : 'Bạn có chắc chắn muốn kích hoạt mã giảm giá này?',
    });
  };

  const handleExtendCoupon = (couponId: string) => {
    const coupon = couponData.find(c => c.id === couponId);
    console.log(coupon)
    if (coupon) {
      setExtendCouponId(couponId);
      setExtendCurrentValidTo(coupon.validTo);
      setExtendModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.type === "toggle" && confirmDialog.couponId) {
      try {
        await dispatch(toggleCouponStatus(confirmDialog.couponId)).unwrap();
        toast.success(
          confirmDialog.currentStatus === "active" 
            ? "Vô hiệu hóa mã giảm giá thành công!" 
            : "Kích hoạt mã giảm giá thành công!"
        );
        refetchCoupons();
      } catch (error: any) {
        console.error("Failed to toggle coupon status:", error);
        toast.error(error || "Có lỗi xảy ra khi thay đổi trạng thái");
      }
    }
    setConfirmDialog({ open: false, type: "toggle", title: '', description: '' });
  };

  const refetchCoupons = () => {
    const selectedStatus = status === "all" ? undefined : status;
    const selectedDiscountType = discountType === "all" ? undefined : discountType;

    dispatch(fetchCouponList({ 
      status: selectedStatus,
      discountType: selectedDiscountType,
      search: debouncedSearch || undefined,
      pageSize, 
      pageNumber: currentPage 
    }));
  };

  const handleModalSuccess = () => {
    refetchCoupons();
  };

  // Create columns with action handlers
  const columns = useMemo(
    () => createColumns({
      onEdit: handleEditCoupon,
      onToggleStatus: handleToggleStatus,
      onExtend: handleExtendCoupon,
    }),
    []
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý mã giảm giá
        </h1>
      </div>
      
      <DataTable 
        columns={columns} 
        data={couponData} 
        totalRows={couponList?.totalCoupons || 0}
        status={status}
        discountType={discountType}
        onStatusChange={handleStatusChange}
        onDiscountTypeChange={handleDiscountTypeChange}
        onResetFilters={handleResetFilters}
        onPageSizeChange={handlePageSizeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateCoupon={handleOpenCreateModal}
      />
      
      <CouponModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        couponId={selectedCouponId}
        onSuccess={handleModalSuccess}
      />
      
      <ExtendCouponModal
        open={extendModalOpen}
        onOpenChange={setExtendModalOpen}
        couponId={extendCouponId}
        currentValidTo={extendCurrentValidTo}
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
