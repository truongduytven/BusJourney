import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  fetchCompanyTemplates,
  createCompanyTemplate,
  updateCompanyTemplate,
  toggleCompanyTemplateActive,
  bulkToggleCompanyTemplateActive,
} from '@/redux/thunks/companyTemplateThunks';
import { fetchCompanyBuses } from '@/redux/thunks/companyBusThunks';
import { DataTable } from './data-table';
import { createColumns } from './columns';
import { TemplateModal } from './template-modal';
import type { Template, CreateTemplateRequest, BusRoute, BusRouteListResponse } from '@/types/companyTemplate';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';

export default function CompanyTemplatesPage() {
  const dispatch = useAppDispatch();
  const { templates, pagination, loading } = useAppSelector((state) => state.companyTemplates);
  const { buses } = useAppSelector((state) => state.companyBuses);

  const [searchQuery, setSearchQuery] = useState('');
  const [isActive, setIsActive] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);

  useEffect(() => {
    dispatch(fetchCompanyBuses({ pageSize: 1000 }));
    loadBusRoutes();
  }, []);

  useEffect(() => {
    const params = {
      page: currentPage,
      pageSize,
      search: searchQuery || undefined,
      isActive: isActive === 'all' ? undefined : isActive === 'true',
    };
    dispatch(fetchCompanyTemplates(params));
  }, [dispatch, currentPage, pageSize, searchQuery, isActive]);

  const loadBusRoutes = async () => {
    try {
      const response = await axiosInstance.get<BusRouteListResponse>('/bus-routes', { 
        params: { pageSize: 100 } 
      });
      setBusRoutes(response.data.data);
    } catch (error) {
      toast.error('Không thể tải danh sách tuyến đường');
    }
  };

  const handleAddNew = () => {
    setSelectedTemplate(null);
    setModalOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  const handleToggleActive = async (template: Template) => {
    const action = template.isActive ? 'tạm dừng' : 'kích hoạt';
    if (window.confirm(`Bạn có chắc muốn ${action} template "${template.name}"?`)) {
      try {
        await dispatch(toggleCompanyTemplateActive({ 
          id: template.id, 
          isActive: !template.isActive 
        })).unwrap();
        toast.success(`${template.isActive ? 'Tạm dừng' : 'Kích hoạt'} template thành công`);
        
        // Refresh data after toggle
        dispatch(fetchCompanyTemplates({
          page: currentPage,
          pageSize,
          search: searchQuery || undefined,
          isActive: isActive === 'all' ? undefined : isActive === 'true',
        }));
      } catch (error: any) {
        toast.error(error.message || `${action} template thất bại`);
      }
    }
  };

  const handleSubmit = async (data: CreateTemplateRequest) => {
    try {
      if (selectedTemplate) {
        await dispatch(
          updateCompanyTemplate({
            id: selectedTemplate.id,
            data,
          })
        ).unwrap();
        toast.success('Cập nhật template thành công');
      } else {
        await dispatch(createCompanyTemplate(data)).unwrap();
        toast.success('Tạo template thành công');
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    dispatch(fetchCompanyTemplates({ page: 1, pageSize: newPageSize }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setIsActive('all');
    setCurrentPage(1);
  };

  const handleBulkToggleActive = async (activeStatus: boolean, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một template');
      return;
    }

    const action = activeStatus ? 'kích hoạt' : 'tạm dừng';
    if (window.confirm(`Bạn có chắc muốn ${action} ${selectedIds.length} template đã chọn?`)) {
      try {
        await dispatch(bulkToggleCompanyTemplateActive({ 
          ids: selectedIds, 
          isActive: activeStatus 
        })).unwrap();
        toast.success(`${activeStatus ? 'Kích hoạt' : 'Tạm dừng'} ${selectedIds.length} template thành công`);
        
        // Refresh data after bulk toggle
        dispatch(fetchCompanyTemplates({
          page: currentPage,
          pageSize,
          search: searchQuery || undefined,
          isActive: isActive === 'all' ? undefined : isActive === 'true',
        }));
      } catch (error: any) {
        toast.error(error.message || `${action} template thất bại`);
      }
    }
  };

  const handleExportExcel = () => {
    toast.info('Chức năng xuất Excel đang phát triển');
  };

  const columns = createColumns(handleEdit, handleToggleActive);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý Template</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý các template cho chuyến xe của nhà xe
        </p>
      </div>

      <DataTable
        columns={columns}
        data={templates}
        totalRows={pagination.total}
        searchQuery={searchQuery}
        isActive={isActive}
        loading={loading}
        onSearchChange={setSearchQuery}
        onIsActiveChange={setIsActive}
        onPageSizeChange={handlePageSizeChange}
        onResetFilters={handleResetFilters}
        onAddNew={handleAddNew}
        onBulkToggleActive={handleBulkToggleActive}
        onExportExcel={handleExportExcel}
      />

      <TemplateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        template={selectedTemplate}
        onSubmit={handleSubmit}
        buses={buses}
        busRoutes={busRoutes}
      />
    </div>
  );
}
