import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Calendar, ArrowRight, Armchair, Building2 } from 'lucide-react';
import type { MyTicket, TicketStatus } from '../../types/myTicket';
import { formatDate, formatTime } from '@/utils';

interface TicketCardProps {
  ticket: MyTicket;
  onViewDetail: (ticketId: string) => void;
}

const getStatusConfig = (status: TicketStatus) => {
  const statusConfig = {
    pending: {
      label: 'Chờ thanh toán',
      className: 'bg-amber-500 text-white border-amber-500',
      dotColor: 'bg-amber-500',
    },
    valid: {
      label: 'Đã thanh toán',
      className: 'bg-emerald-500 text-white border-emerald-500',
      dotColor: 'bg-emerald-500',
    },
    checked: {
      label: 'Đã soát vé',
      className: 'bg-blue-500 text-white border-blue-500',
      dotColor: 'bg-blue-500',
    },
  };

  return statusConfig[status];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// const formatDate = (dateString: string) => {
//   return new Date(dateString).toLocaleDateString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   });
// };

// const formatTime = (timeString: string) => {
//   return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('vi-VN', {
//     hour: '2-digit',
//     minute: '2-digit',
//   });
// };

export const TicketCard = ({ ticket, onViewDetail }: TicketCardProps) => {
  const { trip, order, pickUpPoint, dropOffPoint } = ticket;
  const statusConfig = getStatusConfig(ticket.status);

  return (
    <Card className="py-0 group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 hover:border-primary bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-0">
        {/* Status Banner */}
        <div className={`${statusConfig.className} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
            <span className="font-semibold text-base">{statusConfig.label}</span>
          </div>
          <span className="text-base font-medium opacity-90">#{ticket.ticketCode}</span>
        </div>

        <div className="p-6 pt-5">
          {/* Route - Most Important Information */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {trip.route.from.city}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{pickUpPoint.name}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center px-4">
                <ArrowRight className="w-6 h-6 text-primary mb-1" strokeWidth={2.5} />
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  Chuyến xe
                </div>
              </div>

              <div className="flex-1 text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {trip.route.to.city}
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                  <span className="line-clamp-1">{dropOffPoint.name}</span>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Departure Date & Time - Highlight */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center justify-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-900">
                  {formatDate(trip.departureTime)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="font-bold text-primary text-lg">
                  {formatTime(trip.departureTime)}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-600">
                  {formatTime(trip.arrivalTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Bus Company & Seat */}
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/30">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Nhà xe</div>
                <div className="font-semibold text-gray-900">{trip.busCompany.name}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Armchair className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-500">Ghế</span>
              </div>
              <div className="text-xl font-bold text-primary">{ticket.seatCode}</div>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Tổng tiền</div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(order.finalAmount)}
              </div>
            </div>

            <Button 
              onClick={() => onViewDetail(ticket.id)} 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-md hover:shadow-lg transition-all"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
