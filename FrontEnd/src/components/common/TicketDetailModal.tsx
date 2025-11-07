import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  MapPin,
  Calendar,
  Clock,
  Bus,
  User,
  CreditCard,
  Ticket as TicketIcon,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import type { TicketDetail, TicketStatus } from "../../types/myTicket";
import { findDuration, formatDate, formatTime } from "@/utils";
import { QRCodeCanvas } from "qrcode.react";


interface TicketDetailModalProps {
  ticket: TicketDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusConfig = (status: TicketStatus) => {
  const statusConfig = {
    pending: {
      label: "Chờ thanh toán",
      className: "bg-amber-500 text-white border-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    valid: {
      label: "Đã thanh toán",
      className: "bg-emerald-500 text-white border-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    checked: {
      label: "Đã soát vé",
      className: "bg-blue-500 text-white border-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  };

  return statusConfig[status];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const TicketDetailModal = ({
  ticket,
  isOpen,
  onClose,
}: TicketDetailModalProps) => {
  if (!ticket) return null;

  const { trip, order, account, checker } = ticket;
  console.log(ticket);
  const statusConfig = getStatusConfig(ticket.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header with Gradient Background */}
        <DialogHeader className="relative pb-6">
          <div
            className={`absolute inset-0 ${statusConfig.bgColor} opacity-30 -mx-6 -mt-6 h-32 rounded-t-lg`}
          ></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <DialogTitle className="text-3xl font-bold mb-2 text-gray-900">
                  Chi tiết vé xe
                </DialogTitle>
                <div className="flex items-center gap-3">
                  <span className="text-base text-gray-600">Mã vé:</span>
                  <code className="px-3 py-1 bg-gray-100 rounded-md font-mono font-semibold text-primary">
                    {ticket.ticketCode}
                  </code>
                </div>
              </div>
              <Badge
                className={`${statusConfig.className} text-base px-4 py-2 shadow-md`}
              >
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* QR Code */}
          {ticket.qrCode && (
            <div className="flex justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300 shadow-inner">
              <div className="text-center">
                <QRCodeCanvas
                  value={ticket.qrCode} // hoặc URL như `https://domain.com/checkin/${ticket.qrCode}`
                  size={224}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                  marginSize={5}
                  className="rounded-lg shadow-lg"
                />
                <p className="mt-4 text-sm text-gray-600 font-medium">
                  Quét mã để soát vé
                </p>
              </div>
            </div>
          )}

          {/* Trip Information - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Bus className="w-5 h-5 text-white" />
              </div>
              Thông tin chuyến đi
            </h3>
            <div className="space-y-4">
              {/* Route - Modern Card Design */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-700">
                    Tuyến đường
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {trip.route.startLocation.locationName}
                    </div>
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                      {trip.route.startLocation.city.cityName}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <ArrowRight
                      className="w-8 h-8 text-blue-600"
                      strokeWidth={2.5}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {trip.route.distance} km
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {trip.route.endLocation.locationName}
                    </div>
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
                      {trip.route.endLocation.city.cityName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-3 border-t border-blue-100">
                  <Clock className="w-4 h-4" />
                  <span>
                    Thời gian dự kiến:{" "}
                    <strong className="text-blue-600">
                      {findDuration(trip.departureTime, trip.arrivalTime)}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Date & Time - Highlight Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 shadow-md text-white">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Ngày khởi hành</span>
                  </div>
                  <div className="text-xl font-bold">
                    {formatDate(trip.departureTime)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 shadow-md text-white">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Giờ khởi hành</span>
                  </div>
                  <div className="text-xl font-bold">
                    {formatTime(trip.departureTime)} →{" "}
                    {formatTime(trip.arrivalTime)}
                  </div>
                </div>
              </div>

              {/* Pick-up & Drop-off Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-emerald-700">Điểm đón</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">
                      {ticket.pickUpPoint.pointName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.pickUpPoint.address}
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-red-700">Điểm trả</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">
                      {ticket.dropOffPoint.pointName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.dropOffPoint.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Company & Bus Info - Enhanced */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              Thông tin nhà xe & xe khách
            </h3>
            <div className="space-y-4">
              {/* Bus Company Header */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-purple-200">
                <div className="flex items-center gap-4">
                  {trip.busCompany.avatar ? (
                    <img
                      src={trip.busCompany.avatar}
                      alt={trip.busCompany.busCompanyName}
                      className="w-16 h-16 rounded-xl object-cover border border-purple-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center border border-purple-200">
                      <Building2 className="w-8 h-8 text-purple-700" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xl font-bold text-gray-900 mb-2">
                      {trip.busCompany.busCompanyName}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {trip.busCompany.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          {trip.busCompany.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bus Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-4 text-center border border-purple-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Biển số</div>
                  <div className="text-lg font-bold text-gray-900">
                    {trip.bus.licensePlate}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-purple-100 shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">Loại xe</div>
                  <div className="text-sm font-bold text-gray-900">
                    {trip.bus.typeBus.typeBusName}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-center shadow-md">
                  <div className="text-xs text-purple-100 mb-1">
                    Ghế của bạn
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {ticket.seatCode}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Information - Clean Design */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
              <div className="p-2 bg-cyan-500 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              Thông tin hành khách
            </h3>
            <div className="bg-white rounded-lg p-5 shadow-sm border border-cyan-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">Họ và tên</div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {account.fullname}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">
                    Số điện thoại
                  </div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {account.phone}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1.5">Email</div>
                  <div className="font-semibold text-gray-900 break-all">
                    {account.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information - Premium Look */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
              <div className="p-2 bg-amber-500 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              Thông tin thanh toán
            </h3>
            <div className="space-y-4">
              {/* Price Breakdown */}
              <div className="bg-white rounded-lg p-5 shadow-sm border border-amber-200 space-y-3">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Giá vé gốc</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(order.originAmount)}
                  </span>
                </div>

                {order.coupon && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center text-emerald-600">
                      <div>
                        <span className="font-medium">Giảm giá</span>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.coupon.couponCode} - {order.coupon.couponName}
                        </div>
                      </div>
                      <span className="font-bold text-lg">
                        -
                        {formatCurrency(order.originAmount - order.finalAmount)}
                        <span className="text-sm ml-1">
                          ({order.coupon.discountPercentage}%)
                        </span>
                      </span>
                    </div>
                  </>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg shadow-md">
                  <span className="font-bold text-lg">Tổng thanh toán</span>
                  <span className="font-bold text-2xl">
                    {formatCurrency(order.finalAmount)}
                  </span>
                </div>
              </div>

              {/* Transaction Details */}
              {order.transaction && (
                <div className="bg-white rounded-lg p-5 shadow-sm border border-amber-200">
                  <div className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Thông tin giao dịch
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-500">Mã giao dịch</div>
                      <div className="font-mono font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded">
                        {order.transaction.transactionId}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-500">Phương thức</div>
                      <div className="font-semibold text-gray-900">
                        {order.transaction.paymentMethod}
                      </div>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <div className="text-gray-500">Thời gian giao dịch</div>
                      <div className="font-semibold text-gray-900">
                        {formatTime(order.transaction.transactionDate)}{" "}
                        {formatDate(order.transaction.transactionDate)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Check-in Information - Success State */}
          {ticket.status === "checked" && checker && (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                Thông tin soát vé
              </h3>
              <div className="bg-white rounded-lg p-5 shadow-sm border border-emerald-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">
                      Nhân viên soát vé
                    </div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {checker.fullname}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5">
                      Thời gian soát vé
                    </div>
                    <div className="font-semibold text-gray-900">
                      {ticket.checkedDate &&
                        `${formatTime(ticket.checkedDate)} ${formatDate(
                          ticket.checkedDate
                        )}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Information - Footer */}
          <div className="border-t-2 border-gray-200 pt-5">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-lg">
              <TicketIcon className="w-4 h-4" />
              <span>
                Vé được đặt vào ngày{" "}
                <strong className="text-gray-700">{`${formatTime(
                  ticket.purchaseDate
                )} ${formatDate(ticket.purchaseDate)}`}</strong>
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
