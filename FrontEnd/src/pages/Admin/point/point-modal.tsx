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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPoint, updatePoint } from "@/redux/thunks/pointThunks";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface PointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  pointId?: string;
  onSuccess?: () => void;
}

export default function PointModal({ 
  open, 
  onOpenChange, 
  mode, 
  pointId,
  onSuccess 
}: PointModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    locationName: "",
    type: "pickup" as "pickup" | "dropoff",
    isActive: true,
  });
  const [originalData, setOriginalData] = useState({
    locationName: "",
    type: "pickup" as "pickup" | "dropoff",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch point data for edit mode
  useEffect(() => {
    if (open && mode === "edit" && pointId) {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      axios
        .get(`${import.meta.env.VITE_API_URL}/points/${pointId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          const point = response.data.data;
          const data = {
            locationName: point.locationName,
            type: point.type,
            isActive: point.isActive,
          };
          setFormData(data);
          setOriginalData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch point:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open && mode === "create") {
      // Reset form for create mode
      setFormData({
        locationName: "",
        type: "pickup",
        isActive: true,
      });
      setOriginalData({
        locationName: "",
        type: "pickup",
        isActive: true,
      });
      setErrors({});
    }
  }, [open, mode, pointId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.locationName.trim()) {
      newErrors.locationName = "Địa điểm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form data has changed
  const isDataChanged = () => {
    if (mode === "create") return true;
    return (
      formData.locationName !== originalData.locationName ||
      formData.type !== originalData.type ||
      formData.isActive !== originalData.isActive
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        await dispatch(
          createPoint({
            locationName: formData.locationName,
            type: formData.type,
            isActive: formData.isActive,
          })
        ).unwrap();
      } else if (mode === "edit" && pointId) {
        await dispatch(
          updatePoint({
            id: pointId,
            data: {
              locationName: formData.locationName,
              type: formData.type,
              isActive: formData.isActive,
            },
          })
        ).unwrap();
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save point:", error);
      setErrors({ submit: error || "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Thêm điểm đón/trả mới"}
            {mode === "edit" && "Chỉnh sửa điểm đón/trả"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Điền thông tin để tạo điểm đón/trả mới"}
            {mode === "edit" && "Cập nhật thông tin điểm đón/trả"}
          </DialogDescription>
        </DialogHeader>

        {loading && mode === "edit" ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="locationName">
                Địa điểm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="locationName"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="Nhập địa điểm"
              />
              {errors.locationName && <p className="text-sm text-red-500">{errors.locationName}</p>}
            </div>

            {/* Type Selection */}
            <div className="grid gap-2">
              <Label htmlFor="type">
                Loại điểm <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "pickup" | "dropoff") => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type" className="border-gray-300 focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary/50">
                  <SelectValue placeholder="Chọn loại điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Điểm đón</SelectItem>
                  <SelectItem value="dropoff">Điểm trả</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Is Active */}
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Trạng thái hoạt động</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isActive: checked })
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
