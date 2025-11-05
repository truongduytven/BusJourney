import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserDataResponse } from "@/types/user";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BookUser,
  Copy,
  MoreVertical,
  UserLock,
  Mail,
  Shield,
  Users,
  Car,
  Briefcase,
  UserCheck,
  Edit,
} from "lucide-react";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { formatNumberPhone } from "@/utils";
import { toast } from "sonner";

interface ColumnActions {
  onView: (userId: string) => void;
  onEdit: (userId: string) => void;
  onToggleActive: (userId: string, isActive: boolean) => void;
}

export const createColumns = (
  actions: ColumnActions
): ColumnDef<UserDataResponse>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên người dùng" />
    ),
  },
  {
    accessorKey: "avatar",
    header: "Ảnh đại diện",
    cell: ({ row }) => {
      const avatarUrl = row.original.avatar;
      return (
        <div className="flex justify-center items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold">
              N/A
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => formatNumberPhone(row.original.phone) || "N/A",
  },
  {
    accessorKey: "roles",
    header: "Vai trò",
    cell: ({ row }) => {
      const roleName = row.original.roles?.name || "N/A";
      const roleDisplay =
        {
          customer: "Khách hàng",
          admin: "Quản trị viên",
          company: "Nhà xe",
          staff: "Nhân viên",
        }[roleName] || roleName;

      const roleConfig: Record<
        string,
        { bg: string; text: string; icon: React.ReactNode }
      > = {
        customer: {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: <Users className="h-3 w-3" />,
        },
        admin: {
          bg: "bg-purple-100",
          text: "text-purple-800",
          icon: <Shield className="h-3 w-3" />,
        },
        company: {
          bg: "bg-orange-100",
          text: "text-orange-800",
          icon: <Car className="h-3 w-3" />,
        },
        staff: {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: <Briefcase className="h-3 w-3" />,
        },
      };

      const config = roleConfig[roleName] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: null,
      };

      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
          {config.icon}
          {roleDisplay}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại tài khoản",
    cell: ({ row }) => {
      const type = row.original.type;

      if (!type) {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            N/A
          </span>
        );
      }

      const typeDisplay =
        {
          normal: "Tài khoản thường",
          google: "Google",
        }[type] || type;

      const icon =
        type === "google" ? (
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="h-3 w-3"
          />
        ) : (
          <Mail className="h-3 w-3" />
        );

      const colorClass =
        type === "google"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-slate-100 text-slate-700 border border-slate-200";

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
        >
          {icon}
          {typeDisplay}
        </span>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Xác thực",
    cell: ({ row }) => {
      const isVerified = row.original.isVerified;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isVerified ? "✓ Đã xác thực" : "⏳ Chưa xác thực"}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "● Hoạt động" : "● Đã khóa"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const user = row.original;
      const isActive = user.isActive;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-slate-100 data-[state=open]:bg-slate-100"
            >
              <span className="sr-only">Mở menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel className="font-semibold text-slate-700">
              Thao tác
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.id);
                toast.success("Đã sao chép ID người dùng vào clipboard!");
              }}
              className="cursor-pointer group"
            >
              <Copy className="mr-2 h-4 w-4 text-slate-500 group-hover:text-blue-600" />
              <span>Sao chép ID</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => actions.onView(user.id)}
              className="cursor-pointer group"
            >
              <BookUser className="mr-2 h-4 w-4 text-slate-500 group-hover:text-green-600" />
              <span>Xem chi tiết</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => actions.onEdit(user.id)}
              className="cursor-pointer group"
            >
              <Edit className="mr-2 h-4 w-4 text-slate-500 group-hover:text-amber-600" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => actions.onToggleActive(user.id, isActive)}
              className="cursor-pointer group"
            >
              {isActive ? (
                <>
                  <UserLock className="mr-2 h-4 w-4 text-slate-500 group-hover:text-red-600" />
                  <span className="group-hover:text-red-600">
                    Khóa tài khoản
                  </span>
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4 text-slate-500 group-hover:text-green-600" />
                  <span className="group-hover:text-green-600">
                    Mở khóa tài khoản
                  </span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
