import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBusRoute } from "@/redux/thunks/busRouteThunks";
import { toast } from "sonner";

interface BusRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function BusRouteModal({
  open,
  onOpenChange,
  onSuccess,
}: BusRouteModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { approvedRoutes } = useSelector((state: RootState) => state.busRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedRouteId("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedRouteId) {
      toast.error("Vui lòng chọn tuyến đường");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(createBusRoute({ 
        routeId: selectedRouteId, 
        status: true 
      })).unwrap();
      
      toast.success("Thêm tuyến xe thành công");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi thêm tuyến xe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm tuyến xe mới</DialogTitle>
          <DialogDescription>
            Chọn tuyến đường đã được phê duyệt để thêm vào danh sách tuyến xe của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="route">
              Tuyến đường <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
              <SelectTrigger id="route">
                <SelectValue placeholder="Chọn tuyến đường" />
              </SelectTrigger>
              <SelectContent>
                {approvedRoutes.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    Không có tuyến đường nào được phê duyệt
                  </div>
                ) : (
                  approvedRoutes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {route.startLocation?.name || 'N/A'} → {route.endLocation?.name || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Khoảng cách: {route.distanceKm} km
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Tuyến xe sẽ được kích hoạt mặc định sau khi thêm
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedRouteId}
          >
            {isSubmitting ? "Đang thêm..." : "Thêm tuyến xe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
