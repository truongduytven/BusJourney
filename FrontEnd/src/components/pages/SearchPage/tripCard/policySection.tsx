import { AlertTriangle } from "lucide-react";

export default function PolicySection() {
  return (
    <div className="space-y-6 text-primary">
      {/* Chính sách hủy */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg mb-4">
          Chính sách hủy do nhà xe quy định
        </h2>
        <div className="border rounded-xl overflow-hidden border-gray-300">
          <div className="flex justify-between items-center px-4 py-3 text-gray-400">
            <div className="flex items-center gap-2 font-semibold">
              Thời gian hủy
            </div>
            <div className="font-semibold">Phí hủy</div>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Trước 9:30 • 12/09/2025
            </div>
            <div className="text-green-600 font-semibold">Miễn phí</div>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2 text-yellow-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
              9:30 • 12/09/2025
            </div>
            <div className="text-yellow-600 font-semibold">50%</div>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              12:30 • 12/09/2025
            </div>
            <div className="text-red-600 font-semibold">100%</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          <AlertTriangle size={16} className="text-yellow-500 shrink-0" />
          Vé áp dụng giá khuyến mãi không được phép hủy, hoàn tiền.
        </div>
      </div>

      {/* Các quy định khác */}
      <div className="text-base">
        <h2 className="font-bold text-lg mb-3">Các quy định khác</h2>

        {/* Yêu cầu khi lên xe */}
        <div className="space-y-2 border-b border-gray-200 pb-4">
          <h3 className="font-semibold">Yêu cầu khi lên xe</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Có mặt tại văn phòng/quầy vé/bến xe trước 30 phút để làm thủ tục lên xe</li>
            <li>Đổi vé giấy trước khi lên xe</li>
            <li>Xuất trình SMS/Email đặt vé trước khi lên xe</li>
            <li>Không mang đồ ăn, thức ăn có mùi lên xe</li>
            <li>Không hút thuốc, uống rượu, sử dụng chất kích thích trên xe</li>
            <li>Không mang các vật dễ cháy nổ lên xe</li>
            <li>Không vứt rác trên xe</li>
            <li>Không làm ồn, gây mất trật tự trên xe</li>
            <li>Không mang giày, dép trên xe</li>
          </ul>
        </div>

        {/* Hành lý xách tay */}
        <div className="space-y-2 border-b border-gray-200 py-4">
          <h3 className="font-semibold">Hành lý xách tay</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Tổng trọng lượng hành lý không vượt quá 20 kg</li>
            <li>Không vận chuyển hàng hóa cồng kềnh</li>
            <li>Không hoàn tiền trong trường hợp hủy đơn hàng do vi phạm các quy định về hành lý</li>
          </ul>
        </div>

        {/* Trẻ em và phụ nữ có thai */}
        <div className="space-y-2 pt-4">
          <h3 className="font-semibold">Trẻ em và phụ nữ có thai</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>Phụ nữ có thai cần đảm bảo sức khỏe trong suốt quá trình di chuyển</li>
            <li>Nhà xe có quyền từ chối phục vụ nếu hành khách không tuân thủ quy định an toàn</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
