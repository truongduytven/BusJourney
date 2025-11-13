import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { TypeBus } from "@/types/typeBus";

// Admin columns - read-only (no actions)
export const createColumns = (): ColumnDef<TypeBus>[] => [
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
    header: "Tên loại xe",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "totalSeats",
    header: "Tổng số ghế",
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("totalSeats")}</div>
    ),
  },
  {
    id: "layout",
    header: "Cấu hình tầng 1",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.numberRows} x {row.original.numberCols}
      </div>
    ),
  },
  {
    id: "floorLayout",
    header: "Cấu hình tầng 2",
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
    header: "Loại tầng",
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
    id: "busCompany",
    header: "Nhà xe",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.busCompany?.name || "N/A"}
      </div>
    ),
  },
];
