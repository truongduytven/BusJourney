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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchRoles, createUser, updateUser, getUserById } from "@/redux/thunks/userThunks";
import { Loader2, Camera, X } from "lucide-react";
import type { UserDataResponse } from "@/types/user";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  userId?: string;
  onSuccess?: () => void;
}

export function UserModal({ open, onOpenChange, mode, userId, onSuccess }: UserModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { roles } = useSelector((state: RootState) => state.users);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    roleId: "",
    isVerified: false,
    isActive: true,
  });

  // Avatar state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch roles when modal opens
  useEffect(() => {
    if (open) {
      dispatch(fetchRoles());
    }
  }, [open, dispatch]);

  // Fetch user data for edit/view mode
  useEffect(() => {
    if (open && (mode === "edit" || mode === "view") && userId) {
      setLoading(true);
      dispatch(getUserById(userId))
        .unwrap()
        .then((user: UserDataResponse) => {
          setFormData({
            name: user.name,
            email: user.email,
            password: "",
            phone: user.phone || "",
            roleId: user.roles?.id || "",
            isVerified: user.isVerified,
            isActive: user.isActive,
          });
          // Set current avatar URL
          setCurrentAvatarUrl(user.avatar || "");
          setAvatarPreview("");
          setAvatarFile(null);
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open && mode === "create") {
      // Reset form for create mode
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        roleId: "",
        isVerified: false,
        isActive: true,
      });
      setCurrentAvatarUrl("");
      setAvatarPreview("");
      setAvatarFile(null);
      setErrors({});
    }
  }, [open, mode, userId, dispatch]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    if (mode === "create" && formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Vai trò là bắt buộc";
    }

    // Validate avatar file if selected
    if (avatarFile) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (avatarFile.size > maxSize) {
        newErrors.avatar = "Kích thước ảnh không được vượt quá 2MB";
      }
      
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(avatarFile.type)) {
        newErrors.avatar = "Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear avatar error if exists
      if (errors.avatar) {
        setErrors({ ...errors, avatar: "" });
      }
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    // Reset file input
    const fileInput = document.getElementById("avatar-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async () => {
    if (mode === "view") {
      onOpenChange(false);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        // Always use FormData
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        if (formData.phone) formDataToSend.append("phone", formData.phone);
        formDataToSend.append("roleId", formData.roleId);
        formDataToSend.append("isVerified", String(formData.isVerified));
        formDataToSend.append("isActive", String(formData.isActive));
        
        // Only append avatar if file is selected
        if (avatarFile) {
          formDataToSend.append("avatar", avatarFile);
        }

        await dispatch(createUser(formDataToSend)).unwrap();
      } else if (mode === "edit" && userId) {
        // Always use FormData
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        if (formData.phone) formDataToSend.append("phone", formData.phone);
        formDataToSend.append("roleId", formData.roleId);
        formDataToSend.append("isVerified", String(formData.isVerified));
        formDataToSend.append("isActive", String(formData.isActive));
        
        // Only append avatar if new file is selected
        if (avatarFile) {
          formDataToSend.append("avatar", avatarFile);
        }

        await dispatch(
          updateUser({
            id: userId,
            data: formDataToSend,
          })
        ).unwrap();
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save user:", error);
      setErrors({ submit: error.message || "Có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === "view";

  const getRoleLabel = (roleName: string) => {
    const roleLabels: Record<string, string> = {
      customer: "Khách hàng",
      admin: "Quản trị viên",
      driver: "Tài xế",
      company: "Nhà xe",
      staff: "Nhân viên",
    };
    return roleLabels[roleName] || roleName;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" && "Thêm người dùng mới"}
            {mode === "edit" && "Chỉnh sửa người dùng"}
            {mode === "view" && "Thông tin người dùng"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" && "Điền thông tin để tạo người dùng mới"}
            {mode === "edit" && "Cập nhật thông tin người dùng"}
            {mode === "view" && "Xem chi tiết thông tin người dùng"}
          </DialogDescription>
        </DialogHeader>

        {loading && mode !== "create" ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Avatar Upload */}
            <div className="grid gap-2">
              <Label htmlFor="avatar">Ảnh đại diện</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage 
                      src={avatarPreview || currentAvatarUrl} 
                      alt={formData.name || "User"} 
                    />
                    <AvatarFallback className="text-lg">
                      {formData.name ? getInitials(formData.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!isReadOnly && (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5 text-white" />
                    </label>
                  )}
                </div>
                
                <div className="flex-1">
                  {!isReadOnly && (
                    <>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      {avatarFile ? (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground flex-1 truncate">
                            {avatarFile.name}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveAvatar}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Kích thước tối đa: 2MB. Định dạng: JPG, PNG, WEBP
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
              {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>}
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isReadOnly}
                placeholder="Nhập tên người dùng"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isReadOnly || mode === "edit"}
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password - Only for create mode */}
            {mode === "create" && (
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Mật khẩu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
            )}

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isReadOnly}
                placeholder="0123456789"
              />
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="role">
                Vai trò <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.roleId}
                onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger className="border-gray-300 focus-visible:ring-1 focus-visible:border-primary focus-visible:ring-primary/50">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {getRoleLabel(role.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && <p className="text-sm text-red-500">{errors.roleId}</p>}
            </div>

            {/* Is Verified */}
            <div className="flex items-end justify-between space-x-2">
              <Label htmlFor="isVerified" className="flex flex-col items-start space-y-1">
                <span>Đã xác thực</span>
                <span className="text-sm font-normal text-gray-500">
                  Người dùng đã xác thực email
                </span>
              </Label>
              <Switch
                id="isVerified"
                checked={formData.isVerified}
                onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
                disabled={isReadOnly}
              />
            </div>

            {/* Is Active */}
            <div className="flex items-end justify-between space-x-2">
              <Label htmlFor="isActive" className="flex flex-col items-start space-y-1">
                <span>Trạng thái hoạt động</span>
                <span className="text-sm font-normal text-gray-500">
                  Cho phép người dùng đăng nhập
                </span>
              </Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={isReadOnly}
              />
            </div>

            {errors.submit && (
              <p className="text-sm text-red-500 text-center">{errors.submit}</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {mode === "view" ? "Đóng" : "Hủy"}
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Tạo người dùng" : "Cập nhật"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
