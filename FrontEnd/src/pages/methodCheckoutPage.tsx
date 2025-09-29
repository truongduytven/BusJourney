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
import { convertMoney, formatDate, formatTime } from "@/utils";
import {
  Armchair,
  ArrowLeft,
  Bus,
  CircleDot,
  InfoIcon,
  MapPin,
  MapPinCheck,
  MapPinCheckInside,
  RefreshCcw,
  User2Icon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type z from "zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { setUserInformation } from "@/redux/slices/selectedTripSlice";
import type { CouponData } from "@/types/trip";
import { useAppSelector } from "@/redux/hook";

export default function MethodCheckoutPage() {
  const [selectedVoucher, setSelectedVoucher] = useState<CouponData | null>(
    null
  );
  const [selectedMethod, setSelectedMethod] = useState<string>("VNPAY");
  const { list } = useSelector((state: RootState) => state.trips);
  const dispatch = useDispatch();
  const selectedTicket = useSelector(
    (state: RootState) => state.selectedTicket
  );
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  // Kiểm tra thông tin có thay đổi so với thông tin đăng nhập không
  const isUserInfoModified = () => {
    if (!user || !selectedTicket.userInformation.name) return false;
    
    return (
      selectedTicket.userInformation.name !== user.name ||
      selectedTicket.userInformation.email !== user.email ||
      selectedTicket.userInformation.phone !== user.phone
    );
  };

  // Kiểm tra có ghế được chọn không
  useEffect(() => {
    if (selectedTicket.selectedSeats.length === 0) {
      navigate("/search", { replace: true });
    }
  }, [selectedTicket.selectedSeats.length, navigate]);

  const handleSubmit = (data: z.infer<typeof informationCheckoutSchema>) => {
    // Lưu vào Redux state
    dispatch(
      setUserInformation({
        name: data.fullName,
        email: data.email,
        phone: data.numberPhone,
      })
    );
  };

  const calculateRefundPercentage = (
    departureTime: string | Date
  ): { percentage: number; color: string } => {
    const now = new Date();
    const departure =
      typeof departureTime === "string"
        ? new Date(departureTime)
        : departureTime;
    const timeDiffInHours =
      (departure.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (timeDiffInHours > 24) {
      return {
        percentage: 0,
        color: "green",
      };
    } else if (timeDiffInHours > 12) {
      return {
        percentage: 30,
        color: "yellow",
      };
    } else if (timeDiffInHours > 6) {
      return {
        percentage: 50,
        color: "orange",
      };
    } else {
      return {
        percentage: 100,
        color: "red",
      };
    }
  };

  return (
    <div className="w-full flex flex-1 flex-col justify-center bg-gray-background overflow-y-scroll pt-18">
      <Container className="flex flex-col p-6">
        <div
          onClick={() => navigate(-1)}
          className="text-sm mb-4 font-medium cursor-pointer hover:underline"
        >
          <ArrowLeft className="inline" size={14} /> Quay lại
        </div>
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
                    <InformationCheckoutForm onSubmit={handleSubmit} user={selectedTicket.userInformation}/>
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
              
              {/* Hiển thị trạng thái thay đổi thông tin */}
              {isUserInfoModified() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <InfoIcon size={16} />
                    <span className="text-sm font-medium">
                      Thông tin đã được chỉnh sửa khác với thông tin tài khoản
                    </span>
                  </div>
                  <div className="text-xs text-yellow-700 mt-1">
                    Thông tin gốc: {user?.name} - {user?.email} - {user?.phone}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <div>Tên người đi</div>
                <div className="font-medium">{selectedTicket.userInformation.name}</div>
              </div>
              <div className="flex justify-between">
                <div>Số điện thoại</div>
                <div className="font-medium">{selectedTicket.userInformation.phone}</div>
              </div>
              <div className="flex justify-between items-center">
                <div>Email</div>
                <div className="font-medium">{selectedTicket.userInformation.email}</div>
              </div>
            </div>
          </div>
          <div className="flex-3 flex flex-col gap-y-5">
            <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-md gap-y-4">
              <div className="flex justify-between">
                <div>Giá vé</div>
                <div className="font-medium">
                  {convertMoney(selectedTicket.totalPrice)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Khuyến mãi</div>
                {selectedVoucher ? (
                  <div className="text-green-600 font-medium">
                    {" "}
                    {selectedVoucher.discountType === "percent"
                      ? `-${Number(selectedVoucher.discountValue).toFixed(0)}%`
                      : `-${convertMoney(
                          Number(selectedVoucher.discountValue)
                        )}`}{" "}
                    (
                    {selectedVoucher.discountType === "percent"
                      ? convertMoney(
                          (Number(selectedVoucher.discountValue) / 100) *
                            selectedTicket.totalPrice >
                            Number(selectedVoucher.maxDiscountValue)
                            ? Number(selectedVoucher.maxDiscountValue)
                            : (Number(selectedVoucher.discountValue) / 100) *
                                selectedTicket.totalPrice
                        )
                      : convertMoney(Number(selectedVoucher.discountValue))}
                    )
                  </div>
                ) : (
                  <div className="text-green-600 font-medium">
                    {" "}
                    -0% ({convertMoney(0)})
                  </div>
                )}
              </div>
              {selectedVoucher === null ? (
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
                          {list?.data
                            .find((trip) => trip.id === selectedTicket.tripId)
                            ?.buses.bus_companies.coupons.map((item) => (
                              <div
                                className="flex justify-between items-center ml-2"
                                key={item.id}
                              >
                                <VoucherTicket
                                  data={item}
                                  className="hover:scale-100 w-3/4"
                                />
                                <Button
                                  onClick={() => setSelectedVoucher(item)}
                                  className="bg-primary text-white hover:bg-primary/90 p-0"
                                >
                                  <AlertDialogCancel className="cursor-pointer">
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
              ) : (
                // Khi đã có voucher, show Voucher + 2 icon
                <div className="relative w-full flex justify-center">
                  <div className="group flex items-center w-full">
                    {/* Voucher hiển thị */}
                    <div className="transition-transform duration-300 group-hover:-translate-x-12">
                      <VoucherTicket
                        data={selectedVoucher}
                        isTag={false}
                        isScale={false}
                      />
                    </div>

                    {/* Icon hành động */}
                    <div className="absolute right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button
                            variant="default"
                            className="rounded-full bg-yellow-400 hover:bg-yellow-500"
                            size="icon"
                          >
                            <RefreshCcw />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader className="w-full sm:text-center font-semibold text-lg">
                            Chọn voucher khác
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            <ScrollArea>
                              <div className="flex flex-col max-h-[50vh] pr-4 mt-2 mb-4 gap-4">
                                {list?.data
                                  .find(
                                    (trip) => trip.id === selectedTicket.tripId
                                  )
                                  ?.buses.bus_companies.coupons.map((item) => (
                                    <div
                                      className="flex justify-between items-center ml-2"
                                      key={item.id}
                                    >
                                      <VoucherTicket
                                        data={item}
                                        className="hover:scale-100 w-3/4"
                                      />
                                      <Button
                                        onClick={() => setSelectedVoucher(item)}
                                        className="bg-primary text-white hover:bg-primary/90 p-0"
                                      >
                                        <AlertDialogCancel className="cursor-pointer">
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
                      <Button
                        variant="default"
                        className="rounded-full bg-red-400 hover:bg-red-500"
                        size="icon"
                        onClick={() => setSelectedVoucher(null)}
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <Divider />
              <div className="flex justify-between items-center">
                <div className="text-base font-semibold">Tạm tính</div>
                <div className="text-lg font-bold">
                  {selectedVoucher
                    ? convertMoney(
                        selectedTicket.totalPrice -
                          (selectedVoucher?.discountType === "percent"
                            ? (Number(selectedVoucher.discountValue) / 100) *
                                selectedTicket.totalPrice >
                              Number(selectedVoucher.maxDiscountValue)
                              ? Number(selectedVoucher.maxDiscountValue)
                              : (Number(selectedVoucher.discountValue) / 100) *
                                selectedTicket.totalPrice
                            : Number(selectedVoucher?.discountValue))
                      )
                    : convertMoney(selectedTicket.totalPrice || 0)}
                </div>
              </div>
            </div>
            <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-md gap-y-4">
              <div className="text-lg text-primary font-semibold">
                Thông tin chuyến đi
              </div>
              <div className="flex flex-col p-2 border border-gray-300 rounded-md gap-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <div>{formatDate(selectedTicket.departureTime)}</div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <div className="underline cursor-pointer text-blue-500">
                        Xem chi tiết
                      </div>
                    </SheetTrigger>
                    <SheetContent className="px-4 pt-10">
                      <div className="text-lg text-center font-bold">
                        Thông tin chuyến đi
                      </div>
                      <div className="flex flex-col gap-y-6 my-6">
                        <div className="flex justify-between">
                          <div className="text-sm text-primary/70">Tuyến</div>
                          <div className="font-medium text-sm text-primary">
                            {selectedTicket.route}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-primary/70">Chuyến</div>
                          <div className="font-medium text-sm text-primary">
                            {formatTime(selectedTicket.departureTime)}{" "}
                            {formatDate(selectedTicket.departureTime)}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-primary/70">Nhà xe</div>
                          <div className="font-medium text-sm text-primary">
                            {selectedTicket.busCompanyName}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-primary/70">Loại xe</div>
                          <div className="font-medium text-sm text-primary">
                            {selectedTicket.typeBusName}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-primary/70">
                            Số lượng
                          </div>
                          <div className="font-medium text-sm text-primary">
                            {selectedTicket.selectedSeats.length} vé
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-primary/70">Mã ghế</div>
                          <div className="font-medium text-sm text-primary">
                            {selectedTicket.selectedSeats
                              .map((seat) => seat.code)
                              .join(", ")}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-primary/70">
                            Tạm tính
                          </div>
                          <div className="font-medium text-sm text-primary">
                            {convertMoney(selectedTicket.totalPrice)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-y-2 text-sm">
                          <div className="text-base font-bold">
                            <MapPin
                              className="inline mr-2 text-white"
                              fill="blue"
                            />
                            Điểm đón
                          </div>
                          <div>
                            {selectedTicket.selectedPickUpPoint?.locationName}
                          </div>
                          <div>
                            Dự kiến đón lúc{" "}
                            {formatTime(
                              selectedTicket.selectedPickUpPoint?.time ||
                                new Date()
                            )}
                            {" - "}
                            {formatDate(
                              selectedTicket.selectedPickUpPoint?.time ||
                                new Date()
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-y-2 text-sm">
                          <div className="text-base font-bold">
                            <MapPinCheckInside
                              className="inline mr-2 text-white"
                              fill="red"
                            />
                            Điểm trả
                          </div>
                          <div>
                            {selectedTicket.selectedDropOffPoint?.locationName}
                          </div>
                          <div>
                            Dự kiến trả lúc{" "}
                            {formatTime(
                              selectedTicket.selectedDropOffPoint?.time ||
                                new Date()
                            )}
                            {" - "}
                            {formatDate(
                              selectedTicket.selectedDropOffPoint?.time ||
                                new Date()
                            )}
                          </div>
                        </div>
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button className="w-full bg-primary text-white hover:bg-primary/90 p-0">
                            Đóng
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
                <div className="flex ">
                  <img
                    src={
                      selectedTicket.tripImage ||
                      "https://static.vexere.com/production/images/1724302676718.jpeg"
                    }
                    alt="ảnh xe"
                    className="w-16 h-16 object-cover"
                  />
                  <div className="flex flex-col gap-y-1 ml-4 text-sm">
                    <div className="font-semibold">
                      {selectedTicket.busCompanyName}
                    </div>
                    <div>{selectedTicket.typeBusName}</div>
                    <div className="flex gap-x-1 items-center text-xs text-gray-500">
                      <User2Icon fill="gray" size={14} />
                      <div>{selectedTicket.selectedSeats.length}</div>
                      <Armchair className="ml-3" fill="gray" size={14} />
                      <div>
                        {selectedTicket.selectedSeats
                          .map((r) => r.code)
                          .join(",")}
                      </div>
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
                      <b>{formatTime(selectedTicket.departureTime)} •</b>{" "}
                      {selectedTicket.route.split(" - ")[0]}
                    </div>
                    <div className="flex-1 flex items-center text-sm text-transparent">
                      2h30m
                    </div>
                    <div>
                      <b>{formatTime(selectedTicket.arrivalTime)} •</b>{" "}
                      {selectedTicket.route.split(" - ")[1]}
                    </div>
                  </div>
                </div>
                <Divider />
                <div
                  className={`text-${
                    calculateRefundPercentage(selectedTicket.departureTime)
                      .color
                  }-500 font-medium text-sm flex items-center`}
                >
                  Phí hủy hiện tại{" "}
                  {
                    calculateRefundPercentage(selectedTicket.departureTime)
                      .percentage
                  }
                  % <InfoIcon size={14} className="inline ml-2 text-primary" />
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
