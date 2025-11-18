import type { ColumnDef } from "@tanstack/react-table";
import type { TripPoint } from "@/types/companyTripPoint";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Pencil, Trash2, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const createColumns = ({
  onEdit,
  onDelete,
  onToggleActive,
}: {
  onEdit: (tripPoint: TripPoint) => void;
  onDelete: (tripPoint: TripPoint) => void;
  onToggleActive: (tripPoint: TripPoint) => void;
}): ColumnDef<TripPoint>[] => [
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
    accessorKey: "trip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chuyến đi" />
    ),
    cell: ({ row }) => {
      const trip = row.original.trip;
      const busRoute = trip?.busRoute;
      const template = trip?.template;
      
      if (template) {
        return <div className="font-medium">{template.name}</div>;
      }
      
      if (busRoute?.route?.startLocation && busRoute?.route?.endLocation) {
        return (
          <div className="font-medium">
            {busRoute.route.startLocation.name} → {busRoute.route.endLocation.name}
          </div>
        );
      }
      
      return <span className="text-gray-400">N/A</span>;
    },
  },
  {
    accessorKey: "point",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Điểm đón/trả" />
    ),
    cell: ({ row }) => {
      const point = row.original.point;
      if (!point) {
        return <span className="text-gray-400">N/A</span>;
      }
      return (
        <div>
          <div className="font-medium">{point.locationName}</div>
          <Badge variant={point.type === 'pickup' ? 'default' : 'secondary'} className="text-xs mt-1">
            {point.type === 'pickup' ? 'Đón' : 'Trả'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thời gian" />
    ),
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.time), "dd/MM/yyyy HH:mm", { locale: vi });
      } catch {
        return row.original.time;
      }
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      return (
        <Badge className={row.original.isActive ? "bg-green-500" : "bg-red-500"}>
          {row.original.isActive ? "Hoạt động" : "Tạm dừng"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const tripPoint = row.original;
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
              onEdit(tripPoint);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className={tripPoint.isActive ? "text-red-600" : "text-green-600"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive(tripPoint);
              }}
            >
              {tripPoint.isActive ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Tạm dừng
                </>
              ) : (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Kích hoạt
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(tripPoint);
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
