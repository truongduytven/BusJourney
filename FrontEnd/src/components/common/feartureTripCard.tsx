import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function FeaturedTripCard() {
  return (
    <div className="w-full flex justify-center">
      <div className="overflow-hidden rounded-2xl shadow-lg w-80">
        <div className="relative">
          <img
            src="https://picsum.photos/400/250"
            alt="Trip"
            className="h-48 w-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
            3120 chuyến
          </Badge>
          <div className="absolute -bottom-4 right-2 shadow-lg flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">4.96</span>
            <span className="text-gray-400">(672 reviews)</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-6 px-4">
          <h3 className="font-bold text-lg text-gray-800">
            Hồ Chí Minh - Đà Lạt
          </h3>

          <div className="text-lg text-gray-900">
            Chỉ từ <b>200.000đ</b>{" "}
            <span className="text-lg text-gray-500">/ người</span>
          </div>

          <Button className="w-full rounded-xl text-white mt-6 transition-transform duration-300 hover:scale-105">
            Tìm kiếm ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
