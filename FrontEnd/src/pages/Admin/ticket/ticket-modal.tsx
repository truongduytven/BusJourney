import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Ticket, Point } from "@/types/ticket";

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    status?: string;
    pickupPointId?: string;
    dropoffPointId?: string;
    seatCode?: string;
  }) => void;
  ticket: Ticket | null;
  points: Point[];
}

export function TicketModal({
  open,
  onClose,
  onSubmit,
  ticket,
  points,
}: TicketModalProps) {
  const [status, setStatus] = useState("");
  const [pickupPointId, setPickupPointId] = useState("");
  const [dropoffPointId, setDropoffPointId] = useState("");
  const [seatCode, setSeatCode] = useState("");

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || "");
      setPickupPointId(ticket.pickupPointId || "");
      setDropoffPointId(ticket.dropoffPointId || "");
      setSeatCode(ticket.seatCode || "");
    } else {
      setStatus("");
      setPickupPointId("");
      setDropoffPointId("");
      setSeatCode("");
    }
  }, [ticket, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      status,
      pickupPointId: pickupPointId || undefined,
      dropoffPointId: dropoffPointId || undefined,
      seatCode,
    });
  };

  const pickupPoints = points.filter(p => p.type === "pickup");
  const dropoffPoints = points.filter(p => p.type === "dropoff");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ticket ? "Chỉnh sửa vé" : "Tạo vé"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ticket Code - Read only */}
          {ticket && (
            <div className="space-y-2">
              <Label>Mã vé</Label>
              <Input value={ticket.ticketCode} disabled />
            </div>
          )}

          {/* Seat Code */}
          <div className="space-y-2">
            <Label htmlFor="seatCode">Mã ghế *</Label>
            <Input
              id="seatCode"
              value={seatCode}
              onChange={(e) => setSeatCode(e.target.value)}
              placeholder="Nhập mã ghế (VD: A1, B2)"
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái *</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="checked_in">Đã check-in</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pickup Point */}
          <div className="space-y-2">
            <Label htmlFor="pickupPoint">Điểm đón</Label>
            <Select value={pickupPointId} onValueChange={setPickupPointId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn điểm đón" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Không chọn</SelectItem>
                {pickupPoints.map((point) => (
                  <SelectItem key={point.id} value={point.id}>
                    {point.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropoff Point */}
          <div className="space-y-2">
            <Label htmlFor="dropoffPoint">Điểm trả</Label>
            <Select value={dropoffPointId} onValueChange={setDropoffPointId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn điểm trả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Không chọn</SelectItem>
                {dropoffPoints.map((point) => (
                  <SelectItem key={point.id} value={point.id}>
                    {point.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Info - Read only */}
          {ticket?.account && (
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-semibold">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tên:</span>
                  <div className="font-medium">{ticket.account.name}</div>
                </div>
                <div>
                  <span className="text-gray-500">SĐT:</span>
                  <div className="font-medium">{ticket.account.phone}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Email:</span>
                  <div className="font-medium">{ticket.account.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {ticket ? "Cập nhật" : "Tạo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
