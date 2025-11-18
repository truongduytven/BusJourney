import type { ColumnDef } from "@tanstack/react-table";
import type { Ticket } from "@/types/ticket";
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
  onToggleStatus,
}: {
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onToggleStatus: (ticket: Ticket) => void;
}): ColumnDef<Ticket>[] => [
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
    accessorKey: "ticketCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã vé" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.ticketCode}</div>;
    },
  },
  {
    accessorKey: "seatCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ghế" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.seatCode}</div>;
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
          <div className="font-medium">{tripName}</div>
          <div className="text-xs text-gray-500">
            {format(new Date(trip.departureTime), "dd/MM/yyyy HH:mm", { locale: vi })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày mua" />
    ),
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.purchaseDate), "dd/MM/yyyy HH:mm", { locale: vi });
      } catch {
        return row.original.purchaseDate;
      }
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      let label = status;

      switch (status) {
        case "confirmed":
          variant = "default";
          label = "Đã xác nhận";
          break;
        case "cancelled":
          variant = "destructive";
          label = "Đã hủy";
          break;
        case "checked_in":
          variant = "secondary";
          label = "Đã check-in";
          break;
        case "completed":
          variant = "outline";
          label = "Hoàn thành";
          break;
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const ticket = row.original;
      const isCancelled = ticket.status === "cancelled";

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
              onEdit(ticket);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className={isCancelled ? "text-green-600" : "text-red-600"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(ticket);
              }}
            >
              {isCancelled ? (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Kích hoạt
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Hủy vé
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(ticket);
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
