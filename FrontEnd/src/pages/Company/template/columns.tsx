import type { ColumnDef } from "@tanstack/react-table";
import type { Template } from "@/types/companyTemplate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Pencil, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const createColumns = (
  onEdit: (template: Template) => void,
  onToggleActive: (template: Template) => void
): ColumnDef<Template>[] => [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên mẫu" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "busRoute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tuyến đường" />
    ),
    cell: ({ row }) => {
      const busRoute = row.original.busRoute;
      if (!busRoute?.route?.startLocation || !busRoute?.route?.endLocation) {
        return <span className="text-gray-400">N/A</span>;
      }
      
      return (
        <div className="font-medium">
          {busRoute.route.startLocation.name} → {busRoute.route.endLocation.name}
        </div>
      );
    },
  },
  {
    accessorKey: "bus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Xe sử dụng" />
    ),
    cell: ({ row }) => {
      const bus = row.original.bus;
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
    accessorKey: "is_active",
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm");
      } catch {
        return row.original.createdAt;
      }
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const template = row.original;
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
              onEdit(template);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className={template.isActive ? "text-red-600" : "text-green-600"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive(template);
              }}
            >
              {template.isActive ? (
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
