import { SlidersHorizontal, Activity, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AdvancedFiltersProps {
  status: string;
  startDate: string;
  endDate: string;
  onStatusChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onReset: () => void;
}

export function DataTableAdvancedFilters({
  status,
  startDate,
  endDate,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: AdvancedFiltersProps) {
  const hasActiveFilters = status !== "all" || startDate || endDate;
  const activeFilterCount = [
    status !== "all",
    startDate,
    endDate,
  ].filter(Boolean).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 relative border-gray-400 cursor-pointer">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Bộ lọc</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc nâng cao
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4 p-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Activity className="h-4 w-4 text-orange-600" />
              Trạng thái
            </label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Hoạt động
                  </span>
                </SelectItem>
                <SelectItem value="false">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Tạm dừng
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-blue-600" />
              Thời gian khởi hành
            </label>
            <div className="space-y-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors"
                placeholder="Từ ngày"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors"
                placeholder="Đến ngày"
              />
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full hover:bg-red-50 hover:text-red-600 transition-colors"
            onClick={onReset}
            disabled={!hasActiveFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Đặt lại bộ lọc
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
