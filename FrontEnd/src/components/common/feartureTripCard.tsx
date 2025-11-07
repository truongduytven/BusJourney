import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import type { FeaturedRoute } from "@/types/home";

interface FeaturedTripCardProps {
  route: FeaturedRoute;
  onSearch?: () => void;
}

export default function FeaturedTripCard({ route, onSearch }: FeaturedTripCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="w-full flex justify-center">
      <div className="overflow-hidden rounded-2xl shadow-lg w-80 hover:shadow-2xl transition-shadow duration-300">
        <div className="relative">
          <img
            src={`https://picsum.photos/seed/${route.id}/400/250`}
            alt={`${route.from.city} - ${route.to.city}`}
            className="h-48 w-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
            {route.upcomingTripsCount} chuyến
          </Badge>
          {route.nextTrip && (
            <div className="absolute -bottom-4 right-2 shadow-lg flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="font-semibold">{formatDate(route.nextTrip.departureTime)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 py-6 px-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold text-lg text-gray-800">
              {route.from.city} - {route.to.city}
            </h3>
          </div>

          <div className="text-sm text-gray-600">
            {route.from.location} → {route.to.location}
          </div>

          {route.nextTrip ? (
            <div className="text-lg text-gray-900">
              Chỉ từ <b>{formatPrice(route.nextTrip.price)}</b>{" "}
              <span className="text-sm text-gray-500">/ người</span>
              <div className="text-sm text-gray-500 mt-1">
                Còn {route.nextTrip.availableSeats} ghế trống
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Hiện không có chuyến sắp tới
            </div>
          )}

          <Button 
            className="w-full rounded-xl text-white mt-2 transition-transform duration-300 hover:scale-105"
            onClick={onSearch}
          >
            Tìm kiếm ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
