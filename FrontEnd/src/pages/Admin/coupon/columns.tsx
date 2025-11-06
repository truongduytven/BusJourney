import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Shield, ShieldOff, Clock } from "lucide-react";
import type { Coupon } from "@/types/coupon";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { format } from "date-fns";

interface ColumnActions {
  onEdit: (couponId: string) => void;
  onToggleStatus: (couponId: string, currentStatus: string) => void;
  onExtend: (couponId: string) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Coupon>[] => [
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
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "discountType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại giảm giá" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("discountType") as string;
      return (
        <Badge
          variant="outline"
          className={
            type === "percentage"
              ? "border-blue-500 text-blue-700 bg-blue-50"
              : "border-purple-500 text-purple-700 bg-purple-50"
          }
        >
          {type === "percent" ? "Phần trăm" : "Cố định"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "discountValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giá trị giảm" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("discountType") as string;
      const value = row.getValue("discountValue") as number;
      return (
        <div className="font-medium">
          {type === "percent" 
            ? `${value}%` 
            : value.toLocaleString("vi-VN") + " đ"}
        </div>
      );
    },
  },
  {
    accessorKey: "maxUses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sử dụng" />
    ),
    cell: ({ row }) => {
      const maxUses = row.getValue("maxUses") as number;
      const usedCount = row.original.usedCount;
      const percentage = (usedCount / maxUses) * 100;
      
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="text-sm">
            {usedCount}/{maxUses}
          </div>
          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${
                percentage >= 90 
                  ? 'bg-red-500' 
                  : percentage >= 70 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "validFrom",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Từ ngày" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("validFrom"));
      return <div className="text-sm">{format(date, "dd/MM/yyyy")}</div>;
    },
  },
  {
    accessorKey: "validTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đến ngày" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("validTo"));
      return <div className="text-sm">{format(date, "dd/MM/yyyy")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const validTo = new Date(row.original.validTo);
      const isExpired = validTo < new Date();
      
      let displayStatus = status;
      let colorClass = "";
      
      if (isExpired) {
        displayStatus = "expired";
        colorClass = "bg-red-100 text-red-800 hover:bg-red-200";
      } else if (status === "active") {
        colorClass = "bg-green-100 text-green-800 hover:bg-green-200";
      } else {
        colorClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";
      }
      
      return (
        <div className="flex justify-center">
          <Badge variant="secondary" className={colorClass}>
            {displayStatus === "active" ? "Khả dụng" : 
             displayStatus === "inactive" ? "Không khả dụng" : 
             "Hết hạn"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const coupon = row.original;
      const isExpired = new Date(coupon.validTo) < new Date();

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
              onClick={() => actions.onEdit(coupon.id)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            
            {isExpired ? (
              <DropdownMenuItem
                onClick={() => actions.onExtend(coupon.id)}
                className="cursor-pointer text-orange-600"
              >
                <Clock className="mr-2 h-4 w-4" />
                Gia hạn
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => actions.onToggleStatus(coupon.id, coupon.status)}
                className="cursor-pointer"
              >
                {coupon.status === "active" ? (
                  <>
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Vô hiệu hóa
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Kích hoạt
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
