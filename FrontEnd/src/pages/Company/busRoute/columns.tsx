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
import { MoreVertical, Shield, ShieldOff, Trash2 } from "lucide-react";
import type { BusRoute } from "@/types/busRoute";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

interface ColumnActions {
  onToggleActive: (busRouteId: string, currentStatus: boolean) => void;
  onDelete: (busRouteId: string) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<BusRoute>[] => [
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
    accessorKey: "route.startLocation.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Điểm đi" />
    ),
    cell: ({ row }) => {
      const startLocation = row.original.route?.startLocation?.name;
      return (
        <div className="font-medium">{startLocation || '-'}</div>
      );
    },
  },
  {
    accessorKey: "route.endLocation.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Điểm đến" />
    ),
    cell: ({ row }) => {
      const endLocation = row.original.route?.endLocation?.name;
      return (
        <div className="font-medium">{endLocation || '-'}</div>
      );
    },
  },
  {
    accessorKey: "route.distanceKm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khoảng cách (km)" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.route?.distanceKm || 0}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean;
      return (
        <div className="flex justify-center">
          <Badge
            variant={status ? "default" : "secondary"}
            className={
              status
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          >
            {status ? "Hoạt động" : "Không hoạt động"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const busRoute = row.original;

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
              onClick={() => actions.onToggleActive(busRoute.id, busRoute.status)}
              className="cursor-pointer"
            >
              {busRoute.status ? (
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
            <DropdownMenuItem
              onClick={() => actions.onDelete(busRoute.id)}
              className="cursor-pointer text-red-600"
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
