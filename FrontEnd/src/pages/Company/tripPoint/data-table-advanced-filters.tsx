import { SlidersHorizontal, Activity, X, Navigation, Bus } from "lucide-react";
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { Trip } from "@/types/companyTripPoint";

interface DataTableAdvancedFiltersProps {
  isActive: string;
  type: string;
  tripId: string;
  trips: Trip[];
  onIsActiveChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onTripChange: (value: string) => void;
  onReset: () => void;
}

export function DataTableAdvancedFilters({
  isActive,
  type,
  tripId,
  trips,
  onIsActiveChange,
  onTypeChange,
  onTripChange,
  onReset,
}: DataTableAdvancedFiltersProps) {
  const hasActiveFilters = isActive !== "all" || type !== "all" || tripId !== "all";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 relative border-gray-400 cursor-pointer">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Bộ lọc</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {(isActive !== "all" ? 1 : 0) + (type !== "all" ? 1 : 0) + (tripId !== "all" ? 1 : 0)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px]">
        <DropdownMenuLabel className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc nâng cao
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Bus className="h-4 w-4 text-orange-600" />
              Chuyến đi
            </label>
            <Select value={tripId} onValueChange={onTripChange}>
              <SelectTrigger className="bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors">
                <SelectValue placeholder="Chọn chuyến đi" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tất cả chuyến</SelectItem>
                {trips.slice(0, 100).map((trip) => {
                  const label = trip.template?.name || 
                    (trip.busRoute?.route?.startLocation?.name && trip.busRoute?.route?.endLocation?.name
                      ? `${trip.busRoute.route.startLocation.name} → ${trip.busRoute.route.endLocation.name}`
                      : trip.id);
                  const date = format(new Date(trip.departureTime), "dd/MM HH:mm", { locale: vi });
                  return (
                    <SelectItem key={trip.id} value={trip.id}>
                      {label} - {date}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <Navigation className="h-4 w-4 text-orange-600" />
              Loại điểm
            </label>
            <Select value={type} onValueChange={onTypeChange}>
              <SelectTrigger className="bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors">
                <SelectValue placeholder="Chọn loại điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pickup">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    Điểm đón
                  </span>
                </SelectItem>
                <SelectItem value="dropoff">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    Điểm trả
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                    Đã tạm dừng
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
