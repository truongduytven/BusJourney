import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  onSuccess?: () => void;
  onSubmit: (data: { startLocationId: string; endLocationId: string; distance: number }) => Promise<any>;
  isAdmin?: boolean;
}

export default function RouteModal({ 
  open, 
  onOpenChange, 
  mode,
  onSuccess,
  onSubmit,
  isAdmin = false
}: RouteModalProps) {
  const { locationList } = useSelector((state: RootState) => state.locations);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startLocationId: "",
    endLocationId: "",
    distance: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open && mode === "create") {
      setFormData({
        startLocationId: "",
        endLocationId: "",
        distance: 0,
      });
      setErrors({});
    }
  }, [open, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startLocationId) {
      newErrors.startLocationId = "Điểm đi là bắt buộc";
    }
    if (!formData.endLocationId) {
      newErrors.endLocationId = "Điểm đến là bắt buộc";
    }
    if (formData.startLocationId === formData.endLocationId) {
      newErrors.endLocationId = "Điểm đến phải khác điểm đi";
    }
    if (!formData.distance || formData.distance <= 0) {
      newErrors.distance = "Khoảng cách phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      
      toast.success(
        isAdmin 
          ? "Tạo tuyến đường thành công (Đã duyệt)" 
          : "Yêu cầu tạo tuyến đã được gửi (Chờ duyệt)"
      );
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAdmin ? "Tạo tuyến đường mới" : "Yêu cầu tạo tuyến đường"}
          </DialogTitle>
          <DialogDescription>
            {isAdmin 
              ? "Tuyến đường sẽ được tạo với trạng thái Đã duyệt" 
              : "Yêu cầu của bạn sẽ được gửi đến Admin để xét duyệt"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Start Location */}
            <div className="grid gap-2">
              <Label htmlFor="startLocationId">
                Điểm đi <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.startLocationId}
                onValueChange={(value) => {
                  setFormData({ ...formData, startLocationId: value });
                  setErrors({ ...errors, startLocationId: "" });
                }}
              >
                <SelectTrigger id="startLocationId" className={errors.startLocationId ? "border-red-500 w-full" : "w-full"}>
                  <SelectValue placeholder="Chọn điểm đi" />
                </SelectTrigger>
                <SelectContent>
                  {locationList?.locations?.map((location: any) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.startLocationId && (
                <p className="text-sm text-red-500">{errors.startLocationId}</p>
              )}
            </div>

            {/* End Location */}
            <div className="grid gap-2">
              <Label htmlFor="endLocationId">
                Điểm đến <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.endLocationId}
                onValueChange={(value) => {
                  setFormData({ ...formData, endLocationId: value });
                  setErrors({ ...errors, endLocationId: "" });
                }}
              >
                <SelectTrigger id="endLocationId" className={errors.endLocationId ? "border-red-500 w-full" : "w-full"}>
                  <SelectValue placeholder="Chọn điểm đến" />
                </SelectTrigger>
                <SelectContent>
                  {locationList?.locations?.map((location: any) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.endLocationId && (
                <p className="text-sm text-red-500">{errors.endLocationId}</p>
              )}
            </div>

            {/* Distance */}
            <div className="grid gap-2">
              <Label htmlFor="distance">
                Khoảng cách (km) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                placeholder="Nhập khoảng cách"
                value={formData.distance || ""}
                onChange={(e) => {
                  setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 });
                  setErrors({ ...errors, distance: "" });
                }}
                className={errors.distance ? "border-red-500" : ""}
              />
              {errors.distance && (
                <p className="text-sm text-red-500">{errors.distance}</p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAdmin ? "Tạo tuyến đường" : "Gửi yêu cầu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
