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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreVertical, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import type { Partner } from "@/types/partner";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { format } from "date-fns";

interface ColumnActions {
  onToggleStatus: (partnerId: string, currentStatus: string) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Partner>[] => [
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
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Họ và tên" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate font-medium">
        {row.getValue("fullName")}
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Công ty" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[180px] truncate">
        {row.getValue("company")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lời nhắn" />
    ),
    cell: ({ row }) => {
      const message = row.getValue("message") as string | null;
      
      if (!message) {
        return (
          <div className="text-sm text-muted-foreground italic">
            Không có
          </div>
        );
      }
      
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 cursor-help">
                <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="max-w-[200px] truncate text-sm">
                  {message}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="max-w-[400px] p-3 bg-gray-900 text-white"
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày đăng ký" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-sm">{format(date, "dd/MM/yyyy HH:mm")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colorClass = status === "processed"
        ? "bg-green-100 text-green-800 hover:bg-green-200"
        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      
      return (
        <div className="flex justify-center">
          <Badge variant="secondary" className={colorClass}>
            {status === "processed" ? "Đã xử lí" : "Chưa xử lí"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const partner = row.original;

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
              onClick={() => actions.onToggleStatus(partner.id, partner.status)}
              className="cursor-pointer"
            >
              {partner.status === "processed" ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Chuyển chưa xử lí
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Đánh dấu đã xử lí
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
