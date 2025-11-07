import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onUpload: (file: File) => void;
  loading?: boolean;
}

export const AvatarUpload = ({
  currentAvatar,
  userName = 'User',
  onUpload,
  loading = false,
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setPreview(null);
      setSelectedFile(null);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={displayAvatar} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-3xl font-semibold">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {/* Camera Icon Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="absolute bottom-0 right-0 rounded-full bg-primary/80 p-2 text-white shadow-lg transition-all hover:bg-primary/70 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <Camera className="h-5 w-5" />
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={loading}
      />

      {/* Action Buttons - Show when file is selected */}
      {selectedFile && (
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={loading}
            size="sm"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {loading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={loading}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Hủy
          </Button>
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Nhấn vào biểu tượng camera để chọn ảnh đại diện mới. 
        <br />
        Kích thước tối đa: 5MB
      </p>
    </div>
  );
};
