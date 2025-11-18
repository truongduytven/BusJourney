import type { ColumnDef } from "@tanstack/react-table";
import type { Trip } from "@/types/companyTrip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Pencil, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const createColumns = (
  onEdit: (trip: Trip) => void,
  onToggleStatus: (trip: Trip) => void
): ColumnDef<Trip>[] => [
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
    accessorKey: "route",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tuyến đường" />
    ),
    cell: ({ row }) => {
      const busRoute = row.original.busRoute;
      const template = row.original.template;
      
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
    accessorKey: "buses",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Xe" />
    ),
    cell: ({ row }) => {
      const bus = row.original.buses;
      if (!bus) {
        return <span className="text-gray-400">N/A</span>;
      }
      return (
        <div>
          <div className="font-medium">{bus.licensePlate}</div>
          {bus.type_buses && (
            <div className="text-sm text-gray-500">{bus.type_buses.name}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "departureTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giờ đi" />
    ),
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.departureTime), "dd/MM/yyyy HH:mm");
      } catch {
        return row.original.departureTime;
      }
    },
  },
  {
    accessorKey: "arrivalTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giờ đến" />
    ),
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.arrivalTime), "dd/MM/yyyy HH:mm");
      } catch {
        return row.original.arrivalTime;
      }
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giá vé" />
    ),
    cell: ({ row }) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(row.original.price);
    },
  },
  {
    accessorKey: "availableSeats",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ghế trống" />
    ),
    cell: ({ row }) => {
      const availableSeats = row.original.availableSeats ?? 0;
      const totalSeats = row.original.totalSeats ?? 0;
      const bookedSeats = row.original.bookedSeats ?? 0;
      
      let colorClass = "text-green-600";
      if (availableSeats === 0) {
        colorClass = "text-red-600";
      } else if (availableSeats / totalSeats < 0.3) {
        colorClass = "text-yellow-600";
      }
      
      return (
        <div className={`font-medium ${colorClass}`}>
          {availableSeats} / {totalSeats}
          <div className="text-xs text-gray-500">
            Đã đặt: {bookedSeats}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      return (
        <Badge className={row.original.status ? "bg-green-500" : "bg-red-500"}>
          {row.original.status ? "Hoạt động" : "Tạm dừng"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const trip = row.original;
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
              onEdit(trip);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className={trip.status ? "text-red-600" : "text-green-600"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(trip);
              }}
            >
              {trip.status ? (
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
