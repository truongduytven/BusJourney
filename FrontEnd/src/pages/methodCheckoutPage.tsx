import VoucherTicket from "@/components/common/voucherTicket";
import InformationCheckoutForm from "@/components/forms/informationCheckoutForm";
import Container from "@/components/layout/container";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/diviver";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { informationCheckoutSchema } from "@/schemas";
import { convertMoney } from "@/utils";
import {
  Armchair,
  Bus,
  CircleDot,
  InfoIcon,
  MapPinCheck,
  MessageCircleQuestionIcon,
  User2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type z from "zod";

interface UserInfo {
  fullName: string;
  email: string;
  numberPhone: string;
}

export default function MethodCheckoutPage() {
  const [selectedVoucher, setSelectedVoucher] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("VNPAY");
  const [timeLeft, setTimeLeft] = useState(600);
  const [userInfo, setUserInfo] = useState<UserInfo>(
    localStorage.getItem("checkoutInfo")
      ? JSON.parse(localStorage.getItem("checkoutInfo")!)
      : { fullName: "", email: "", numberPhone: "" }
  );
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev < 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (data: z.infer<typeof informationCheckoutSchema>) => {
    localStorage.setItem("checkoutInfo", JSON.stringify(data));
    setUserInfo(data);
    console.log(data);
  };

  return (
    <div className="w-full flex flex-1 flex-col justify-center bg-gray-background overflow-y-scroll pt-18">
      <div className="fixed top-0 left-0 z-10 w-full flex justify-center bg-white border-t border-gray-300 p-4">
        <Container className="flex justify-between items-center">
          <div className="text-lg flex-1 font-medium"> Thời gian thanh toán trong </div>
          <div className="flex-1 flex justify-center text-4xl font-semibold text-secondary">
            {formatTime()}
          </div>
          <div className="flex-1 flex justify-end text-blue-500 underline text-sm items-center cursor-pointer">Liên hệ hỗ trợ <MessageCircleQuestionIcon className="ml-1" size={16}/></div>
        </Container>
      </div>
      <Container className="flex flex-col p-6">
        <div className="w-full flex justify-between gap-x-5">
          <div className="flex-5 flex flex-col gap-y-5">
            <div className="flex flex-col bg-white p-5 border-[0.5px] border-gray-300 rounded-md">
              <div className="font-bold text-primary text-xl text-center mb-10">
                Chọn phương thức thanh toán
              </div>
              <RadioGroup
                defaultValue="VNPAY"
                onValueChange={setSelectedMethod}
              >
                <div
                  className="flex space-x-2 py-4"
                  onClick={() => setSelectedMethod("payLater")}
                >
                  <RadioGroupItem
                    checked={selectedMethod === "payLater"}
                    className="size-5 mt-2"
                    value="payLater"
                    id="option-one"
                  />
                  <div className="flex flex-col ml-2 gap-2">
                    <div className="flex gap-x-2 text-lg font-semibold">
                      <Bus
                        className=" text-blue-500 border border-gray-200 rounded-md"
                        size={32}
                      />
                      <div>Thanh toán tại nhà xe/ khi lên xe</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Chỉ áp dụng trước 6 giờ xe khởi hành
                    </div>
                  </div>
                </div>
                <Divider />
                <div
                  className="flex space-x-2 py-4"
                  onClick={() => setSelectedMethod("VNPAY")}
                >
                  <RadioGroupItem
                    checked={selectedMethod === "VNPAY"}
                    className="size-5 mt-2"
                    value="VNPAY"
                    id="option-one"
                  />
                  <div className="flex flex-col ml-2 gap-2">
                    <div className="flex gap-x-2 text-lg font-semibold">
                      <img
                        src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg"
                        className=" text-green-500 w-8 h-8 border border-gray-200 rounded-md"
                      />
                      <div>VNPAY</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Thanh toán với thẻ nội địa hoặc thẻ quốc tế
                    </div>
                  </div>
                </div>
                <Divider />
                <div
                  className="flex space-x-2 py-4"
                  onClick={() => setSelectedMethod("ZaloPay")}
                >
                  <RadioGroupItem
                    checked={selectedMethod === "ZaloPay"}
                    className="size-5 mt-2"
                    value="ZaloPay"
                    id="option-one"
                  />
                  <div className="flex flex-col ml-2 gap-2">
                    <div className="flex gap-x-2 text-lg font-semibold">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPynD27LbXlPsbofv1AX-5ZXDn_XMGo-1TA&s"
                        className=" text-primary w-8 h-8 border border-gray-200 rounded-md"
                      />
                      <div>Ví ZaloPay</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Điện thoại bạn phải cài đặt ứng dụng ZaloPay
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-md gap-y-4">
              <div className="flex justify-between">
                <div className="text-lg font-bold">Thông tin liên hệ</div>
                <Sheet>
                  <SheetTrigger asChild>
                    <div className="text-blue-500 underline font-medium cursor-pointer">
                      Chỉnh sửa
                    </div>
                  </SheetTrigger>
                  <SheetContent className="px-4 pt-10">
                    <div className="text-lg text-center font-bold">
                      Chỉnh sửa thông tin liên hệ
                    </div>
                    <InformationCheckoutForm onSubmit={handleSubmit} />
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          type="submit"
                          form="checkout-form"
                          className="w-full bg-primary text-white hover:bg-primary/90 p-0"
                        >
                          Lưu
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex justify-between">
                <div>Tên người đi</div>
                <div className="font-medium">{userInfo.fullName}</div>
              </div>
              <div className="flex justify-between">
                <div>Số điện thoại</div>
                <div className="font-medium">{userInfo.numberPhone}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Email</div>
                <div className="font-medium">{userInfo.email}</div>
              </div>
            </div>
          </div>
          <div className="flex-3 flex flex-col gap-y-5">
            <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-md gap-y-4">
              <div className="flex justify-between">
                <div>Giá vé</div>
                <div className="font-medium">{convertMoney(180000)}</div>
              </div>
              <div className="flex justify-between">
                <div>Khuyến mãi</div>
                <div className="text-green-600 font-medium">
                  {" "}
                  -20% ({convertMoney(20000)})
                </div>
              </div>
              {selectedVoucher === null ? (
                <div>Chưa áp dụng voucher nào</div>
              ) : (
                <div className="flex justify-center">
                  <VoucherTicket isTag={false} isScale={false} />
                </div>
              )}
              <AlertDialog>
                <AlertDialogTrigger className="w-full">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-primary hover:text-white"
                  >
                    Chọn voucher
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader className="w-full sm:text-center font-semibold text-lg">
                    Chọn voucher
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    <ScrollArea>
                      <div className="flex flex-col max-h-[50vh] pr-4 mt-2 mb-4 gap-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <div className="flex justify-between items-center ml-2">
                            <VoucherTicket className="hover:scale-100 w-3/4" />
                            <Button
                              onClick={() => setSelectedVoucher(item)}
                              className="bg-primary text-white hover:bg-primary/90 p-0"
                            >
                              <AlertDialogCancel className=" cursor-pointer">
                                Chọn
                              </AlertDialogCancel>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 text-gray-500 cursor-pointer">
                      Trở về
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Divider />
              <div className="flex justify-between items-center">
                <div className="text-base font-semibold">Tạm tính</div>
                <div className="text-lg font-bold">{convertMoney(160000)}</div>
              </div>
            </div>
            <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-md gap-y-4">
              <div className="text-lg text-primary font-semibold">
                Thông tin chuyến đi
              </div>
              <div className="flex flex-col p-2 border border-gray-300 rounded-md gap-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <div>T6, 27/09/2025</div>
                  <div className="underline cursor-pointer text-blue-500">
                    Xem chi tiết
                  </div>
                </div>
                <div className="flex ">
                  <img
                    src="https://static.vexere.com/production/images/1724302676718.jpeg"
                    alt="ảnh xe"
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex flex-col gap-y-1 ml-4 text-sm">
                    <div className="font-semibold">MexBus</div>
                    <div>Giường nằm 32 chỗ</div>
                    <div className="flex gap-x-1 items-center text-xs text-gray-500">
                      <User2Icon fill="gray" size={14} />
                      <div>3</div>
                      <Armchair className="ml-3" fill="gray" size={14} />
                      <div>A1,A2,A3</div>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="flex gap-x-2">
                  <div className="flex flex-col text-primary justify-center items-center py-1">
                    <CircleDot size={16} className="text-blue-500" />
                    <div className="border-l-2 border-dotted border-gray-300 mx-2 flex-1" />
                    <MapPinCheck size={16} className="text-red-500" />
                  </div>
                  <div className="flex flex-col justify-between items-start text-base text-primary">
                    <div>
                      <b>9:30 •</b> Văn phòng Hồ Chí Minh
                    </div>
                    <div className="flex-1 flex items-center text-sm text-transparent">
                      2h30m
                    </div>
                    <div>
                      <b>12:00 •</b> Văn phòng Vũng Tàu
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="text-tertiary font-medium text-sm flex items-center">
                  Phí hủy hiện tại 30%{" "}
                  <InfoIcon size={14} className="inline ml-2 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="fixed bottom-0 left-0 w-full flex justify-center bg-white border-t border-gray-300 p-4">
        <Container className="flex flex-col ">
          <div className="flex justify-end items-center gap-x-6 px-6">
            <div className="text-sm">
              Bạn sẽ sớm nhận được biển số xe, số điện thoại tài xế và dễ dàng
              thay đổi điểm đón trả sau khi đặt.
            </div>
            <Button
              className="w-3/8 text-lg h-auto py-3 rounded-xl"
              onClick={() => navigate("/payment-success")}
            >
              Tiếp tục
            </Button>
          </div>
          <div className="flex justify-end">
            <div className="w-3/8 text-sm mt-4">
              Bằng việc nhấn nút Tiếp tục, bạn đồng ý với{" "}
              <a className="underline cursor-pointer font-bold">
                Chính sách bảo mật thanh toán
              </a>{" "}
              và <a className="underline cursor-pointer font-bold">Quy chế</a>
            </div>
          </div>
        </Container>
      </div>
      <div className="h-32"></div>
    </div>
  );
}
