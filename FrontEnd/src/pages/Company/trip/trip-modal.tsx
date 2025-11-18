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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, X } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type {
  Trip,
  CreateTripRequest,
  CreateBulkTripRequest,
  Bus,
  BusRoute,
} from "@/types/companyTrip";
import type { Template as TemplateType } from "@/types/companyTemplate";

interface TripModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  onSubmit: (data: CreateTripRequest) => void;
  onBulkSubmit: (data: CreateBulkTripRequest) => void;
  buses: Bus[];
  busRoutes: BusRoute[];
  templates: TemplateType[];
}

export function TripModal({
  open,
  onOpenChange,
  trip,
  onSubmit,
  onBulkSubmit,
  buses,
  busRoutes,
  templates,
}: TripModalProps) {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [sourceType, setSourceType] = useState<"route" | "template">("route");

  const [busId, setBusId] = useState("");
  const [busRouteId, setBusRouteId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    undefined
  );
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(true);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    if (trip) {
      setMode("single");
      setSourceType(trip.templateId ? "template" : "route");
      setBusId(trip.busId);
      setBusRouteId(trip.busRoutesId || "");
      setTemplateId(trip.templateId || "");

      const departure = new Date(trip.departureTime);
      setDepartureDate(departure);
      setDepartureTime(departure.toTimeString().slice(0, 5));

      const arrival = new Date(trip.arrivalTime);
      setArrivalTime(arrival.toTimeString().slice(0, 5));

      setPrice(trip.price.toString());
      setStatus(trip.status);
    } else {
      resetForm();
    }
  }, [trip, open]);

  const resetForm = () => {
    setMode("single");
    setSourceType("route");
    setBusId("");
    setBusRouteId("");
    setTemplateId("");
    setDepartureDate(undefined);
    setDepartureTime("");
    setArrivalTime("");
    setPrice("");
    setStatus(true);
    setSelectedDates([]);
    setDatePopoverOpen(false);
  };

  const handleRemoveDate = (date: Date) => {
    setSelectedDates(
      selectedDates.filter((d) => d.getTime() !== date.getTime())
    );
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!departureDate) return;

    const departureDateStr = format(departureDate, "yyyy-MM-dd");
    const departureDateTime = `${departureDateStr}T${departureTime}`;
    const arrivalDateTime = `${departureDateStr}T${arrivalTime}`;

    onSubmit({
      busId,
      busRoutesId: sourceType === "route" ? busRouteId : undefined,
      templateId: sourceType === "template" ? templateId : undefined,
      departureTime: departureDateTime,
      arrivalTime: arrivalDateTime,
      price: parseFloat(price),
      status,
    });
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dates = selectedDates.map((date) => format(date, "yyyy-MM-dd"));

    onBulkSubmit({
      dates,
      busId,
      busRoutesId: sourceType === "route" ? busRouteId : undefined,
      templateId: sourceType === "template" ? templateId : undefined,
      departureTime,
      arrivalTime,
      price: parseFloat(price),
      status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{trip ? "Sửa chuyến đi" : "Tạo chuyến đi"}</DialogTitle>
        </DialogHeader>

        {!trip && (
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "single" | "bulk")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Tạo đơn lẻ</TabsTrigger>
              <TabsTrigger value="bulk">Tạo hàng loạt</TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <form onSubmit={handleSingleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Chọn nguồn</Label>
                  <RadioGroup
                    value={sourceType}
                    onValueChange={(v) =>
                      setSourceType(v as "route" | "template")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="route" id="route" />
                      <Label htmlFor="route">Tuyến đường</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="template" id="template" />
                      <Label htmlFor="template">Template</Label>
                    </div>
                  </RadioGroup>
                </div>

                {sourceType === "route" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Tuyến đường</Label>
                      <Select value={busRouteId} onValueChange={setBusRouteId}>
                        <SelectTrigger className="border-gray-300 w-full">
                          <SelectValue placeholder="Chọn tuyến đường" />
                        </SelectTrigger>
                        <SelectContent>
                          {busRoutes.map((route) => (
                            <SelectItem key={route.id} value={route.id}>
                              {route.route?.startLocation?.name} →{" "}
                              {route.route?.endLocation?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Xe</Label>
                      <Select value={busId} onValueChange={setBusId}>
                        <SelectTrigger className="border-gray-300 w-full">
                          <SelectValue placeholder="Chọn xe" />
                        </SelectTrigger>
                        <SelectContent>
                          {buses.map((bus) => (
                            <SelectItem key={bus.id} value={bus.id}>
                              {bus.licensePlate} - {bus.type_buses?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label>Template</Label>
                    <Select value={templateId} onValueChange={setTemplateId}>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Chọn template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates
                          .filter((t) => t.isActive)
                          .map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure-date">Ngày đi</Label>
                    <Popover
                      open={datePopoverOpen}
                      onOpenChange={setDatePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="departure-date"
                          className={cn(
                            "w-full justify-between font-normal border-gray-300",
                            !departureDate && "text-muted-foreground"
                          )}
                        >
                          {departureDate
                            ? format(departureDate, "dd/MM/yyyy", {
                                locale: vi,
                              })
                            : "Chọn ngày"}
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={departureDate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDepartureDate(date);
                            setDatePopoverOpen(false);
                          }}
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departure-time">Giờ đi</Label>
                      <Input
                        type="time"
                        id="departure-time"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="arrival-time">Giờ đến</Label>
                      <Input
                        type="time"
                        id="arrival-time"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Giá vé (VNĐ)</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="status"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="status">Kích hoạt ngay</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">{trip ? "Cập nhật" : "Tạo"}</Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="bulk">
              <form onSubmit={handleBulkSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Chọn nguồn</Label>
                  <RadioGroup
                    value={sourceType}
                    onValueChange={(v) =>
                      setSourceType(v as "route" | "template")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="route" id="route-bulk" />
                      <Label htmlFor="route-bulk">Tuyến đường</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="template" id="template-bulk" />
                      <Label htmlFor="template-bulk">Template</Label>
                    </div>
                  </RadioGroup>
                </div>

                {sourceType === "route" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Tuyến đường</Label>
                      <Select value={busRouteId} onValueChange={setBusRouteId}>
                        <SelectTrigger className="border-gray-300 w-full">
                          <SelectValue placeholder="Chọn tuyến đường" />
                        </SelectTrigger>
                        <SelectContent>
                          {busRoutes.map((route) => (
                            <SelectItem key={route.id} value={route.id}>
                              {route.route?.startLocation?.name} →{" "}
                              {route.route?.endLocation?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Xe</Label>
                      <Select value={busId} onValueChange={setBusId}>
                        <SelectTrigger className="border-gray-300 w-full">
                          <SelectValue placeholder="Chọn xe" />
                        </SelectTrigger>
                        <SelectContent>
                          {buses.map((bus) => (
                            <SelectItem key={bus.id} value={bus.id}>
                              {bus.licensePlate} - {bus.type_buses?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label>Template</Label>
                    <Select value={templateId} onValueChange={setTemplateId}>
                      <SelectTrigger className="border-gray-300 w-full">
                        <SelectValue placeholder="Chọn template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates
                          .filter((t) => t.isActive)
                          .map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Chọn ngày (có thể chọn nhiều ngày)</Label>
                  <Popover
                    open={datePopoverOpen}
                    onOpenChange={setDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="departure-date"
                        className="w-full justify-between font-normal border-gray-300"
                      >
                        Chọn ngày
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={(dates) => setSelectedDates(dates || [])}
                        numberOfMonths={1}
                        captionLayout="dropdown"
                        locale={vi}
                        className="rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                  {selectedDates.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Đã chọn {selectedDates.length} ngày:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDates
                          .sort((a, b) => a.getTime() - b.getTime())
                          .map((date) => (
                            <Badge
                              key={date.getTime()}
                              variant="secondary"
                              className="gap-1 cursor-pointer"
                            >
                              {format(date, "dd/MM/yyyy", { locale: vi })}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => handleRemoveDate(date)}
                              />
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulk-departure-time">Giờ đi</Label>
                    <Input
                      type="time"
                      id="bulk-departure-time"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bulk-arrival-time">Giờ đến</Label>
                    <Input
                      type="time"
                      id="bulk-arrival-time"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Giá vé (VNĐ)</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="status-bulk"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="status-bulk">Kích hoạt ngay</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={selectedDates.length === 0}>
                    Tạo {selectedDates.length} chuyến
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        )}

        {trip && (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>
                Nguồn: {trip.templateId ? "Template" : "Tuyến đường"}
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Xe</Label>
              <Select value={busId} onValueChange={setBusId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn xe" />
                </SelectTrigger>
                <SelectContent>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.licensePlate} - {bus.type_buses?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-departure-date">Ngày đi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="edit-departure-date"
                      className={cn(
                        "w-full justify-between font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      {departureDate
                        ? format(departureDate, "dd/MM/yyyy", { locale: vi })
                        : "Chọn ngày"}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      captionLayout="dropdown"
                      onSelect={setDepartureDate}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-departure-time">Giờ đi</Label>
                  <Input
                    type="time"
                    id="edit-departure-time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-arrival-time">Giờ đến</Label>
                  <Input
                    type="time"
                    id="edit-arrival-time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    required
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Giá vé (VNĐ)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="status-edit"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="status-edit">Kích hoạt</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Cập nhật</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
