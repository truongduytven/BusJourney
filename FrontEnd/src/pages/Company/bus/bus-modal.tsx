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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Bus } from "@/types/bus";
import type { TypeBus } from "@/types/typeBus";

const EXTENSION_OPTIONS = [
  "WiFi",
  "Điều hòa",
  "Nước uống",
  "Sạc điện thoại",
  "Tivi",
  "Nhà vệ sinh",
  "Chăn gối",
];

interface BusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialData?: Bus;
  typeBuses: TypeBus[];
  onSubmit: (payload: {
    data: {
      licensePlate: string;
      typeBusId: string;
      extensions?: string[];
      images?: string[];
    };
    images?: File[];
  }) => Promise<any>;
  onSuccess?: () => void;
}

export default function BusModal({
  open,
  onOpenChange,
  mode,
  initialData,
  typeBuses,
  onSubmit,
  onSuccess,
}: BusModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: "",
    typeBusId: "",
    extensions: [] as string[],
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setFormData({
          licensePlate: initialData.licensePlate || "",
          typeBusId: initialData.typeBusId || "",
          extensions: initialData.extensions || [],
        });
        setExistingImages(initialData.images || []);
      } else {
        setFormData({
          licensePlate: "",
          typeBusId: "",
          extensions: [],
        });
        setExistingImages([]);
      }
      setNewImages([]);
      setImagePreviews([]);
    }
  }, [open, mode, initialData]);

  const handleExtensionToggle = (extension: string) => {
    setFormData((prev) => ({
      ...prev,
      extensions: prev.extensions.includes(extension)
        ? prev.extensions.filter((e) => e !== extension)
        : [...prev.extensions, extension],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Chỉ chấp nhận file ảnh");
      return;
    }

    setNewImages((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.licensePlate.trim()) {
      toast.error("Vui lòng nhập biển số xe");
      return;
    }

    if (!formData.typeBusId) {
      toast.error("Vui lòng chọn loại xe");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        data: {
          licensePlate: formData.licensePlate,
          typeBusId: formData.typeBusId,
          extensions: formData.extensions,
          images: existingImages,
        },
        images: newImages,
      });
      toast.success(
        mode === "create" ? "Tạo xe thành công" : "Cập nhật xe thành công"
      );
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Thêm xe mới" : "Chỉnh sửa xe"}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin xe của nhà xe
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="licensePlate">Biển số xe</Label>
            <Input
              id="licensePlate"
              placeholder="Ví dụ: 51B-123.45"
              value={formData.licensePlate}
              onChange={(e) =>
                setFormData({ ...formData, licensePlate: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="typeBusId">Loại xe</Label>
            <Select
              value={formData.typeBusId}
              onValueChange={(value) =>
                setFormData({ ...formData, typeBusId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại xe" />
              </SelectTrigger>
              <SelectContent>
                {typeBuses.map((typeBus) => (
                  <SelectItem key={typeBus.id} value={typeBus.id}>
                    {typeBus.name} ({typeBus.totalSeats} ghế)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Tiện ích</Label>
            <div className="grid grid-cols-2 gap-2">
              {EXTENSION_OPTIONS.map((ext) => (
                <div key={ext} className="flex items-center space-x-2">
                  <Checkbox
                    id={ext}
                    checked={formData.extensions.includes(ext)}
                    onCheckedChange={() => handleExtensionToggle(ext)}
                  />
                  <label
                    htmlFor={ext}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {ext}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Hình ảnh</Label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-2">Hình ảnh hiện tại</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={url}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-2">Hình ảnh mới</p>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Thêm hình ảnh
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-xs text-gray-500">
              Chấp nhận file ảnh (JPG, PNG, GIF). Tối đa 5MB mỗi ảnh.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Đang xử lý..."
              : mode === "create"
              ? "Tạo mới"
              : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
