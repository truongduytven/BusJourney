import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import {
  fetchCompanyReviews,
  deleteCompanyReview,
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

export default function CompanyReviewsPage() {
  const { reviews, pagination } = useSelector((state: RootState) => state.reviewManagement);
  const dispatch = useDispatch<AppDispatch>();
  const [reviewData, setReviewData] = useState<Review[]>([]);
  
  const [rating, setRating] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "delete";
    reviewId?: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: "delete",
    title: "",
    description: "",
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch reviews
  const refetchReviews = () => {
    dispatch(fetchCompanyReviews({
      search: debouncedSearch,
      rating: rating !== "all" ? parseInt(rating) : undefined,
      pageSize,
      pageNumber: currentPage,
    }));
  };

  useEffect(() => {
    refetchReviews();
  }, [debouncedSearch, rating, currentPage, pageSize, dispatch]);

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

  const handleResetFilters = () => {
    setRating("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDelete = (review: Review) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      reviewId: review.id,
      title: "Xác nhận xóa đánh giá",
      description: `Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.`,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.reviewId) return;

    try {
      await dispatch(deleteCompanyReview(confirmDialog.reviewId)).unwrap();
      toast.success("Xóa đánh giá thành công!");
      refetchReviews();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra!");
    } finally {
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const handleExportExcel = () => {
    // Implement Excel export if needed
    toast.info("Chức năng đang được phát triển");
  };

  const columns = createColumns({
    onDelete: handleDelete,
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
        onSearchChange={handleSearchChange}
        onRatingChange={handleRatingChange}
        onPageSizeChange={handlePageSizeChange}
        onResetFilters={handleResetFilters}
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
