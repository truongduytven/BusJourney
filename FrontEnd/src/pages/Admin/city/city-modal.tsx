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
import { createCity, updateCity } from "@/redux/thunks/cityThunks";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface CityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  cityId?: string;
  onSuccess?: () => void;
}

export function CityModal({ open, onOpenChange, mode, cityId, onSuccess }: CityModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch city data for edit mode
  useEffect(() => {
    if (open && mode === "edit" && cityId) {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      axios
        .get(`${import.meta.env.VITE_API_URL}/cities/${cityId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          const city = response.data.data;
          setFormData({
            name: city.name,
            isActive: city.isActive,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch city:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open && mode === "create") {
      // Reset form for create mode
      setFormData({
        name: "",
        isActive: true,
      });
      setErrors({});
    }
  }, [open, mode, cityId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên thành phố là bắt buộc";
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
      if (mode === "create") {
        await dispatch(
          createCity({
            name: formData.name,
            isActive: formData.isActive,
          })
        ).unwrap();
      } else if (mode === "edit" && cityId) {
        await dispatch(
          updateCity({
            id: cityId,
            data: {
              name: formData.name,
              isActive: formData.isActive,
            },
          })
        ).unwrap();
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save city:", error);
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
            {mode === "create" && "Thêm thành phố mới"}
            {mode === "edit" && "Chỉnh sửa thành phố"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Điền thông tin để tạo thành phố mới"}
            {mode === "edit" && "Cập nhật thông tin thành phố"}
          </DialogDescription>
        </DialogHeader>

        {loading && mode === "edit" ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Tên thành phố <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên thành phố"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Tạo mới" : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
