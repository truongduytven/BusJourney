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
import { MoreVertical, Edit, Shield, ShieldOff } from "lucide-react";
import type { Point } from "@/types/point";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

interface ColumnActions {
  onEdit: (pointId: string) => void;
  onToggleActive: (pointId: string, currentStatus: boolean) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Point>[] => [
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
    accessorKey: "locationName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên địa điểm" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("locationName")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại điểm" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="flex justify-center">
          <Badge
            variant={type === "pickup" ? "default" : "secondary"}
            className={
              type === "pickup"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }
          >
            {type === "pickup" ? "Điểm đón" : "Điểm trả"}
          </Badge>
        </div>
      );
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
            variant={isActive ? "default" : "secondary"}
            className={
              isActive
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          >
            {isActive ? "Hoạt động" : "Không hoạt động"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const point = row.original;

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
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={() => actions.onEdit(point.id)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => actions.onToggleActive(point.id, point.isActive)}
              className="cursor-pointer"
            >
              {point.isActive ? (
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
