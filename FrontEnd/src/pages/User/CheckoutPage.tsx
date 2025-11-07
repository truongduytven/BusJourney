import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import LoadingImage from "@/assets/loading.gif";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createVNPayPayment } from "@/redux/thunks/paymentThunks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const CheckoutPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const selectedTicket = useSelector((state: RootState) => state.selectedTicket);
  const [error, setError] = useState<string | null>(null);
  const hasProcessedPayment = useRef(false); // ← Thêm flag để tránh duplicate

  useEffect(() => {
    // Chỉ chạy 1 lần duy nhất khi component mount
    if (hasProcessedPayment.current) {
      return;
    }

    const processPayment = async () => {
      try {
        hasProcessedPayment.current = true; // ← Đánh dấu đã xử lý
        setError(null);

        if (!selectedTicket.tripId || selectedTicket.selectedSeats.length === 0) {
          setError("Thông tin đặt vé không hợp lệ");
          toast.error("Thông tin đặt vé không hợp lệ");
          setTimeout(() => navigate("/search"), 2000);
          return;
        }

        if (!selectedTicket.userInformation.name || !selectedTicket.userInformation.email || !selectedTicket.userInformation.phone) {
          setError("Vui lòng điền đầy đủ thông tin liên hệ");
          toast.error("Vui lòng điền đầy đủ thông tin liên hệ");
          setTimeout(() => navigate("/method-checkout"), 2000);
          return;
        }

        const result = await dispatch(createVNPayPayment(selectedTicket)).unwrap();

        if (result && result.paymentUrl) {
          toast.success("Đang chuyển đến trang thanh toán...");
          window.location.href = result.paymentUrl;
        } else {
          setError("Không nhận được URL thanh toán");
          toast.error("Không nhận được URL thanh toán");
        }
      } catch (err: any) {
        console.error("Payment error:", err);
        setError(err || "Có lỗi xảy ra khi tạo thanh toán");
        toast.error(err || "Có lỗi xảy ra khi tạo thanh toán");
      }
    };

    processPayment();
  }, []); // ← Chỉ chạy 1 lần khi mount

  const handleRetry = () => {
    hasProcessedPayment.current = false; // ← Reset flag khi retry
    setError(null);
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate("/method-checkout");
  };

  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center gap-4">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <div className="text-xl font-semibold text-red-600">Thanh toán thất bại</div>
        <div className="text-gray-600 text-center max-w-md">{error}</div>
        <div className="flex gap-4 mt-4">
          <Button onClick={handleRetry} variant="default">
            Thử lại
          </Button>
          <Button onClick={handleGoBack} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
      <img src={LoadingImage} alt="Loading" className="w-52 h-52" />
      <div className="text-2xl font-semibold">Đang xử lý thanh toán...</div>
      <div className="text-gray-600">Vui lòng không tắt trình duyệt</div>
    </div>
  );
};

export default CheckoutPage;
