import { SlidersHorizontal, Activity, X, MapPin } from "lucide-react";
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
import type { City } from "@/types/city";

interface AdvancedFiltersProps {
  isActive: string;
  cityId: string;
  cities: City[];
  onIsActiveChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onReset: () => void;
}

export function DataTableAdvancedFilters({
  isActive,
  cityId,
  cities,
  onIsActiveChange,
  onCityChange,
  onReset,
}: AdvancedFiltersProps) {
  const hasActiveFilters = isActive !== "all" || cityId !== "all";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 relative border-gray-400 cursor-pointer">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Bộ lọc</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {(isActive !== "all" ? 1 : 0) + (cityId !== "all" ? 1 : 0)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc nâng cao
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4 p-4">
          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <MapPin className="h-4 w-4 text-orange-600" />
              Thành phố
            </label>
            <Select value={cityId} onValueChange={onCityChange}>
              <SelectTrigger className="bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors">
                <SelectValue placeholder="Chọn thành phố" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thành phố</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Activity className="h-4 w-4 text-orange-600" />
              Trạng thái hoạt động
            </label>
            <Select value={isActive} onValueChange={onIsActiveChange}>
              <SelectTrigger className="bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Đang hoạt động
                  </span>
                </SelectItem>
                <SelectItem value="false">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Đã khóa
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
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
