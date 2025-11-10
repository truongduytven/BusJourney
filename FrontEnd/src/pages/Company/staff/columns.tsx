import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Shield, ShieldOff } from "lucide-react";
import type { Staff } from "@/types/staff";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { format } from "date-fns";
import { formatNumberPhone } from "@/utils";

interface ColumnActions {
  onEdit: (staffId: string) => void;
  onToggleStatus: (staffId: string, currentStatus: boolean) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Staff>[] => [
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
      <DataTableColumnHeader column={column} title="Nhân viên" />
    ),
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex items-center gap-3 justify-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={staff.avatar} alt={staff.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {staff.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{staff.name}</div>
            {staff.isVerified && (
              <Badge variant="outline" className="text-xs border-green-500 text-green-700 bg-green-50 mt-1">
                Đã xác thực
              </Badge>
            )}
          </div>
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
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return phone ? (
        <div className="text-center text-sm">
          <span>{formatNumberPhone(phone)}</span>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">Chưa có</span>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Địa chỉ" />
    ),
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return address ? (
        <div className="max-w-[200px] truncate text-sm">{address}</div>
      ) : (
        <span className="text-gray-400 text-sm">Chưa có</span>
      );
    },
  },
  {
    accessorKey: "createAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createAt"));
      return <div className="text-sm">{format(date, "dd/MM/yyyy HH:mm")}</div>;
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      
      return (
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            className={
              isActive
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          >
            {isActive ? "Hoạt động" : "Tạm khóa"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const staff = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem
              onClick={() => actions.onEdit(staff.id)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => actions.onToggleStatus(staff.id, staff.isActive)}
              className="cursor-pointer"
            >
              {staff.isActive ? (
                <>
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Khóa tài khoản
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Mở khóa
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
