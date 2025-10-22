import InformationCheckoutForm from "@/components/forms/informationCheckoutForm";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import Divider from "@/components/ui/diviver";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { setUserInformation } from "@/redux/slices/selectedTripSlice";
import { updatePhone, getProfile } from "@/redux/thunks/authThunks";
import type { RootState } from "@/redux/store";
import { informationCheckoutSchema } from "@/schemas";
import { convertMoney, formatDate, formatTime } from "@/utils";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import {
  Armchair,
  ArrowLeft,
  CircleDot,
  InfoIcon,
  MapPin,
  MapPinCheck,
  MapPinCheckInside,
  ShieldCheck,
  User2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type z from "zod";
import { toast } from "sonner";

export default function InformationCheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const selectedTicket = useSelector(
    (state: RootState) => state.selectedTicket
  );
  const { user } = useAppSelector((state) => state.auth);

  // States for phone update dialog
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [pendingPhoneData, setPendingPhoneData] = useState<string>("");
  const [pendingFormData, setPendingFormData] = useState<z.infer<typeof informationCheckoutSchema> | null>(null);

  // Kiểm tra có ghế được chọn không
  useEffect(() => {
    if (selectedTicket.selectedSeats.length === 0) {
      navigate("/search", { replace: true });
    }
  }, [selectedTicket.selectedSeats.length, navigate]);

  const calculateRefundPercentage = (departureTime: string | Date): { percentage: number; color: string } => {
    const now = new Date();
    const departure = typeof departureTime === 'string' ? new Date(departureTime) : departureTime;
    
    const timeDiffInHours = (departure.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (timeDiffInHours > 24) {
      return {
        percentage: 0,
        color: "green"
      };
    } else if (timeDiffInHours > 12) {
      return {
        percentage: 30,
        color: "yellow"
      };
    } else if (timeDiffInHours > 6) {
      return {
        percentage: 50,
        color: "orange"
      };
    } else {
      return {
        percentage: 100,
        color: "red"
      };
    }
  };

  // Hàm lấy thông tin chính sách hủy
  const getCancellationPolicy = (departureTime: string | Date) => {
    const cancellationFee = calculateRefundPercentage(departureTime).percentage;
    const refundAmount = selectedTicket.totalPrice * (100 - cancellationFee) / 100;
    
    return {
      cancellationFeePercent: cancellationFee,
      refundPercent: 100 - cancellationFee,
      refundAmount: refundAmount,
      feeAmount: selectedTicket.totalPrice - refundAmount
    };
  };

  const handleSubmit = (data: z.infer<typeof informationCheckoutSchema>) => {
    // Check if user is Google account without phone and entered valid phone
    const isGoogleAccount = user?.type === 'google';
    const hasNoPhone = !user?.phone || user?.phone === '';
    const phoneChanged = user?.phone !== data.numberPhone;
    const phoneValid = /^0[0-9]{9}$/.test(data.numberPhone);

    if (isGoogleAccount && hasNoPhone && phoneChanged && phoneValid) {
      // Show dialog to ask if user wants to update phone
      setPendingPhoneData(data.numberPhone);
      setPendingFormData(data);
      setShowPhoneDialog(true);
      return;
    }

    // Normal flow - proceed to checkout
    dispatch(setUserInformation({
      name: data.fullName,
      email: data.email,
      phone: data.numberPhone
    }));
    navigate("/method-checkout");
  };

  const handlePhoneUpdate = async () => {
    try {
      await appDispatch(updatePhone({ phone: pendingPhoneData })).unwrap();
      
      // Update user profile to reflect the new phone
      await appDispatch(getProfile()).unwrap();
      
      toast.success("Cập nhật số điện thoại thành công!");
      
      // Continue with checkout
      if (pendingFormData) {
        dispatch(setUserInformation({
          name: pendingFormData.fullName,
          email: pendingFormData.email,
          phone: pendingFormData.numberPhone
        }));
        navigate("/method-checkout");
      }
    } catch (error) {
      toast.error(error as string || "Cập nhật số điện thoại thất bại");
    } finally {
      setShowPhoneDialog(false);
      setPendingPhoneData("");
      setPendingFormData(null);
    }
  };

  const handleSkipPhoneUpdate = () => {
    // Skip phone update and continue checkout
    if (pendingFormData) {
      dispatch(setUserInformation({
        name: pendingFormData.fullName,
        email: pendingFormData.email,
        phone: pendingFormData.numberPhone
      }));
      navigate("/method-checkout");
    }
    
    setShowPhoneDialog(false);
    setPendingPhoneData("");
    setPendingFormData(null);
  };

  return (
    <div className="w-full flex flex-1 flex-col justify-center bg-gray-background overflow-y-scroll mt-8 pt-10">
      <Container className="flex flex-col p-6">
        <div
          onClick={() => navigate(-1)}
          className="text-sm mb-4 font-medium cursor-pointer hover:underline"
        >
          <ArrowLeft className="inline" size={14} /> Quay lại
        </div>
        <div className="w-full flex justify-between gap-x-5">
          <div className="flex-5 flex flex-col ">
            <div className="flex flex-col bg-white p-5 border-[0.5px] border-gray-300 rounded-md">
              <div className="font-bold text-primary text-lg text-center">
                Thông tin liên hệ
              </div>
              <InformationCheckoutForm onSubmit={handleSubmit} user={user} />
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
                <div className="font-medium">
                  {convertMoney(selectedTicket.totalPrice)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Khuyến mãi</div>
                <div className="text-green-600 font-medium">
                  {" "}
                  -0% ({convertMoney(0)})
                </div>
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <div className="text-base font-semibold">Tạm tính</div>
                <div className="text-lg font-bold">
                  {convertMoney(selectedTicket.totalPrice)}
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
                    src={selectedTicket.tripImage || "https://static.vexere.com/production/images/1724302676718.jpeg"}
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
                <div className={`text-${calculateRefundPercentage(selectedTicket.departureTime).color}-500 font-medium text-sm flex items-center`}>
                  Phí hủy hiện tại {calculateRefundPercentage(selectedTicket.departureTime).percentage}%{" "}
                  <InfoIcon size={14} className="inline ml-2 text-primary" />
                </div>
              </div>
            </div>
            {/* Thêm thông tin chính sách hủy vé */}
            <div className="flex flex-col p-4 bg-white border border-gray-300 rounded-md gap-y-4">
              <div className="text-lg text-primary font-semibold">
                Chính sách hủy vé
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                <div className={`text-sm space-y-2 text-${calculateRefundPercentage(selectedTicket.departureTime).color}-500`}>
                  <div className="font-medium">
                    Phí hủy hiện tại: {calculateRefundPercentage(selectedTicket.departureTime).percentage}%
                  </div>
                  <div>
                    Số tiền hoàn lại: {convertMoney(getCancellationPolicy(selectedTicket.departureTime).refundAmount)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• <strong>Trên 24h trước giờ khởi hành:</strong> Hoàn 100% (phí hủy 0%)</div>
                <div>• <strong>12-24h trước giờ khởi hành:</strong> Hoàn 70% (phí hủy 30%)</div>
                <div>• <strong>6-12h trước giờ khởi hành:</strong> Hoàn 50% (phí hủy 50%)</div>
                <div>• <strong>Dưới 6h trước giờ khởi hành:</strong> Không hoàn (phí hủy 100%)</div>
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

      {/* Phone Update Dialog */}
      <AlertDialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cập nhật số điện thoại</AlertDialogTitle>
            <AlertDialogDescription>
              Chúng tôi nhận thấy bạn đăng nhập bằng Google và chưa có số điện thoại trong tài khoản. 
              Bạn có muốn thêm số điện thoại <strong>{pendingPhoneData}</strong> vào tài khoản để dễ dàng quản lý đơn hàng không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSkipPhoneUpdate}>
              Bỏ qua
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePhoneUpdate}>
              Cập nhật
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
