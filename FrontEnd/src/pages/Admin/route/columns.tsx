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
import { MoreVertical, CheckCircle, XCircle } from "lucide-react";
import type { Route } from "@/types/route";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";

interface ColumnActions {
  onApprove: (routeId: string) => void;
  onReject: (routeId: string) => void;
  isAdmin?: boolean;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Route>[] => [
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
    accessorKey: "startLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Điểm đi" />
    ),
    cell: ({ row }) => {
      const startLocation = row.original.startLocation;
      return (
        <div className="font-medium">{startLocation?.name || '-'}</div>
      );
    },
  },
  {
    accessorKey: "endLocation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Điểm đến" />
    ),
    cell: ({ row }) => {
      const endLocation = row.original.endLocation;
      return (
        <div className="font-medium">{endLocation?.name || '-'}</div>
      );
    },
  },
  {
    accessorKey: "distanceKm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khoảng cách (km)" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("distanceKm")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string || 'Pending';
      return (
        <div className="flex justify-center">
          <Badge
            variant={status === "Approved" ? "default" : status === "Rejected" ? "destructive" : "secondary"}
            className={
              status === "Approved"
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : status === "Rejected"
                ? "bg-red-100 text-red-800 hover:bg-red-200"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }
          >
            {status === "Approved" ? "Đã duyệt" : status === "Rejected" ? "Từ chối" : "Chờ duyệt"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const route = row.original;
      const status = route.status || 'Pending';

      // Nếu không phải Admin thì không hiển thị actions
      if (!actions.isAdmin) {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {status === 'Pending' && (
              <>
                <DropdownMenuItem
                  onClick={() => actions.onApprove(route.id)}
                  className="text-green-600 cursor-pointer"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Duyệt tuyến
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => actions.onReject(route.id)}
                  className="text-red-600 cursor-pointer"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Từ chối
                </DropdownMenuItem>
              </>
            )}
            {status === 'Rejected' && (
              <DropdownMenuItem
                onClick={() => actions.onApprove(route.id)}
                className="text-green-600 cursor-pointer"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Duyệt tuyến
              </DropdownMenuItem>
            )}
            {status === 'Approved' && (
              <DropdownMenuItem
                onClick={() => actions.onReject(route.id)}
                className="text-red-600 cursor-pointer"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Từ chối
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
