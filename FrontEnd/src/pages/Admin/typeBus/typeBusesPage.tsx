import type { RootState, AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { fetchTypeBuses } from "@/redux/thunks/typeBusThunks";
import { useEffect, useState } from "react";
import type { TypeBus } from "@/types/typeBus";
import { useDebounce } from "@/hooks/useDebounce";

export const TypeBusesPage = () => {
  const { data } = useSelector((state: RootState) => state.typeBuses);
  const dispatch = useDispatch<AppDispatch>();
  const [typeBusData, setTypeBusData] = useState<TypeBus[]>([]);
  const [isFloors, setIsFloors] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch type buses when any filter changes
  useEffect(() => {
    const floorsFilter = isFloors === "all" ? undefined : isFloors === "true" ? true : false;

    dispatch(fetchTypeBuses({ 
      page: currentPage,
      pageSize,
      isFloors: floorsFilter,
      search: debouncedSearch || undefined,
    }));
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

  // Create columns (no actions for Admin - read only)
  const columns = createColumns();

  return (
    <div className="container mx-auto py-4 px-4 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Quản lý loại xe (Xem)
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Admin chỉ có quyền xem thông tin loại xe
        </p>
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
        isReadOnly={true} // Admin read-only mode
      />
    </div>
  );
};
