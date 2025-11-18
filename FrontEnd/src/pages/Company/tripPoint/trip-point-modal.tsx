import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type {
  TripPoint,
  CreateTripPointRequest,
  Trip as TripType,
  Point as PointType,
} from "@/types/companyTripPoint";

interface TripPointModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripPoint: TripPoint | null;
  onSubmit: (data: CreateTripPointRequest) => void;
  trips: TripType[];
  points: PointType[];
}

export function TripPointModal({
  open,
  onOpenChange,
  tripPoint,
  onSubmit,
  trips,
  points,
}: TripPointModalProps) {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [tripId, setTripId] = useState("");
  const [pointId, setPointId] = useState("");
  const [newPointType, setNewPointType] = useState("pickup");
  const [newPointName, setNewPointName] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    if (tripPoint) {
      setMode("existing");
      setTripId(tripPoint.tripId);
      setPointId(tripPoint.pointId);
      const dateTime = new Date(tripPoint.time);
      setDate(dateTime);
      setTime(dateTime.toTimeString().slice(0, 5));
      setIsActive(tripPoint.isActive);
    } else {
      resetForm();
    }
  }, [tripPoint, open]);

  const resetForm = () => {
    setMode("existing");
    setTripId("");
    setPointId("");
    setNewPointType("pickup");
    setNewPointName("");
    setDate(undefined);
    setTime("");
    setIsActive(true);
    setDatePopoverOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) return;

    const dateStr = format(date, "yyyy-MM-dd");
    const dateTime = `${dateStr}T${time}`;

    const data: CreateTripPointRequest = {
      tripId,
      time: dateTime,
      isActive,
    };

    if (mode === "existing") {
      data.pointId = pointId;
    } else {
      data.pointData = {
        type: newPointType,
        locationName: newPointName,
      };
    }

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tripPoint ? "Sửa điểm đón/trả" : "Thêm điểm đón/trả"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Chuyến đi</Label>
            <Select value={tripId} onValueChange={setTripId} disabled={!!tripPoint}>
              <SelectTrigger className="border-gray-300 w-full">
                <SelectValue placeholder="Chọn chuyến đi" />
              </SelectTrigger>
              <SelectContent>
                {trips.map((trip) => {
                  const label = trip.template
                    ? trip.template.name
                    : trip.busRoute?.route?.startLocation?.name && trip.busRoute?.route?.endLocation?.name
                    ? `${trip.busRoute.route.startLocation.name} → ${trip.busRoute.route.endLocation.name}`
                    : trip.id;
                  return (
                    <SelectItem key={trip.id} value={trip.id}>
                      {label} - {format(new Date(trip.departureTime), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {!tripPoint && (
            <div className="space-y-2">
              <Label>Chọn điểm</Label>
              <RadioGroup
                value={mode}
                onValueChange={(v) => setMode(v as "existing" | "new")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing">Chọn điểm có sẵn</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">Tạo điểm mới</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {mode === "existing" ? (
            <div className="space-y-2">
              <Label>Điểm đón/trả</Label>
              <Select value={pointId} onValueChange={setPointId}>
                <SelectTrigger className="border-gray-300 w-full">
                  <SelectValue placeholder="Chọn điểm" />
                </SelectTrigger>
                <SelectContent>
                  {points
                    .filter((p) => p.isActive)
                    .map((point) => (
                      <SelectItem key={point.id} value={point.id}>
                        {point.locationName} ({point.type === 'pickup' ? 'Đón' : 'Trả'})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Loại điểm</Label>
                <Select value={newPointType} onValueChange={setNewPointType}>
                  <SelectTrigger className="border-gray-300 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Điểm đón</SelectItem>
                    <SelectItem value="dropoff">Điểm trả</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tên địa điểm</Label>
                <Input
                  value={newPointName}
                  onChange={(e) => setNewPointName(e.target.value)}
                  placeholder="Nhập tên địa điểm"
                  required={mode === "new"}
                />
              </div>
            </>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trip-point-date">Ngày</Label>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild  className="border-gray-300 w-full">
                  <Button
                    variant="outline"
                    id="trip-point-date"
                    className={cn(
                      "w-full justify-between font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setDate(date);
                      setDatePopoverOpen(false);
                    }}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trip-point-time">Giờ</Label>
              <Input
                type="time"
                id="trip-point-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="status"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="status">Kích hoạt</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">{tripPoint ? "Cập nhật" : "Tạo"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
