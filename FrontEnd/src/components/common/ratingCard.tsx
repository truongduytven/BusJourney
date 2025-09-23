import { Star } from "lucide-react";

export default function RatingCard() {
  return (
    <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden p-6 gap-2">
      <b>Sài Gòn - Đà Lạt</b>
      <p className="text-sm text-gray-500 mb-4">
        Xe chạy đúng giờ, ghế ngồi thoải mái và sạch sẽ. Nhân viên nhiệt tình,
        hỗ trợ chu đáo. Tôi đặt vé online rất nhanh chóng, thanh toán dễ dàng.
        Rất hài lòng và chắc chắn sẽ tiếp tục sử dụng cho những chuyến đi sau!
      </p>
      <div className="w-full h-[1px] bg-gray-200" />
      <div className="flex items-center">
        <img
          src="https://i.pravatar.cc/150?img=49"
          alt="Avatar"
          className="rounded-full w-10"
        />
        <div className="ml-4">
          <p className="font-semibold">Nguyễn Văn A</p>
          <p className="text-sm text-gray-500">13:00:09 23/09/2025</p>
        </div>
        <div className="flex items-center ml-auto text-sm text-gray-500 gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} fill={star <= 4 ? "yellow" : "white"} className="h-3 w-3 text-yellow-300"/>
          ))}
        </div>
      </div>
    </div>
  );
}
