import type { ColumnDef } from "@tanstack/react-table";
import type { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const createColumns = ({
  onDelete,
}: {
  onDelete: (review: Review) => void;
}): ColumnDef<Review>[] => [
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
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đánh giá" />
    ),
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-1 font-medium">({rating})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "commenttext",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nội dung" />
    ),
    cell: ({ row }) => {
      const comment = row.original.commenttext;
      return (
        <div className="max-w-[300px]">
          <p className="line-clamp-2 text-sm">{comment}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: "Khách hàng",
    cell: ({ row }) => {
      const user = row.original.account;
      if (!user) {
        return <span className="text-gray-400">N/A</span>;
      }
      return (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-gray-500">{user.phone}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "trip",
    header: "Chuyến đi",
    cell: ({ row }) => {
      const trip = row.original.trip;
      if (!trip) {
        return <span className="text-gray-400">N/A</span>;
      }

      const template = trip.template;
      const busRoute = trip.busRoute;
      
      let tripName = trip.id;
      if (template) {
        tripName = template.name;
      } else if (busRoute?.route?.startLocation && busRoute?.route?.endLocation) {
        tripName = `${busRoute.route.startLocation.name} → ${busRoute.route.endLocation.name}`;
      }

      return (
        <div>
          <div className="font-medium text-sm">{tripName}</div>
          <div className="text-xs text-gray-500">
            {format(new Date(trip.departureTime), "dd/MM/yyyy HH:mm", { locale: vi })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.createAt), "dd/MM/yyyy HH:mm", { locale: vi });
      } catch {
        return row.original.createAt;
      }
    },
  },
  {
    accessorKey: "isVisible",
    header: "Hiển thị",
    cell: ({ row }) => {
      const isVisible = row.original.isVisible;
      return (
        <Badge variant={isVisible ? "default" : "secondary"}>
          {isVisible ? "Hiển thị" : "Ẩn"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const review = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(review);
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
