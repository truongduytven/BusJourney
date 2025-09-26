import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CircleDot,
  MapPinCheck,
  Play,
  Star,
  X,
  Zap,
} from "lucide-react";
import { convertMoney } from "@/utils";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import SelectSeatSection from "../pages/SearchPage/tripCard/selectSeatSection";
import DetailSection from "../pages/SearchPage/tripCard/detailSection";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TripResults } from "@/types/trip";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchTripDetail } from "@/redux/slices/tripDetailSlice";
import { fetchTripSeat } from "@/redux/slices/tripSeatSlice";
interface TripCardProps {
  selectedTrip: string | null;
  item: TripResults;
  setSelectedTrip: (tripId: string | null) => void;
}

export default function TripCard({
  selectedTrip,
  setSelectedTrip,
  item,
}: TripCardProps) {
  const dispatch = useAppDispatch();
  const { list, status, listTripId } = useAppSelector((state) => state.tripDeatails);
  const { listSeats, listSeatsTripId, statusSeats } = useAppSelector((state) => state.tripSeats);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const startTimeNumber = new Date(item.departureTime);
  startTimeNumber.setHours(
    new Date(item.departureTime).getHours() + 7,
    new Date(item.departureTime).getMinutes(),
    0,
    0
  );
  const startTime =
    startTimeNumber.toISOString().split("T")[1].slice(0, 5) || "00:00";
  const endTimeNumber = new Date(item.arrivalTime);
  endTimeNumber.setHours(
    new Date(item.arrivalTime).getHours() + 7,
    new Date(item.arrivalTime).getMinutes(),
    0,
    0
  );
  const endTime =
    endTimeNumber.toISOString().split("T")[1].slice(0, 5) || "00:00";
  // calculate duration
  const duration =
    new Date(item.arrivalTime).getTime() -
    new Date(item.departureTime).getTime();
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  //fetch trip detail 
  useEffect(() => {
    if (isShowDetail && !listTripId.includes(item.id)) {
      dispatch(fetchTripDetail(item.id));
    }
    if (isShowModal && selectedTrip && !listSeatsTripId.includes(item.id)) {
      dispatch(fetchTripSeat(item.id));
    }
  }, [dispatch, isShowDetail, isShowModal]);

  const ticketPrice = () => {
    if (item.buses.bus_companies.coupons[0].discountType === "percent") {
      const discountMoney =
        ((Number.parseInt(item.price) || 0) *
          (Number.parseInt(item.buses.bus_companies.coupons[0].discountValue) ||
            0)) /
        100;
      if (
        discountMoney >
        (Number.parseInt(
          item.buses.bus_companies.coupons[0].maxDiscountValue ?? "0"
        ) || 0)
      ) {
        return (
          (Number.parseInt(item.price) || 0) -
          (Number.parseInt(
            item.buses.bus_companies.coupons[0].maxDiscountValue ?? "0"
          ) || 0)
        );
      } else {
        return (Number.parseInt(item.price) || 0) - discountMoney;
      }
    } else {
      return (
        (Number.parseInt(item.price) || 0) -
        (Number.parseInt(
          item.buses.bus_companies.coupons[0].discountValue ?? "0"
        ) || 0)
      );
    }
  };
  return (
    <>
      <div
        className={cn(
          "w-full bg-white rounded-2xl mb-4 shadow-md flex flex-col p-4 hover:shadow-2xl",
          selectedTrip === item.id && "shadow-2xl"
        )}
      >
        <div className="flex relative">
          <Badge className="absolute text-white bg-green-600 top-2 -left-2">
            <Zap />
            Xác nhận tức thì
          </Badge>
          <img
            src={item.buses.images[0] || "@/assets/banner.png"}
            className="w-54 h-36 object-cover rounded-md"
          />
          <div className="flex flex-col flex-1 ml-6 gap-y-4">
            <div className="text-lg font-semibold text-primary">
              {item.buses.bus_companies.name || "Tên công ty"}{" "}
              <Badge className="text-white bg-primary">
                <Star className="text-yellow-500" fill="yellow" />
                {Number.parseFloat(item.avgRating).toFixed(1) || 0} (
                {item.numberComments || 0})
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              {item.buses.type_buses.name || "Loại xe"}
            </div>
            <div className="flex gap-x-2 h-24">
              <div className="flex flex-col text-primary justify-center items-center py-1">
                <CircleDot size={16} />
                <div className="border-l-2 border-dotted border-gray-300 mx-2 flex-1" />
                <MapPinCheck size={16} />
              </div>
              <div className="flex flex-col justify-between items-start text-lg text-primary">
                <div>
                  <b>{startTime} •</b>{" "}
                  {item.route.startLocation.name || "Địa chỉ đi"}
                </div>
                <div className="flex-1 flex items-center text-base text-gray-500">
                  {hours}h{minutes}m
                </div>
                <div>
                  <b>{endTime} •</b>{" "}
                  {item.route.endLocation.name || "Địa chỉ đến"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-y-3">
            <div className="text-xl text-secondary">
              {convertMoney(
                item.buses.bus_companies.coupons.length > 0
                  ? ticketPrice()
                  : Number.parseInt(item.price) || 0
              )}
            </div>
            {item.buses.bus_companies.coupons.length > 0 && (
              <div className="flex items-center">
                <div className="line-through font-base">
                  {convertMoney(Number.parseInt(item.price) || 0)}{" "}
                  <Badge className="bg-secondary text-white ml-1 rounded-xl">
                    {" "}
                    -
                    {item.buses.bus_companies.coupons[0].discountType ===
                    "percent"
                      ? `${
                          item.buses.bus_companies.coupons[0].discountValue.split(
                            "."
                          )[0]
                        } %`
                      : convertMoney(
                          Number.parseInt(
                            item.buses.bus_companies.coupons[0].discountValue
                          ) || 0
                        )}
                  </Badge>
                </div>
              </div>
            )}
            {item.buses.bus_companies.coupons.length > 0 ? (
              <div className="flex w-fit relative z-0 bg-gray-200 hover:scale-105 transition-transform duration-300">
                <div className="flex flex-col items-center justify-center border-r border-dashed rounded-l-lg shadow aspect-square bg-primary">
                  <img src={"/logo_white.png"} className="w-8 h-4" />
                </div>
                <div className="flex flex-end items-center p-1 border border-l w-fit border-dashed rounded-r-lg shadow bg-accent text-accent-foreground border-primary/50">
                  <div className="text-xs font-medium text-primary/50">
                    Giảm{" "}
                    {item.buses.bus_companies.coupons[0].discountType ===
                    "percent"
                      ? `${
                          item.buses.bus_companies.coupons[0].discountValue.split(
                            "."
                          )[0]
                        } %`
                      : convertMoney(
                          Number.parseInt(
                            item.buses.bus_companies.coupons[0].discountValue
                          ) || 0
                        )}{" "}
                    {item.buses.bus_companies.coupons[0].discountType ===
                    "percent"
                      ? `tối đa ${convertMoney(
                          Number.parseInt(
                            item.buses.bus_companies.coupons[0]
                              .maxDiscountValue || "0"
                          ) || 0
                        )}`
                      : ""}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-8" />
            )}
            <div className="text-gray-500">
              Còn {item.buses.type_buses.totalSeats || 0} chỗ trống
            </div>
            <div className="flex mt-2 gap-x-2">
              <div
                className="flex items-center underline cursor-pointer font-semibold"
                onClick={() => {
                  setIsShowDetail(!isShowDetail);
                  setSelectedTrip(null);
                }}
              >
                Thông tin chi tiết{" "}
                <Play size={12} fill="primary" className="rotate-90 ml-1" />
              </div>
              {selectedTrip && selectedTrip === item.id ? (
                <Button
                  onClick={() => setSelectedTrip(null)}
                  className="text-primary bg-gray-300 hover:bg-gray-300 transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  Đóng <X className="ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsShowDetail(false);
                    setIsShowModal(true);
                    setSelectedTrip(item.id || null);
                  }}
                  className="text-white bg-gradient-to-r from-tertiary/70 to-tertiary transition-transform duration-300 hover:scale-105 cursor-pointer"
                >
                  Chọn chuyến <ArrowRight className="ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
        {isShowDetail && <DetailSection data={list.find((data) => data.tripId === item.id)} status={status} />}
        {selectedTrip && selectedTrip === item.id && (
          <SelectSeatSection data={listSeats.find((seat) => seat.tripId === item.id)} status={statusSeats} setIsShowModal={setIsShowModal} />
        )}
      </div>
      {isShowModal && (
        <AlertDialog open={isShowModal} onOpenChange={setIsShowModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-xl mb-2">
                Quý khách lưu ý
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                - Quý khách lưu ý thời gian đón khách có thể chênh lệch 15-30'
                so với hệ thống. Đối với chuyến có giờ đi trong khung giờ từ
                6h-22h hàng ngày, quý khách vui lòng có mặt tại văn phòng trước
                20 phút so với giờ khởi hành để làm thủ tục lấy vé và trung
                chuyển ra xe lớn.
                <br /> - Nếu quý khách đến trễ hơn thời gian trên, vé xe sẽ
                không còn giá trị và quý khách sẽ không được hoàn tiền.
                <br /> - Đối với chuyến có giờ đi trong khung giờ từ 22h-6h hàng
                ngày, quý khách vui lòng có mặt tại văn phòng trước 30 phút so
                với giờ khởi hành để làm thủ tục lấy vé và trung chuyển ra xe
                lớn. Nếu quý khách đến trễ hơn thời gian trên, vé xe sẽ không
                còn giá trị và quý khách sẽ không được hoàn tiền.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setIsShowModal(false)}
                className="w-full text-white cursor-pointer py-3 h-auto"
              >
                Tôi đã đọc và đồng ý
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
