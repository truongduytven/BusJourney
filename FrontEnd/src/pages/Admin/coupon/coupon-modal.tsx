import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCoupon, updateCoupon } from "@/redux/thunks/couponThunks";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface CouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  couponId?: string;
  onSuccess?: () => void;
}

export default function CouponModal({ 
  open, 
  onOpenChange, 
  mode, 
  couponId, 
  onSuccess 
}: CouponModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    discountType: "percentage",
    discountValue: 0,
    maxDiscountValue: 0,
    maxUses: 1,
    validFrom: "",
    validTo: "",
    status: "active",
  });
  const [originalData, setOriginalData] = useState({
    description: "",
    discountType: "percentage",
    discountValue: 0,
    maxDiscountValue: 0,
    maxUses: 1,
    validFrom: "",
    validTo: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch coupon data for edit mode
  useEffect(() => {
    if (open && mode === "edit" && couponId) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/coupon-management/${couponId}`)
        .then((response) => {
          const coupon = response.data.data;
          const data = {
            description: coupon.description,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            maxDiscountValue: coupon.maxDiscountValue || 0,
            maxUses: coupon.maxUses,
            validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
            validTo: new Date(coupon.validTo).toISOString().split('T')[0],
            status: coupon.status,
          };
          setFormData(data);
          setOriginalData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch coupon:", error);
          toast.error("Không thể tải thông tin mã giảm giá");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open && mode === "create") {
      // Reset form for create mode
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        description: "",
        discountType: "percentage",
        discountValue: 0,
        maxDiscountValue: 0,
        maxUses: 1,
        validFrom: today,
        validTo: today,
        status: "active",
      });
      setOriginalData({
        description: "",
        discountType: "percentage",
        discountValue: 0,
        maxDiscountValue: 0,
        maxUses: 1,
        validFrom: today,
        validTo: today,
        status: "active",
      });
      setErrors({});
    }
  }, [open, mode, couponId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = "Giá trị giảm phải lớn hơn 0";
    }

    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      newErrors.discountValue = "Giá trị giảm không được vượt quá 100%";
    }

    if (formData.maxUses < 1) {
      newErrors.maxUses = "Số lần sử dụng tối thiểu là 1";
    }

    if (!formData.validFrom) {
      newErrors.validFrom = "Ngày bắt đầu là bắt buộc";
    }

    if (!formData.validTo) {
      newErrors.validTo = "Ngày kết thúc là bắt buộc";
    }

    if (formData.validFrom && formData.validTo && formData.validFrom > formData.validTo) {
      newErrors.validTo = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form data has changed
  const isDataChanged = () => {
    if (mode === "create") return true;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}");
      const userId = authData.user?.id;

      if (mode === "create") {
        await dispatch(
          createCoupon({
            ...formData,
            createdBy: userId || "",
          })
        ).unwrap();
        toast.success("Tạo mã giảm giá thành công!");
      } else if (mode === "edit" && couponId) {
        await dispatch(
          updateCoupon({
            id: couponId,
            data: formData,
          })
        ).unwrap();
        toast.success("Cập nhật mã giảm giá thành công!");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save coupon:", error);
      const errorMessage = error || "Có lỗi xảy ra";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Thêm mã giảm giá mới"}
            {mode === "edit" && "Chỉnh sửa mã giảm giá"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Điền thông tin để tạo mã giảm giá mới"}
            {mode === "edit" && "Cập nhật thông tin mã giảm giá"}
          </DialogDescription>
        </DialogHeader>

        {loading && mode === "edit" ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả mã giảm giá"
                rows={3}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Discount Type */}
            <div className="grid gap-2">
              <Label htmlFor="discountType">
                Loại giảm giá <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => setFormData({ ...formData, discountType: value })}
              >
                <SelectTrigger id="discountType">
                  <SelectValue placeholder="Chọn loại giảm giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                  <SelectItem value="fixed">Cố định (VNĐ)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Value */}
            <div className="grid gap-2">
              <Label htmlFor="discountValue">
                Giá trị giảm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                placeholder={formData.discountType === "percentage" ? "Nhập % (0-100)" : "Nhập số tiền"}
              />
              {errors.discountValue && <p className="text-sm text-red-500">{errors.discountValue}</p>}
            </div>

            {/* Max Discount Value (only for percentage) */}
            {formData.discountType === "percentage" && (
              <div className="grid gap-2">
                <Label htmlFor="maxDiscountValue">
                  Giảm tối đa (VNĐ)
                </Label>
                <Input
                  id="maxDiscountValue"
                  type="number"
                  value={formData.maxDiscountValue}
                  onChange={(e) => setFormData({ ...formData, maxDiscountValue: Number(e.target.value) })}
                  placeholder="Không giới hạn nếu để 0"
                />
              </div>
            )}

            {/* Max Uses */}
            <div className="grid gap-2">
              <Label htmlFor="maxUses">
                Số lần sử dụng tối đa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="maxUses"
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
                placeholder="Nhập số lần sử dụng"
                min={1}
              />
              {errors.maxUses && <p className="text-sm text-red-500">{errors.maxUses}</p>}
            </div>

            {/* Valid From */}
            <div className="grid gap-2">
              <Label htmlFor="validFrom">
                Từ ngày <span className="text-red-500">*</span>
              </Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              />
              {errors.validFrom && <p className="text-sm text-red-500">{errors.validFrom}</p>}
            </div>

            {/* Valid To */}
            <div className="grid gap-2">
              <Label htmlFor="validTo">
                Đến ngày <span className="text-red-500">*</span>
              </Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
              />
              {errors.validTo && <p className="text-sm text-red-500">{errors.validTo}</p>}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Trạng thái hoạt động</Label>
              <Switch
                id="status"
                checked={formData.status === "active"}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, status: checked ? "active" : "inactive" })
                }
              />
            </div>

            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || (mode === "edit" && !isDataChanged())}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
