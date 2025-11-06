import { useState } from "react";
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
import { extendCoupon } from "@/redux/thunks/couponThunks";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExtendCouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponId: string;
  currentValidTo: string;
  onSuccess?: () => void;
}

export default function ExtendCouponModal({ 
  open, 
  onOpenChange, 
  couponId,
  currentValidTo,
  onSuccess 
}: ExtendCouponModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const [loading, setLoading] = useState(false);
  const [newValidTo, setNewValidTo] = useState("");
  const [error, setError] = useState("");

  const validateDate = () => {
    if (!newValidTo) {
      setError("Vui lòng chọn ngày hết hạn mới");
      return false;
    }

    const selectedDate = new Date(newValidTo);
    const now = new Date();
    const currentExpiry = new Date(currentValidTo);

    if (selectedDate <= now) {
      setError("Ngày hết hạn mới phải sau ngày hôm nay");
      return false;
    }

    if (selectedDate <= currentExpiry) {
      setError("Ngày hết hạn mới phải sau ngày hết hạn hiện tại");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateDate()) {
      return;
    }

    setLoading(true);

    try {
      await dispatch(extendCoupon({ 
        id: couponId, 
        validTo: newValidTo 
      })).unwrap();

      toast.success("Gia hạn mã giảm giá thành công!");
      onSuccess?.();
      onOpenChange(false);
      setNewValidTo("");
    } catch (error: any) {
      const errorMessage = error || "Có lỗi xảy ra khi gia hạn";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNewValidTo("");
      setError("");
    }
    onOpenChange(open);
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gia hạn mã giảm giá</DialogTitle>
          <DialogDescription>
            Chọn ngày hết hạn mới cho mã giảm giá này
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Current expiry info */}
          <div className="grid gap-2">
            <Label>Ngày hết hạn hiện tại</Label>
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {new Date(currentValidTo).toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* New expiry date */}
          <div className="grid gap-2">
            <Label htmlFor="newValidTo">
              Ngày hết hạn mới <span className="text-red-500">*</span>
            </Label>
            <Input
              id="newValidTo"
              type="date"
              value={newValidTo}
              onChange={(e) => setNewValidTo(e.target.value)}
              min={minDate}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gia hạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
