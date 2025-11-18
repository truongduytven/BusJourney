import Divider from "@/components/ui/diviver";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CircleCheck,
  CircleEllipsis,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import Seat from "@/assets/seat.png";
import SelectedSeat from "@/assets/selected_seat.png";
import BlockedSeat from "@/assets/blocked_seat.png";
import BedSeat from "@/assets/bed_seat.png";
import SelectedBedSeat from "@/assets/selected_bed_seat.png";
import BlockedBedSeat from "@/assets/blocked_bed_seat.png";
import SteeringWheel from "@/assets/steering-wheel.png";
import { convertMoney, formatTime } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PrefixInput from "@/components/ui/prefix-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import type { IPoint, ISeat, ITripSeatResult } from "@/types/trip";
import Loading from "@/components/ui/loading";
import { useDebounce } from "@uidotdev/usehooks";
import { useDispatch } from "react-redux";
import { setSelectedTrip } from "@/redux/slices/selectedTripSlice";
import type { ITripData } from "@/types/selectedTrip";

interface SelectSeatSectionProps {
  setIsShowModal: (isShow: boolean) => void;
  data?: ITripSeatResult | undefined;
  tripData: ITripData
  status: string;
}

export default function SelectSeatSection({
  setIsShowModal,
  data,
  tripData,
  status,
}: SelectSeatSectionProps) {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(50);
  const [inputPickUp, setInputPickUp] = useState("");
  const [inputDropOff, setInputDropOff] = useState("");
  const [selectPickUp, setSelectPickUp] = useState<string>("1");
  const [selectDropOff, setSelectDropOff] = useState<string>("1");
  const [listPickupPoint, setListPickupPoint] = useState<IPoint[]>([]);
  const [listDropOffPoint, setListDropOffPoint] = useState<IPoint[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
  const debouncedInputPickUp = useDebounce(inputPickUp, 500);
  const debouncedInputDropOff = useDebounce(inputDropOff, 500);
  const ticketBuyed = data ? data.bookedSeats : [];
  const isBedSeat = data
    ? data.typeName.toLowerCase().includes("giường nằm")
    : false;
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setListPickupPoint(data.points.startPoint);
      setListDropOffPoint(data.points.endPoint);
      setSelectPickUp(data.points.startPoint[0]?.id || "");
      setSelectDropOff(data.points.endPoint[0]?.id || "");
    }
  }, [data]);

  const handleRenderSeat = (
    seatNumber: number,
    isFloor: boolean,
    isBedSeat: boolean
  ) => {
    const numberOfRows = data?.isFloor
      ? Math.floor(seatNumber / (data?.numberColsFloor ?? 0)) +
        (seatNumber % (data?.numberColsFloor ?? 0) === 0 ? 0 : 1)
      : Math.floor(seatNumber / (data?.numberCols ?? 0)) +
        (seatNumber % (data?.numberCols ?? 0) === 0 ? 0 : 1);

    const numberOfCols =
      seatNumber %
        (data?.isFloor ? data?.numberColsFloor ?? 0 : data?.numberCols ?? 0) ===
      0
        ? data?.numberCols ?? 0
        : seatNumber %
          (isFloor ? data?.numberColsFloor ?? 0 : data?.numberCols ?? 0);

    if (numberOfCols === 1 && numberOfRows === 1) {
      return !isFloor ? (
        <img src={SteeringWheel} alt="Vô lăng" className="w-7 h-7" />
      ) : (
        <div></div>
      );
    }
    const findByRowCol = data?.seats.find(
      (seat) =>
        seat.indexRow === numberOfRows &&
        seat.indexCol === numberOfCols &&
        seat.floor === (isFloor ? 2 : 1)
    );
    if (!findByRowCol) {
      return <div></div>;
    }
    if (ticketBuyed.includes(findByRowCol.code)) {
      return (
        <img
          src={isBedSeat ? BlockedBedSeat : BlockedSeat}
          alt={`Ghế ${seatNumber}`}
          className={cn("w-7 h-6 cursor-not-allowed", isBedSeat && "w-6 h-10")}
        />
      );
    }
    if (selectedSeats.includes(findByRowCol)) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <img
              src={isBedSeat ? SelectedBedSeat : SelectedSeat}
              alt={`Ghế ${seatNumber}`}
              className={cn("w-7 h-6 cursor-pointer", isBedSeat && "w-6 h-10")}
              onClick={() => handleSelectSeat(findByRowCol)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div>
              Ghế {findByRowCol.code} giá{" "}
              {convertMoney(Number(data?.price || 0))}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    return (
      <Tooltip>
        <TooltipTrigger>
          <img
            src={isBedSeat ? BedSeat : Seat}
            alt={`Ghế ${seatNumber}`}
            className={cn("w-7 h-6 cursor-pointer", isBedSeat && "w-6 h-10")}
            onClick={() => handleSelectSeat(findByRowCol)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div>
            Ghế {findByRowCol.code} giá {convertMoney(Number(data?.price || 0))}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  const handleSelectSeat = (seat: ISeat) => {
    let newSelectedSeats = [...selectedSeats];
    if (newSelectedSeats.includes(seat)) {
      newSelectedSeats = newSelectedSeats.filter((s) => s !== seat);
    } else {
      newSelectedSeats.push(seat);
    }
    if (newSelectedSeats.length > 8) {
      toast.error("Bạn chỉ được chọn tối đa 8 ghế!");
      return;
    }
    setSelectedSeats(newSelectedSeats);
  };

  useEffect(() => {
    const searchPickup = async () => {
      let result = data?.points.startPoint;
      if (debouncedInputPickUp) {
        result = result?.filter((point) =>
          point.locationName
            .toLowerCase()
            .includes(debouncedInputPickUp.toLowerCase())
        );
      }
      setListPickupPoint(result || []);
    };
    const searchDropOff = async () => {
      let result = data?.points.endPoint;
      if (debouncedInputDropOff) {
        result = result?.filter((point) =>
          point.locationName
            .toLowerCase()
            .includes(debouncedInputDropOff.toLowerCase())
        );
      }
      setListDropOffPoint(result || []);
    };
    searchPickup();
    searchDropOff();
  }, [debouncedInputPickUp, debouncedInputDropOff, data]);

  const handleFinishSelectSeat = () => {
    dispatch(setSelectedTrip({
      tripId: tripData.tripId,
      route: tripData.route,
      tripImage: tripData.tripImage,
      busCompanyName: tripData.busCompanyName,
      departureTime: tripData.departureTime,
      arrivalTime: tripData.arrivalTime,
      typeBusName: tripData.typeBusName,
      selectedSeats: selectedSeats,
      selectedPickUpPoint: data?.points.startPoint.find(point => point.id === selectPickUp),
      selectedDropOffPoint: data?.points.endPoint.find(point => point.id === selectDropOff),
      totalPrice: selectedSeats.length * Number(data?.price || 0)
    }))
    navigate("/information-checkout");
  }

  return (
    <div className="mt-10 border-t border-gray-300 pt-4 text-sm text-gray-400 w-full flex flex-col">
      <div className="flex justify-center w-full">
        <div className="flex flex-col w-4/5">
          <div className="flex justify-between text-lg font-semibold text-primary">
            <div className="flex-1 flex items-center justify-start flex-col gap-y-1">
              <div className="font-base text-green-500">Chọn chuyến</div>
              <CircleCheck className="text-green-500" />
            </div>
            <div className="flex-1 flex items-center justify-center flex-col gap-y-1">
              <div
                className={`font-base ${
                  progress === 50 ? "text-primary" : "text-green-500"
                }`}
              >
                Chọn ghế
              </div>
              {progress > 50 ? (
                <CircleCheck className="text-green-500" />
              ) : (
                <CircleEllipsis className="text-primary" />
              )}
            </div>
            <div className="flex-1 flex items-center justify-end flex-col gap-y-1">
              <div
                className={`font-base ${
                  progress === 100 ? "text-primary" : "text-gray-400"
                }`}
              >
                Chọn điểm đón/trả
              </div>
              <div>
                {progress === 100 ? (
                  <CircleEllipsis className="text-primary" />
                ) : (
                  <CircleEllipsis className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Progress value={progress} className="w-2/3 mt-2" />
          </div>
        </div>
      </div>
      <Divider className="my-6" />
      {status === "loading" ? (
        <div className="w-full flex flex-col justify-center items-center h-96">
          <Loading />
          <div className="text-gray-500 text-xl">Đang tải sơ đồ ghế...</div>
        </div>
      ) : progress === 50 && data ? (
        <>
          <div className="flex w-full justify-between">
            <div className="flex items-center justify-between p-3 rounded-xl w-2/5 border border-primary/20 bg-primary/10 text-primary">
              <div>Quy định khi đi xe</div>
              <div
                className="font-semibold underline cursor-pointer hover:font-extrabold"
                onClick={() => setIsShowModal(true)}
              >
                Xem chi tiết
              </div>
            </div>
            <div className="flex items-center justify-between p-3 gap-x-2 rounded-xl w-fit border border-green-600 bg-green-200 text-green-600">
              <ShieldCheck />
              <div>Bus Journey cam kết giữ đúng chỗ bạn đã chọn</div>
            </div>
          </div>
          <div className="flex mt-20 justify-between px-16">
            <div className="flex flex-1 flex-col gap-y-6 text-base text-primary">
              <div className="text-lg font-semibold text-primary">
                Chú thích
              </div>
              <div className="flex items-center gap-x-1">
                <img
                  src={isBedSeat ? BlockedBedSeat : BlockedSeat}
                  alt="Ghế bị chặn"
                  className={cn("w-6 h-10", !isBedSeat && "w-7 h-6")}
                />{" "}
                <div className="ml-2">Ghế không bán</div>
              </div>
              <div className="flex items-center gap-x-1">
                <img
                  src={isBedSeat ? SelectedBedSeat : SelectedSeat}
                  alt="Ghế đang chọn"
                  className={cn("w-6 h-10", !isBedSeat && "w-7 h-6")}
                />{" "}
                <div className="ml-2">Ghế đang chọn</div>
              </div>
              <div className="flex items-center gap-x-1">
                <img
                  src={isBedSeat ? BedSeat : Seat}
                  alt="Ghế trống"
                  className={cn("w-6 h-10", !isBedSeat && "w-7 h-6")}
                />{" "}
                <div className="ml-2 font-bold">
                  {convertMoney(Number(data.price))}
                </div>
              </div>
            </div>

            <div className="flex-2 flex justify-end gap-x-4">
              <div className="w-1/2 flex flex-col items-center">
                <div>Tầng dưới</div>
                <div className="flex flex-col bg-gray-100 min-h-40 min-w-40 px-3 py-4 rounded-2xl">
                  <div
                    className="w-full grid gap-3 mt-6"
                    style={{
                      gridTemplateColumns: `repeat(${data.numberCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {data &&
                      Array.from(
                        {
                          length: data.numberRows * data.numberCols,
                        },
                        (_, i) => i + 1
                      ).map((seatNumber) => (
                        <div
                          className="w-full flex justify-center"
                          key={seatNumber}
                        >
                          {handleRenderSeat(seatNumber, false, isBedSeat)}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {data && data.isFloor && (
                <div className="w-1/2 flex flex-col items-center">
                  <div>Tầng trên</div>
                  <div className="flex flex-col bg-gray-100 min-h-40 min-w-40 px-3 py-4 rounded-2xl">
                    <div
                      className="w-full grid gap-3 mt-6"
                      style={{
                        gridTemplateColumns: `repeat(${data?.numberColsFloor}, minmax(0, 1fr))`,
                      }}
                    >
                      {data &&
                        data?.numberColsFloor &&
                        data?.numberRowsFloor &&
                        Array.from(
                          {
                            length:
                              data?.numberColsFloor * data?.numberRowsFloor,
                          },
                          (_, i) => i + 1
                        ).map((seatNumber) => (
                          <div
                            className="w-full flex justify-center"
                            key={seatNumber}
                          >
                            {handleRenderSeat(seatNumber, true, isBedSeat)}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Divider className="my-4" />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-x-4">
              <div className="text-base text-primary">
                Ghế đã chọn:{" "}
                <span className="font-semibold text-lg text-secondary">
                  {selectedSeats.map(seat => seat.code).join(", ")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <div className="text-base text-primary">
                Tổng cộng:{" "}
                <span className="font-semibold text-lg text-secondary">
                  {convertMoney(
                    selectedSeats.length * Number(data?.price || 0)
                  )}
                </span>
              </div>
              <Button
                onClick={() => setProgress(100)}
                disabled={selectedSeats.length === 0}
                className="text-white cursor-pointer"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between p-3 gap-x-2 rounded-xl w-fit border border-green-600 bg-green-200 text-green-600">
            <ShieldCheck />
            <div>
              An tâm được đón đúng nơi, trả đúng chỗ đã chọn và dễ dàng thay đổi
              khi cần.
            </div>
          </div>
          <div className="flex justify-center gap-x-4 mt-10">
            <div className="flex-1 flex flex-col border border-gray-400 rounded-md min-h-10 h-96">
              <div className="flex items-center py-2 px-4 bg-gray-100 rounded-md">
                <div className="w-2/5 text-xl text-primary font-semibold">
                  Điểm đón
                </div>
                <PrefixInput
                  value={inputPickUp}
                  onChange={(e) => {
                    setInputPickUp(e.target.value);
                  }}
                  className="rounded-lg bg-white text-primary"
                  placeholder="Tìm trong danh sách"
                  prefixIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="py-2 px-4 bg-tertiary/20 text-primary">
                <b>*Lưu ý:</b> Sử dụng tên địa phương trước sáp nhập
              </div>
              <RadioGroup
                defaultValue={selectPickUp}
                className="bg-white gap-0 overflow-x-scroll"
              >
                {listPickupPoint.length > 0 ? (
                  listPickupPoint.map((item) => (
                    <div
                      onClick={() => setSelectPickUp(item.id)}
                      className="py-3 px-5 flex flex-col border-b border-gray-300 cursor-pointer text-base"
                    >
                      <div className="flex items-center gap-x-2">
                        <RadioGroupItem
                          checked={selectPickUp === item.id}
                          value={item.id}
                          id={`option-${item.id}`}
                        />
                        <div className="text-primary font-semibold">
                          {formatTime(item.time)}
                        </div>
                      </div>
                      <div className="text-primary font-semibold ml-6">
                        {item.locationName}
                      </div>
                      <div className="text-sm text-gray-500 ml-6">
                        79 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-gray-500 flex justify-center">
                    Không tìm thấy điểm đón
                  </div>
                )}
              </RadioGroup>
            </div>
            <div className="flex-1 flex flex-col border border-gray-400 rounded-md min-h-10 h-96">
              <div className="flex items-center py-2 px-4 bg-gray-100 rounded-md">
                <div className="w-2/5 text-xl text-primary font-semibold">
                  Điểm trả
                </div>
                <PrefixInput
                  value={inputDropOff}
                  onChange={(e) => setInputDropOff(e.target.value)}
                  className="rounded-lg bg-white text-primary"
                  placeholder="Tìm trong danh sách"
                  prefixIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="py-2 px-4 bg-tertiary/20 text-primary">
                <b>*Lưu ý:</b> Sử dụng tên địa phương trước sáp nhập
              </div>
              <RadioGroup
                defaultValue={selectDropOff}
                className="bg-white gap-0 overflow-x-scroll"
              >
                {listDropOffPoint.length > 0 ? (
                  listDropOffPoint.map((item) => (
                    <div
                      onClick={() => setSelectDropOff(item.id)}
                      className="py-3 px-5 flex flex-col border-b border-gray-300 cursor-pointer text-base"
                    >
                      <div className="flex items-center gap-x-2">
                        <RadioGroupItem
                          checked={selectDropOff === item.id}
                          value={item.id}
                          id={`option-${item.id}`}
                        />
                        <div className="text-primary font-semibold">
                          {formatTime(item.time)}
                        </div>
                      </div>
                      <div className="text-primary font-semibold ml-6">
                        {item.locationName}
                      </div>
                      <div className="text-sm text-gray-500 ml-6">
                        79 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-gray-500 flex justify-center">
                    Không tìm thấy điểm đón
                  </div>
                )}
              </RadioGroup>
            </div>
          </div>
          <Divider className="my-6" />
          <div className="flex items-center justify-between px-2 pb-2">
            <Button
              onClick={() => setProgress(50)}
              variant="outline"
              className="border border-gray-400 cursor-pointer"
            >
              <ArrowLeft /> Quay lại
            </Button>
            <Button
              onClick={() => handleFinishSelectSeat()}
              disabled={selectedSeats.length === 0}
              className="text-white cursor-pointer"
            >
              Tiếp tục
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
