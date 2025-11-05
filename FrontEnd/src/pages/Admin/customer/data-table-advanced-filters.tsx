import { SlidersHorizontal, UserCog, ShieldCheck, Activity, Mail, X, Users, Shield, Car, Briefcase } from "lucide-react";
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

interface AdvancedFiltersProps {
  selectedRole: string;
  accountType: string;
  isVerified: string;
  isActive: string;
  onRoleChange: (value: string) => void;
  onAccountTypeChange: (value: string) => void;
  onIsVerifiedChange: (value: string) => void;
  onIsActiveChange: (value: string) => void;
  onReset: () => void;
}

export function DataTableAdvancedFilters({
  selectedRole,
  accountType,
  isVerified,
  isActive,
  onRoleChange,
  onAccountTypeChange,
  onIsVerifiedChange,
  onIsActiveChange,
  onReset,
}: AdvancedFiltersProps) {
  const hasActiveFilters = selectedRole !== "all" || accountType !== "all" || isVerified !== "all" || isActive !== "all";
  const activeFilterCount = [
    selectedRole !== "all",
    accountType !== "all",
    isVerified !== "all",
    isActive !== "all"
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
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc nâng cao
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4 p-4">
          {/* Role Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <UserCog className="h-4 w-4 text-violet-600" />
              Vai trò
            </label>
            <Select value={selectedRole} onValueChange={onRoleChange}>
              <SelectTrigger className="bg-violet-50 border-violet-200 hover:bg-violet-100 transition-colors">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    Tất cả vai trò
                  </span>
                </SelectItem>
                <SelectItem value="customer">
                  <span className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-blue-600" />
                    Khách hàng
                  </span>
                </SelectItem>
                <SelectItem value="admin">
                  <span className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-purple-600" />
                    Quản trị viên
                  </span>
                </SelectItem>
                <SelectItem value="company">
                  <span className="flex items-center gap-2">
                    <Car className="h-3.5 w-3.5 text-orange-600" />
                    Nhà xe
                  </span>
                </SelectItem>
                <SelectItem value="staff">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-green-600" />
                    Nhân viên
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <UserCog className="h-4 w-4 text-blue-600" />
              Loại tài khoản
            </label>
            <Select value={accountType} onValueChange={onAccountTypeChange}>
              <SelectTrigger className="bg-slate-50 border-slate-200 hover:bg-slate-100 transition-colors">
                <SelectValue placeholder="Chọn loại tài khoản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    Tất cả loại tài khoản
                  </span>
                </SelectItem>
                <SelectItem value="local">
                  <span className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-600" />
                    Tài khoản thường
                  </span>
                </SelectItem>
                <SelectItem value="google">
                  <span className="flex items-center gap-2">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="h-3.5 w-3.5" />
                    Google
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Verification Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-slate-700">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Trạng thái xác thực
            </label>
            <Select value={isVerified} onValueChange={onIsVerifiedChange}>
              <SelectTrigger className="bg-green-50 border-green-200 hover:bg-green-100 transition-colors">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Đã xác thực
                  </span>
                </SelectItem>
                <SelectItem value="false">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Chưa xác thực
                  </span>
                </SelectItem>
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
