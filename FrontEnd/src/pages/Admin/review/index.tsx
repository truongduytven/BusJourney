import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import {
  fetchAdminReviews,
  deleteAdminReview,
  toggleAdminReviewVisibility,
} from "@/redux/thunks/reviewThunks";
import { useEffect, useState } from "react";
import type { Review } from "@/types/review";
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

export default function AdminReviewsPage() {
  const { reviews, pagination } = useSelector((state: RootState) => state.reviewManagement);
  const dispatch = useDispatch<AppDispatch>();
  const [reviewData, setReviewData] = useState<Review[]>([]);
  
  const [rating, setRating] = useState<string>("all");
  const [isVisible, setIsVisible] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggleVisibility" | "delete";
    reviewId?: string;
    currentVisibility?: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    type: "toggleVisibility",
    title: "",
    description: "",
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch reviews
  const refetchReviews = () => {
    dispatch(fetchAdminReviews({
      search: debouncedSearch,
      rating: rating !== "all" ? parseInt(rating) : undefined,
      isVisible: isVisible !== "all" ? isVisible === "true" : undefined,
      pageSize,
      pageNumber: currentPage,
    }));
  };

  useEffect(() => {
    refetchReviews();
  }, [debouncedSearch, rating, isVisible, currentPage, pageSize, dispatch]);

  useEffect(() => {
    setReviewData(reviews || []);
  }, [reviews]);

  // Handlers
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handleRatingChange = (newRating: string) => {
    setRating(newRating);
    setCurrentPage(1);
  };

  const handleVisibilityChange = (newVisibility: string) => {
    setIsVisible(newVisibility);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setRating("all");
    setIsVisible("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleToggleVisibility = (review: Review) => {
    setConfirmDialog({
      open: true,
      type: "toggleVisibility",
      reviewId: review.id,
      currentVisibility: review.isVisible,
      title: review.isVisible ? "Ẩn đánh giá" : "Hiển thị đánh giá",
      description: review.isVisible
        ? "Bạn có chắc chắn muốn ẩn đánh giá này?"
        : "Bạn có chắc chắn muốn hiển thị đánh giá này?",
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.reviewId) return;

    try {
      if (confirmDialog.type === "delete") {
        await dispatch(deleteAdminReview(confirmDialog.reviewId)).unwrap();
        toast.success("Xóa đánh giá thành công!");
      } else if (confirmDialog.type === "toggleVisibility") {
        await dispatch(toggleAdminReviewVisibility(confirmDialog.reviewId)).unwrap();
        toast.success(
          confirmDialog.currentVisibility
            ? "Đã ẩn đánh giá thành công!"
            : "Đã hiển thị đánh giá thành công!"
        );
      }
      refetchReviews();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra!");
    } finally {
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const handleBulkToggleVisibility = async () => {
    // Bulk toggle handled by pagination component
  };

  const handleExportExcel = () => {
    // Implement Excel export if needed
    toast.info("Chức năng đang được phát triển");
  };

  const columns = createColumns({
    onToggleVisibility: handleToggleVisibility,
  });

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý danh sách đánh giá
        </h1>
      </div>
      
      <DataTable
        columns={columns}
        data={reviewData}
        totalRows={pagination.totalReviews}
        searchQuery={searchQuery}
        rating={rating}
        isVisible={isVisible}
        onSearchChange={handleSearchChange}
        onRatingChange={handleRatingChange}
        onVisibilityChange={handleVisibilityChange}
        onPageSizeChange={handlePageSizeChange}
        onResetFilters={handleResetFilters}
        onBulkToggleVisibility={handleBulkToggleVisibility}
        onExportExcel={handleExportExcel}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
