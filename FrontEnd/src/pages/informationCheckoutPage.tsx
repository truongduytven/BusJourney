import InformationCheckoutForm from "@/components/forms/informationCheckoutForm";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/diviver";
import { informationCheckoutSchema } from "@/schemas";
import { convertMoney } from "@/utils";
import {
  Armchair,
  ArrowLeft,
  CircleDot,
  InfoIcon,
  MapPinCheck,
  ShieldCheck,
  User2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type z from "zod";

export default function InformationCheckoutPage() {
  const navigate = useNavigate();
  const handleSubmit = (data: z.infer<typeof informationCheckoutSchema>) => {
    localStorage.setItem("checkoutInfo", JSON.stringify(data));
    navigate("/method-checkout");
    console.log(data);
  };

  return (
    <div className="w-full flex flex-1 flex-col justify-center bg-gray-background overflow-y-scroll mt-8">
      <Container className="flex flex-col p-6">
        <div onClick={() => navigate(-1)} className="text-sm mb-4 font-medium cursor-pointer hover:underline">
          <ArrowLeft className="inline" size={14} /> Quay lại
        </div>
        <div className="w-full flex justify-between gap-x-5">
          <div className="flex-5 flex flex-col ">
            <div className="flex flex-col bg-white p-5 border-[0.5px] border-gray-300 rounded-md">
              <div className="flex text-primary/70 justify-between border border-primary rounded-md items-center text-lg font-semibold mb-4 p-3">
                <div>Đăng nhập để tự điền thông tin khi đặt vé</div>
                <Button className="text-white">Đăng nhập</Button>
              </div>
              <div className="font-bold text-primary text-lg text-center">
                Thông tin liên hệ
              </div>
              <InformationCheckoutForm onSubmit={handleSubmit} />
              <div className="mt-6 w-full bg-green-200 flex p-2 gap-x-2 rounded-lg border border-green-600 text-green-700 text-sm items-center">
                <ShieldCheck size={16} />
                <div>
                  Thông tin đơn hàng sẽ được gửi đến số điện thoại và email bạn
                  cung cấp.
                </div>
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
              <Divider />
              <div className="flex justify-between items-center">
                <div className="text-base font-semibold">Tạm tính</div>
                <div className="text-lg font-bold">{convertMoney(160000)}</div>
              </div>
            </div>
            {/* <div className="flex flex-col justify-between items-center gap-y-4 p-4 bg-white border border-gray-300 rounded-md">
              {selectedVoucher === null ? (
                <div>Chưa chọn voucher</div>
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
            </div> */}
            <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-md gap-y-4">
              <div className="text-lg text-primary font-semibold">
                Thông tin chuyến đi
              </div>
              <div className="flex flex-col p-2 border border-gray-300 rounded-md gap-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <div>T6, 27/09/2025</div>
                  <div className="underline cursor-pointer">Xem chi tiết</div>
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
              type="submit"
              form="checkout-form"
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
