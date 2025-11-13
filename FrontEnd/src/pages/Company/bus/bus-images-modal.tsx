import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import type { Bus } from "@/types/bus";

interface BusImagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bus: Bus | null;
}

export default function BusImagesModal({
  open,
  onOpenChange,
  bus,
}: BusImagesModalProps) {
  if (!bus) return null;

  const hasImages = bus.images && bus.images.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Hình ảnh xe {bus.licensePlate}
          </DialogTitle>
          <DialogDescription>
            {hasImages 
              ? `Có ${bus.images.length} hình ảnh` 
              : "Chưa có hình ảnh nào"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {hasImages ? (
            <div className="grid grid-cols-2 gap-4">
              {bus.images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors"
                >
                  <img
                    src={imageUrl}
                    alt={`${bus.licensePlate} - Ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.png';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ImageIcon className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Chưa có hình ảnh</p>
              <p className="text-sm mt-1">Vui lòng chỉnh sửa xe để thêm hình ảnh</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
