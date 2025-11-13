import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, ImageIcon } from "lucide-react";
import type { Bus } from "@/types/bus";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";

interface ColumnActions {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewImages: (id: string) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
  onViewImages,
}: ColumnActions): ColumnDef<Bus>[] => [
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
    accessorKey: "licensePlate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Biển số xe"/>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("licensePlate")}</div>
    ),
  },
  {
    id: "typeBus",
    accessorKey: "typeBus.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại xe"/>
    ),
    cell: ({ row }) => (
      <div>{row.original.type_buses?.name || "N/A"}</div>
    ),
  },
  {
    id: "numFloors",
    accessorKey: "typeBus.isFloors",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại xe"/>
    ),
    cell: ({ row }) => (
      <div>{row.original.type_buses?.isFloors ? "2 tầng" : "1 tầng"}</div>
    ),
  },
  {
    id: "extensions",
    accessorKey: "extensions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại xe"/>
    ),
    cell: ({ row }) => (
      <div>{row.original.extensions?.join(", ")}</div>
    ),
  },
  {
    id: "totalSeats",
    accessorKey: "typeBus.totalSeats",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số ghế"/>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.type_buses?.totalSeats || "N/A"}</div>
    ),
  },
  {
    id: "images",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const bus = row.original;
      const imageCount = bus.images?.length || 0;
      
      return (
        <div className="flex justify-center">
          <Badge
            variant={imageCount > 0 ? "default" : "secondary"}
            className="cursor-pointer hover:opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              onViewImages(bus.id);
            }}
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            {imageCount > 0 ? `${imageCount} ảnh` : "Chưa có"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const bus = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(bus.id);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(bus.id);
              }}
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
