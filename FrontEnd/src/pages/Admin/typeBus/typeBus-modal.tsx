import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { TypeBusCreateRequest, TypeBusUpdateRequest } from "@/types/typeBus";

interface TypeBusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: TypeBusUpdateRequest & { id?: string };
  onSubmit: (data: TypeBusCreateRequest | TypeBusUpdateRequest) => Promise<any>;
  onSuccess?: () => void;
}

export default function TypeBusModal({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  onSuccess,
}: TypeBusModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalSeats: 40,
    numberRows: 10,
    numberCols: 4,
    isFloors: false,
    numberRowsFloor: 0,
    numberColsFloor: 0,
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData.name || "",
          totalSeats: initialData.totalSeats || 40,
          numberRows: initialData.numberRows || 10,
          numberCols: initialData.numberCols || 4,
          isFloors: initialData.isFloors || false,
          numberRowsFloor: initialData.numberRowsFloor || 0,
          numberColsFloor: initialData.numberColsFloor || 0,
        });
      } else {
        setFormData({
          name: "",
          totalSeats: 40,
          numberRows: 10,
          numberCols: 4,
          isFloors: false,
          numberRowsFloor: 0,
          numberColsFloor: 0,
        });
      }
    }
  }, [open, mode, initialData]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên loại xe");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success(mode === "create" ? "Tạo loại xe thành công" : "Cập nhật loại xe thành công");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm loại xe mới" : "Chỉnh sửa loại xe"}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin loại xe. Tổng số ghế = (Hàng × Cột tầng 1) + (Hàng × Cột tầng 2)
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên loại xe <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: Giường nằm 40 chỗ"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="totalSeats">Tổng số ghế</Label>
              <Input
                id="totalSeats"
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Cấu hình tầng 1</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numberRows">Số hàng</Label>
                <Input
                  id="numberRows"
                  type="number"
                  value={formData.numberRows}
                  onChange={(e) => setFormData({ ...formData, numberRows: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numberCols">Số cột</Label>
                <Input
                  id="numberCols"
                  type="number"
                  value={formData.numberCols}
                  onChange={(e) => setFormData({ ...formData, numberCols: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFloors"
              checked={formData.isFloors}
              onCheckedChange={(checked) => setFormData({ ...formData, isFloors: checked as boolean })}
            />
            <Label htmlFor="isFloors" className="cursor-pointer">Xe 2 tầng</Label>
          </div>

          {formData.isFloors && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Cấu hình tầng 2</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="numberRowsFloor">Số hàng</Label>
                  <Input
                    id="numberRowsFloor"
                    type="number"
                    value={formData.numberRowsFloor}
                    onChange={(e) => setFormData({ ...formData, numberRowsFloor: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="numberColsFloor">Số cột</Label>
                  <Input
                    id="numberColsFloor"
                    type="number"
                    value={formData.numberColsFloor}
                    onChange={(e) => setFormData({ ...formData, numberColsFloor: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
