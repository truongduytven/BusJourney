import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserDataResponse } from "@/types/user";
import type { ColumnDef } from "@tanstack/react-table";
import { BookUser, Copy, MoreHorizontal, UserLock } from "lucide-react";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

export const columns: ColumnDef<UserDataResponse>[] = [
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
    header: "Tên khách hàng",
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
              className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold">
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
    header: "Số điện thoại",
    cell: ({ row }) => row.original.phone || "N/A",
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => row.original.address || "N/A",
  },
  {
    accessorKey: "type",
    header: "Loại tài khoản",
    cell: ({ row }) => row.original.type || "N/A",
  },
  {
    accessorKey: "isVerified",
    header: "Xác thực",
    cell: ({ row }) =>
      row.original.isVerified ? "Đã xác thực" : "Chưa xác thực",
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => (row.original.isActive ? "Hoạt động" : "Đã khóa"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
              className="cursor-pointer"
            >
              Sao chép ID người dùng{" "}
              <DropdownMenuShortcut>
                <Copy className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Xem chi tiết{" "}
              <DropdownMenuShortcut>
                <BookUser className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Khóa tài khoản{" "}
              <DropdownMenuShortcut>
                <UserLock className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
