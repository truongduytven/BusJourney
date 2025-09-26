import { cn } from "@/lib/utils";
import type { ICoupon } from "@/types/trip";
import { convertMoney, formatDate } from "@/utils";

interface VoucherTicketProps {
  className?: string;
  isTag?: boolean;
  isScale?: boolean;
  data?: ICoupon;
}

export default function VoucherTicket({ className, isTag = true, isScale = true, data }: VoucherTicketProps) {
  return (
    <div className={cn("flex aspect-[25/9] w-92 relative z-0 bg-gray-200 transition-transform duration-300", { "hover:scale-105" : isScale },className)}>
      {isTag && <div className="text-xs absolute rounded-sm -left-2 top-2 p-0.5 text-white bg-yellow-500">
        Số lượng có hạn
      </div>}
      <div
        style={{
          backgroundImage: `linear-gradient(135deg,
                    "#fff"
                  50%, transparent 50%), linear-gradient(45deg, 
                   "#fff"
                  50%, transparent 50%)`,
          backgroundPosition: "top left, top left, top right, top right",
          backgroundSize: "10px 10px",
          backgroundRepeat: "repeat-y",
        }}
        className="flex flex-col items-center justify-center p-3 pt-6 pl-4 border-r border-dashed rounded-l-lg shadow aspect-square bg-primary shrink-0"
      >
        <img src={"/logo_white.png"} className="w-20 h-14" />
        <div className="font-medium text-[10px] text-white">BUS JOURNEY</div>
      </div>
      <div className="flex flex-col p-4 justify-center border border-l border-dashed rounded-r-lg shadow aspect-video bg-accent shrink-0 text-accent-foreground">
        <div className="text-lg font-medium">{data ? data.description : "Giảm x%"}</div>
        <div>Đơn tối thiểu 200.000đ</div>
        <div>Giảm giá tối đa {data ? convertMoney(Number(data.maxDiscountValue)) : "10.000đ"}</div>
        <div className="font-medium text-primary text-xs">Hạn sử dụng: {data ? formatDate(data.validTo) : "30/09/2024"}</div>
      </div>
    </div>
  );
}
