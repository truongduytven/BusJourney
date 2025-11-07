import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import PaymentSuccessImage from "@/assets/payment_success.png";
import PaymentFailureImage from "@/assets/payment_failure.png";
import LoadingImage from "@/assets/loading.gif";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Đọc status từ query params (được set bởi backend khi redirect)
    const status = searchParams.get('status');
    
    // Simulate loading để UX mượt hơn
    setTimeout(() => {
      setIsLoading(false);
      setHasError(status === 'failed');
    }, 2000); // Giảm từ 10s xuống 2s
  }, [searchParams]);

  if (isLoading) {
    return <div className="w-screen h-screen flex flex-col justify-center items-center gap-2">
        <img src={LoadingImage} alt="Loading" className="w-52 h-52" />
        <div className="text-2xl font-semibold">Đang xác nhận thanh toán...</div>
        <div className="text-gray-600">Vui lòng chờ trong giây lát</div>
    </div>;
  }

  return hasError ? (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-10 pt-10">
      <img
        src={PaymentFailureImage}
        alt="Payment Failure"
        className="w-1/2 h-auto"
      />
      <h1 className="text-4xl font-medium text-center w-1/2">
        Có lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc thay đổi phương thức thanh toán.
      </h1>
      <Button onClick={() => window.open("/", "_self")}>
        Về trang chủ <Home />
      </Button>
    </div>
  ) : (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-10 pt-10">
      <img
        src={PaymentSuccessImage}
        alt="Payment Success"
        className="w-1/2 h-auto"
      />
      <h1 className="text-4xl font-medium text-center w-1/2">
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Bạn có thể kiểm tra vé
        trong mail hoặc trong phần vé của tôi.
      </h1>
      <Button onClick={() => window.open("/", "_self")}>
        Về trang chủ <Home />
      </Button>
    </div>
  );
}

