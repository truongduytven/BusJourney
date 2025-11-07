import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Bus,
  Route,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ClockArrowUp,
  ClockArrowDown,
  Captions,
  Armchair,
  Binary,
  Ticket,
  Banknote,
  CircleEllipsis,
  CalendarClock,
  Type,
  X,
} from "lucide-react";
import type { TicketWithRelations } from "@/redux/thunks/ticketThunks";
import { formatTime, formatDate, convertMoney } from "@/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

interface TicketResultProps {
  ticket: TicketWithRelations;
  onClose?: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "valid":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "checked":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case "processing":
      return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "valid":
      return "Đang khả dụng";
    case "cancelled":
      return "Đã hủy";
    case "checked":
      return "Đã check-in";
    case "processing":
      return "Đang xử lý";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "valid":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "checked":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function TicketResult({ ticket, onClose }: TicketResultProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 max-w-6xl space-y-4">
      {/* Header Card - Ticket Status */}
      <Card className="border-l-4 border-l-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Thông tin vé #{ticket.ticket.ticketCode}
            </CardTitle>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 px-3 py-1 ${getStatusColor(
                ticket.ticket.status
              )}`}
            >
              {getStatusIcon(ticket.ticket.status)}
              {getStatusText(ticket.ticket.status)}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="information" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="information" className="text-gray-400">
            Thông tin chuyến xe
          </TabsTrigger>
          <TabsTrigger value="passenger" className="text-gray-400">
            Thông tin hành khách
          </TabsTrigger>
          <TabsTrigger value="transaction" className="text-gray-400">
            Thông tin giao dịch
          </TabsTrigger>
        </TabsList>
        <TabsContent value="information" className="min-h-96">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Route className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Tuyến đường</p>
                        <p className="font-bold text-lg text-gray-800">
                          {ticket.trip.route.startLocation.cityName} → {ticket.trip.route.endLocation.cityName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CalendarClock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Ngày khởi hành</p>
                        <p className="font-bold text-lg text-gray-800">
                          {formatDate(ticket.trip.departureTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="text-center">
                        <div className="p-2 bg-orange-100 rounded-full w-fit mx-auto mb-2">
                          <ClockArrowUp className="h-4 w-4 text-orange-600" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase">Khởi hành</p>
                        <p className="font-bold text-orange-700">
                          {formatTime(ticket.trip.departureTime)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="text-center">
                        <div className="p-2 bg-purple-100 rounded-full w-fit mx-auto mb-2">
                          <ClockArrowDown className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase">Đến nơi</p>
                        <p className="font-bold text-purple-700">
                          {formatTime(ticket.trip.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-red-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <Bus className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Nhà xe</p>
                        <p className="font-bold text-lg text-gray-800">
                          {ticket.trip.bus.company.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-indigo-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <Type className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Loại xe</p>
                        <p className="font-bold text-lg text-gray-800">
                          {ticket.trip.bus.typeBus.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="text-center">
                        <div className="p-2 bg-yellow-100 rounded-full w-fit mx-auto mb-2">
                          <Captions className="h-4 w-4 text-yellow-600" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase">Biển số</p>
                        <p className="font-bold text-yellow-700">
                          {ticket.trip.bus.licensePlate}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="text-center">
                        <div className="p-2 bg-teal-100 rounded-full w-fit mx-auto mb-2">
                          <Armchair className="h-4 w-4 text-teal-600" />
                        </div>
                        <p className="text-xs text-gray-500 uppercase">Tổng ghế</p>
                        <p className="font-bold text-teal-700">
                          {ticket.trip.bus.typeBus.totalSeats}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6"></div>

              {/* Pickup and Dropoff Points */}
              <div className="bg-gradient-to-r from-green-50 via-blue-50 to-red-50 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 hover:shadow-xl transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <MapPin className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="font-bold text-xl text-green-700">Điểm đón</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="font-bold text-2xl text-green-800">
                            {ticket.pickUpPoint
                              ? formatTime(ticket.pickUpPoint.time)
                              : "11:00"}
                          </p>
                        </div>
                        <p className="text-gray-700 font-medium text-sm">
                          {ticket.pickUpPoint
                            ? ticket.pickUpPoint.locationName
                            : "Việt Nam"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="relative w-full">
                      <div className="border-t-4 border-dashed border-blue-400 w-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-3 shadow-lg">
                        <Bus className="h-5 w-5" />
                      </div>
                      <div className="flex justify-between mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200 hover:shadow-xl transition-all duration-300">
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                          <MapPin className="h-6 w-6 text-red-600" />
                        </div>
                        <h4 className="font-bold text-xl text-red-700">Điểm trả</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-red-50 rounded-lg p-3">
                          <p className="font-bold text-2xl text-red-800">
                            {ticket.dropOffPoint
                              ? formatTime(ticket.dropOffPoint.time)
                              : "11:00"}
                          </p>
                        </div>
                        <p className="text-gray-700 font-medium text-sm">
                          {ticket.dropOffPoint
                            ? ticket.dropOffPoint.locationName
                            : "Việt Nam"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-full"></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="passenger" className="min-h-96">
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Họ và tên</p>
                        <p className="font-bold text-lg text-gray-800">{ticket.passenger.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ngày đặt vé</p>
                        <p className="font-bold text-lg text-gray-800">
                          {formatDate(ticket.order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Phone className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Số điện thoại</p>
                        <p className="font-bold text-lg text-gray-800">
                          {ticket.passenger.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                        <p className="font-bold text-lg text-gray-800 break-all">
                          {ticket.passenger.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transaction" className="min-h-96">
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
            <CardContent className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Binary className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-700 uppercase tracking-wide mb-2 font-semibold">Mã giao dịch</p>
                    <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
                      <p className="font-mono text-lg font-bold text-blue-800 break-all">
                        {ticket.transaction ? ticket.transaction.id : "Not found"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Ticket className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Giá vé</p>
                        <p className="font-bold text-lg text-blue-600">
                          {convertMoney(Number(ticket.trip.price))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Banknote className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Tổng tiền</p>
                        <p className="font-bold text-lg text-green-600">
                          {convertMoney(Number(ticket.order.finalAmount))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <CreditCard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phương thức thanh toán</p>
                        <p className="font-bold text-lg text-gray-800">
                          {ticket.transaction
                            ? ticket.transaction.paymentMethod.toUpperCase()
                            : "MOMO"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 flex justify-end">
                        <Badge
                          variant={
                            ticket.transaction
                              ? ticket.transaction.status === "completed"
                                ? "default"
                                : "secondary"
                              : "secondary"
                          }
                          className={cn("px-4 py-3 text-sm text-white font-bold rounded-full shadow-md", {
                            "bg-green-500": ticket.transaction?.status === "completed",
                            "bg-orange-500": ticket.transaction?.status !== "completed",
                          })}
                        >
                          {ticket.transaction
                            ? ticket.transaction.status === "completed"
                              ? <CheckCircle className="h-4 w-4 text-white inline-block mr-1" />
                              : ticket.transaction.status
                            : <CircleEllipsis className="h-4 w-4 text-white inline-block mr-1" />}
                          {ticket.transaction
                            ? ticket.transaction.status === "completed"
                              ? "Đã thanh toán"
                              : ticket.transaction.status
                            : "Đang xử lí"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      
      <div className="bg-white p-4">
        <div className="mx-auto flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            className="px-8 py-3 font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 hover:border-red-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <X className="h-5 w-5 mr-2" />
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
