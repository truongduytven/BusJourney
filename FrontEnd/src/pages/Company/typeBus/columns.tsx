import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { TypeBus } from "@/types/typeBus";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

interface ColumnActions {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<TypeBus>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Chọn tất cả"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Chọn hàng"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên loại xe"/>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "totalSeats",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng số ghế"/>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalSeats")}</div>
    ),
  },
  {
    id: "layout",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cấu hình tầng 1"/>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.numberRows} x {row.original.numberCols}
      </div>
    ),
  },
  {
    id: "floorLayout",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cấu hình tầng 2"/>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.isFloors && row.original.numberRowsFloor && row.original.numberColsFloor
          ? `${row.original.numberRowsFloor} x ${row.original.numberColsFloor}`
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "isFloors",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại tầng"/>
    ),
    cell: ({ row }) => {
      const isFloors = row.getValue("isFloors") as boolean;
      return (
        <Badge variant={isFloors ? "default" : "secondary"}>
          {isFloors ? "2 tầng" : "1 tầng"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const typeBus = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(typeBus.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(typeBus.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
