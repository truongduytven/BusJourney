import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  fetchCompanyTrips,
  createCompanyTrip,
  createBulkCompanyTrips,
  updateCompanyTrip,
  toggleCompanyTripStatus,
  bulkToggleCompanyTripStatus,
} from '@/redux/thunks/companyTripThunks';
import { fetchCompanyBuses } from '@/redux/thunks/companyBusThunks';
import { fetchCompanyTemplates } from '@/redux/thunks/companyTemplateThunks';
import { fetchBusRoutes } from '@/redux/thunks/busRouteThunks';
import { DataTable } from './data-table';
import { createColumns } from './columns';
import { TripModal } from './trip-modal';
import type { Trip, CreateTripRequest, CreateBulkTripRequest } from '@/types/companyTrip';
import { toast } from 'sonner';

export default function CompanyTripsPage() {
  const dispatch = useAppDispatch();
  const { trips, pagination, loading } = useAppSelector((state) => state.companyTrips);
  const { buses } = useAppSelector((state) => state.companyBuses);
  const { templates } = useAppSelector((state) => state.companyTemplates);
  const { data: busRoutes } = useAppSelector((state) => state.busRoutes);

  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    dispatch(fetchCompanyBuses({ pageSize: 1000 }));
    dispatch(fetchCompanyTemplates({ pageSize: 1000 }));
    dispatch(fetchBusRoutes({ pageSize: 100 }));
  }, []);

  useEffect(() => {
    const params = {
      page: currentPage,
      pageSize,
      search: searchQuery || undefined,
      status: status === 'all' ? undefined : status === 'true',
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    dispatch(fetchCompanyTrips(params));
  }, [dispatch, currentPage, pageSize, searchQuery, status, startDate, endDate]);

  const handleAddNew = () => {
    setSelectedTrip(null);
    setModalOpen(true);
  };

  const handleEdit = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const handleToggleStatus = async (trip: Trip) => {
    const action = trip.status ? 'tạm dừng' : 'kích hoạt';
    if (window.confirm(`Bạn có chắc muốn ${action} chuyến đi này?`)) {
      try {
        await dispatch(
          toggleCompanyTripStatus({
            id: trip.id,
            status: !trip.status,
          })
        ).unwrap();
        toast.success(`${trip.status ? 'Tạm dừng' : 'Kích hoạt'} chuyến đi thành công`);

        dispatch(
          fetchCompanyTrips({
            page: currentPage,
            pageSize,
            search: searchQuery || undefined,
            status: status === 'all' ? undefined : status === 'true',
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          })
        );
      } catch (error: any) {
        toast.error(error.message || `${action} chuyến đi thất bại`);
      }
    }
  };

  const handleSubmit = async (data: CreateTripRequest) => {
    try {
      if (selectedTrip) {
        await dispatch(
          updateCompanyTrip({
            id: selectedTrip.id,
            data,
          })
        ).unwrap();
        toast.success('Cập nhật chuyến đi thành công');
      } else {
        await dispatch(createCompanyTrip(data)).unwrap();
        toast.success('Tạo chuyến đi thành công');
      }
      setModalOpen(false);
      
      dispatch(
        fetchCompanyTrips({
          page: currentPage,
          pageSize,
        })
      );
    } catch (error: any) {
      console.log(error)
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleBulkSubmit = async (data: CreateBulkTripRequest) => {
    try {
      await dispatch(createBulkCompanyTrips(data)).unwrap();
      toast.success(`Tạo thành công ${data.dates.length} chuyến đi`);
      setModalOpen(false);
      
      dispatch(
        fetchCompanyTrips({
          page: currentPage,
          pageSize,
        })
      );
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    dispatch(fetchCompanyTrips({ page: 1, pageSize: newPageSize }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatus('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleBulkToggleStatus = async (activeStatus: boolean, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một chuyến đi');
      return;
    }

    const action = activeStatus ? 'kích hoạt' : 'tạm dừng';
    if (window.confirm(`Bạn có chắc muốn ${action} ${selectedIds.length} chuyến đi đã chọn?`)) {
      try {
        await dispatch(
          bulkToggleCompanyTripStatus({
            ids: selectedIds,
            status: activeStatus,
          })
        ).unwrap();
        toast.success(`${activeStatus ? 'Kích hoạt' : 'Tạm dừng'} ${selectedIds.length} chuyến đi thành công`);

        dispatch(
          fetchCompanyTrips({
            page: currentPage,
            pageSize,
            search: searchQuery || undefined,
            status: status === 'all' ? undefined : status === 'true',
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          })
        );
      } catch (error: any) {
        toast.error(error.message || `${action} chuyến đi thất bại`);
      }
    }
  };

  const handleExportExcel = () => {
    toast.info('Chức năng xuất Excel đang phát triển');
  };

  const columns = createColumns(handleEdit, handleToggleStatus);

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý Chuyến đi</h1>
        <p className="text-muted-foreground mt-1">Quản lý các chuyến đi của nhà xe</p>
      </div>

      <DataTable
        columns={columns}
        data={trips}
        totalRows={pagination.total}
        searchQuery={searchQuery}
        status={status}
        startDate={startDate}
        endDate={endDate}
        loading={loading}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatus}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onPageSizeChange={handlePageSizeChange}
        onResetFilters={handleResetFilters}
        onAddNew={handleAddNew}
        onBulkToggleStatus={handleBulkToggleStatus}
        onExportExcel={handleExportExcel}
      />

      <TripModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        trip={selectedTrip}
        onSubmit={handleSubmit}
        onBulkSubmit={handleBulkSubmit}
        buses={buses as any}
        busRoutes={busRoutes as any}
        templates={templates}
      />
    </div>
  );
}
