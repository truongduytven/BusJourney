import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
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
import { createLocation, updateLocation } from "@/redux/thunks/locationThunks";
import { fetchCityList } from "@/redux/thunks/cityThunks";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  locationId?: string;
  onSuccess?: () => void;
}

export default function LocationModal({ 
  open, 
  onOpenChange, 
  mode, 
  locationId, 
  onSuccess 
}: LocationModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cityList } = useSelector((state: RootState) => state.cities);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cityId: "",
    isActive: true,
  });
  const [originalData, setOriginalData] = useState({
    name: "",
    cityId: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch cities list for dropdown
  useEffect(() => {
    if (open) {
      dispatch(fetchCityList({ pageSize: 100, pageNumber: 1 }));
    }
  }, [open, dispatch]);

  // Fetch location data for edit mode
  useEffect(() => {
    if (open && mode === "edit" && locationId) {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      axios
        .get(`${import.meta.env.VITE_API_URL}/locations/${locationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          const location = response.data.data;
          const data = {
            name: location.name,
            cityId: location.cityId,
            isActive: location.isActive,
          };
          setFormData(data);
          setOriginalData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch location:", error);
          toast.error("Không thể tải thông tin địa điểm");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open && mode === "create") {
      // Reset form for create mode
      setFormData({
        name: "",
        cityId: "",
        isActive: true,
      });
      setOriginalData({
        name: "",
        cityId: "",
        isActive: true,
      });
      setErrors({});
    }
  }, [open, mode, locationId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên địa điểm là bắt buộc";
    }

    if (!formData.cityId) {
      newErrors.cityId = "Vui lòng chọn thành phố";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form data has changed
  const isDataChanged = () => {
    if (mode === "create") return true;
    return (
      formData.name !== originalData.name ||
      formData.cityId !== originalData.cityId ||
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
          createLocation({
            name: formData.name,
            cityId: formData.cityId,
            isActive: formData.isActive,
          })
        ).unwrap();
        toast.success("Tạo địa điểm thành công!");
      } else if (mode === "edit" && locationId) {
        await dispatch(
          updateLocation({
            id: locationId,
            data: {
              name: formData.name,
              cityId: formData.cityId,
              isActive: formData.isActive,
            },
          })
        ).unwrap();
        toast.success("Cập nhật địa điểm thành công!");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save location:", error);
      const errorMessage = error || "Có lỗi xảy ra";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Thêm địa điểm mới"}
            {mode === "edit" && "Chỉnh sửa địa điểm"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Điền thông tin để tạo địa điểm mới"}
            {mode === "edit" && "Cập nhật thông tin địa điểm"}
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
                Tên địa điểm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên địa điểm"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* City Selection */}
            <div className="grid gap-2">
              <Label htmlFor="cityId">
                Thành phố <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.cityId}
                onValueChange={(value) => setFormData({ ...formData, cityId: value })}
              >
                <SelectTrigger id="cityId" className="border-gray-300 focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary/50">
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {cityList?.cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cityId && <p className="text-sm text-red-500">{errors.cityId}</p>}
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
