import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import {
  setStatus,
  setPage,
  clearCurrentTicket,
} from "../../redux/slices/myTicketSlice";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { TicketCard } from "../../components/common/TicketCard";
import { TicketDetailModal } from "../../components/common/TicketDetailModal";
import { Button } from "../../components/ui/button";
import { Loader2, Ticket } from "lucide-react";
import type { TicketStatusFilter } from "../../types/myTicket";
import { useMyTickets } from "../../hooks/useMyTickets";

const MyTicketsPage = () => {
  const dispatch = useAppDispatch();
  const { status, pagination, error, currentTicket } = useAppSelector(
    (state) => state.myTicket
  );
  const { tickets, loading, fetchTicketsWithCache, fetchDetailWithCache } =
    useMyTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTicketsWithCache(status, pagination.page);
  }, [status, pagination.page]);

  const handleTabChange = (value: string) => {
    dispatch(setStatus(value as TicketStatusFilter));
  };

  const handleViewDetail = async (ticketId: string) => {
    const result = await fetchDetailWithCache(ticketId);
    if (result) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearCurrentTicket());
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const getTabLabel = (status: TicketStatusFilter) => {
    const labels = {
      all: "Tất cả",
      pending: "Đang xử lý",
      valid: "Đã hợp lệ",
      checked: "Đã soát vé",
    };

    return `${labels[status]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mx-auto">
      <div className="container px-4 py-8 pt-32 min-w-[88rem]">
        {/* Page Header - Enhanced */}
        <div className="mb-10 text-center">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-full p-4 mb-4 inline-block">
              <Ticket className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Vé của tôi
          </h1>
          <p className="text-gray-600 text-lg">
            Quản lý và theo dõi các vé xe đã đặt của bạn
          </p>
        </div>

        <Tabs value={status} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1.5 bg-gray-100 rounded-xl shadow-sm">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:border-b-0 data-[state=active]:text-white data-[state=active]:shadow-md py-3 rounded-lg font-semibold transition-all"
            >
              {getTabLabel("all")}
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-amber-500 data-[state=active]:border-b-0 data-[state=active]:text-white data-[state=active]:shadow-md py-3 rounded-lg font-semibold transition-all"
            >
              {getTabLabel("pending")}
            </TabsTrigger>
            <TabsTrigger
              value="valid"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:border-b-0 data-[state=active]:text-white data-[state=active]:shadow-md py-3 rounded-lg font-semibold transition-all"
            >
              {getTabLabel("valid")}
            </TabsTrigger>
            <TabsTrigger
              value="checked"
              className="data-[state=active]:bg-blue-500 data-[state=active]:border-b-0 data-[state=active]:text-white data-[state=active]:shadow-md py-3 rounded-lg font-semibold transition-all"
            >
              {getTabLabel("checked")}
            </TabsTrigger>
          </TabsList>

          {["all", "pending", "valid", "checked"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              {loading ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Đang tải vé của bạn...
                  </p>
                </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-50 rounded-xl border border-red-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <p className="text-red-700 font-semibold mb-4 text-lg">
                    {error}
                  </p>
                  <Button
                    onClick={() => fetchTicketsWithCache(status, pagination.page)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Thử lại
                  </Button>
                </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300">
                <div className="inline-block p-6 bg-white rounded-2xl shadow-lg mb-6">
                    <Ticket className="w-20 h-20 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    Chưa có vé nào
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Bạn chưa có vé nào trong danh mục này
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/search")}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Đặt vé ngay
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {tickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        onViewDetail={handleViewDetail}
                      />
                    ))}
                  </div>

                  {/* Pagination - Enhanced */}
                  {pagination.totalPages > 1 && (
                    <div className="flex flex-col items-center gap-4 mt-10">
                      <div className="text-sm text-gray-600">
                        Trang <strong>{pagination.page}</strong> /{" "}
                        <strong>{pagination.totalPages}</strong> • Tổng{" "}
                        <strong>{pagination.total}</strong> vé
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1 || loading}
                          className="font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                          ← Trước
                        </Button>

                        <div className="flex gap-1">
                          {Array.from(
                            { length: Math.min(pagination.totalPages, 7) },
                            (_, i) => {
                              let page;
                              if (pagination.totalPages <= 7) {
                                page = i + 1;
                              } else if (pagination.page <= 4) {
                                page = i + 1;
                              } else if (
                                pagination.page >=
                                pagination.totalPages - 3
                              ) {
                                page = pagination.totalPages - 6 + i;
                              } else {
                                page = pagination.page - 3 + i;
                              }
                              return page;
                            }
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                page === pagination.page ? "default" : "outline"
                              }
                              onClick={() => handlePageChange(page)}
                              disabled={loading}
                              className={`w-12 h-12 font-semibold shadow-sm transition-all ${
                                page === pagination.page
                                  ? "bg-primary hover:bg-primary/90 shadow-md"
                                  : "hover:shadow-md"
                              }`}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={
                            pagination.page === pagination.totalPages || loading
                          }
                          className="font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                          Sau →
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <TicketDetailModal
          ticket={currentTicket}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default MyTicketsPage;
