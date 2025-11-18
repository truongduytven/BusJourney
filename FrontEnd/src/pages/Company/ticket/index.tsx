import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import {
  fetchCompanyTickets,
  updateCompanyTicket,
  deleteCompanyTicket,
  toggleCompanyTicketStatus,
} from "@/redux/thunks/ticketThunks";
import { fetchPointList } from "@/redux/thunks/pointThunks";
import { useEffect, useState, useMemo } from "react";
import type { Ticket } from "@/types/ticket";
import { useDebounce } from "@/hooks/useDebounce";
import { TicketModal } from "./ticket-modal";
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

export default function CompanyTicketsPage() {
  const { tickets, loading, pagination } = useSelector((state: RootState) => state.ticketManagement);
  const { pointList } = useSelector((state: RootState) => state.points);
  const points = pointList.points || [];
  const dispatch = useDispatch<AppDispatch>();
  
  const [status, setStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "toggle" | "delete";
    ticketId?: string;
    currentStatus?: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: "toggle",
    title: "",
    description: "",
  });

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch tickets
  const refetchTickets = () => {
    dispatch(fetchCompanyTickets({
      search: debouncedSearch,
      status: status !== "all" ? status : undefined,
      pageSize,
      pageNumber: currentPage,
    }));
  };

  useEffect(() => {
    refetchTickets();
  }, [debouncedSearch, status, currentPage, pageSize, dispatch]);

  // Fetch points on mount
  useEffect(() => {
    dispatch(fetchPointList({
      pageSize: 1000,
      pageNumber: 1,
    }));
  }, [dispatch]);

  // Handlers
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleBulkToggleStatus = async (newStatus: "cancelled" | "confirmed") => {
    console.log("Bulk toggle status to:", newStatus);
    toast.success(`Đã ${newStatus === "cancelled" ? "hủy" : "xác nhận"} các vé đã chọn`);
    refetchTickets();
  };

  const handleExportExcel = async () => {
    console.log("Export to Excel");
    toast.success("Đang xuất file Excel...");
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleToggleStatus = (ticket: Ticket) => {
    const isCancelled = ticket.status === "cancelled";
    setConfirmDialog({
      open: true,
      type: "toggle",
      ticketId: ticket.id,
      currentStatus: ticket.status,
      title: isCancelled ? "Xác nhận vé" : "Hủy vé",
      description: isCancelled
        ? `Bạn có chắc chắn muốn xác nhận lại vé ${ticket.ticketCode}?`
        : `Bạn có chắc chắn muốn hủy vé ${ticket.ticketCode}?`,
    });
  };

  const handleDeleteTicket = (ticket: Ticket) => {
    setConfirmDialog({
      open: true,
      type: "delete",
      ticketId: ticket.id,
      title: "Xóa vé",
      description: `Bạn có chắc chắn muốn xóa vé ${ticket.ticketCode}? Hành động này không thể hoàn tác.`,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.ticketId) return;

    try {
      if (confirmDialog.type === "toggle") {
        await dispatch(toggleCompanyTicketStatus(confirmDialog.ticketId)).unwrap();
        toast.success("Đã cập nhật trạng thái vé");
      } else if (confirmDialog.type === "delete") {
        await dispatch(deleteCompanyTicket(confirmDialog.ticketId)).unwrap();
        toast.success("Đã xóa vé");
      }
      refetchTickets();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra");
    } finally {
      setConfirmDialog({
        open: false,
        type: "toggle",
        title: "",
        description: "",
      });
    }
  };

  const handleModalSubmit = async (data: {
    status?: string;
    pickupPointId?: string;
    dropoffPointId?: string;
    seatCode?: string;
  }) => {
    if (!selectedTicket) return;

    try {
      await dispatch(updateCompanyTicket({
        id: selectedTicket.id,
        data,
      })).unwrap();
      
      toast.success("Đã cập nhật vé");
      setModalOpen(false);
      setSelectedTicket(null);
      refetchTickets();
    } catch (error: any) {
      toast.error(error || "Có lỗi xảy ra khi cập nhật vé");
    }
  };

  const columns = useMemo(
    () => createColumns({
      onEdit: handleEditTicket,
      onDelete: handleDeleteTicket,
      onToggleStatus: handleToggleStatus,
    }),
    []
  );

  return (
    <div className="container mx-auto py-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý vé</h1>
        <p className="text-gray-500">Quản lý vé của nhà xe</p>
      </div>

      <DataTable
        columns={columns}
        data={tickets}
        loading={loading}
        totalRows={pagination.totalTickets}
        searchQuery={searchQuery}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPageSizeChange={handlePageSizeChange}
        onResetFilters={handleResetFilters}
        onBulkToggleStatus={handleBulkToggleStatus}
        onExportExcel={handleExportExcel}
      />

      {/* Edit Ticket Modal */}
      <TicketModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTicket(null);
        }}
        onSubmit={handleModalSubmit}
        ticket={selectedTicket}
        points={points}
      />

      {/* Confirm Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
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
