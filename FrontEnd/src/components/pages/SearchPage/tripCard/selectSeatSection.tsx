import Divider from "@/components/ui/diviver";
import { Progress } from "@/components/ui/progress";
import { useAppSelector } from "@/redux/hook";
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
import { convertMoney } from "@/utils";
import type { TypeBus } from "@/types/typeBus";
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

interface SelectSeatSectionProps {
  setIsShowModal: (isShow: boolean) => void;
}

export default function SelectSeatSection({
  setIsShowModal,
}: SelectSeatSectionProps) {
  const [progress, setProgress] = useState(50);
  const [inputPickUp, setInputPickUp] = useState("");
  const [inputDropOff, setInputDropOff] = useState("");
  const [selectPickUp, setSelectPickUp] = useState<string>("1");
  const [selectDropOff, setSelectDropOff] = useState<string>("1");
  const typeBuses = useAppSelector((state) => state.typeBuses.list) || [];
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTypeBus, setSelectedTypeBus] = useState<TypeBus | null>(null);
  const ticketBuyed = ["A1", "A5", "A12"];
  const [isBedSeat, setIsBedSeat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeBuses.length > 0 && !selectedTypeBus) {
      setSelectedTypeBus(typeBuses[1]);
      setIsBedSeat(typeBuses[1]?.name.toLowerCase().includes("giường"));
      console.log(typeBuses[1]);
    }
  }, [typeBuses]);

  const handleRenderSeat = (
    seatNumber: number,
    isFloor: boolean,
    isBedSeat: boolean
  ) => {
    const numberOfRows = isFloor
      ? Math.floor(seatNumber / (selectedTypeBus?.numberColsFloor ?? 0)) +
        (seatNumber % (selectedTypeBus?.numberColsFloor ?? 0) === 0 ? 0 : 1)
      : Math.floor(seatNumber / (selectedTypeBus?.numberCols ?? 0)) +
        (seatNumber % (selectedTypeBus?.numberCols ?? 0) === 0 ? 0 : 1);

    const numberOfCols =
      seatNumber %
        (isFloor
          ? selectedTypeBus?.numberColsFloor ?? 0
          : selectedTypeBus?.numberCols ?? 0) ===
      0
        ? selectedTypeBus?.numberCols ?? 0
        : seatNumber %
          (isFloor
            ? selectedTypeBus?.numberColsFloor ?? 0
            : selectedTypeBus?.numberCols ?? 0);

    console.log(numberOfRows, numberOfCols);
    if (numberOfCols === 1 && numberOfRows === 1) {
      return !isFloor ? (
        <img src={SteeringWheel} alt="Vô lăng" className="w-7 h-7" />
      ) : (
        <div></div>
      );
    }
    const findByRowCol = selectedTypeBus?.seats.find(
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
    if (selectedSeats.includes(findByRowCol.code)) {
      return (
        <Tooltip>
          <TooltipTrigger>
            <img
              src={isBedSeat ? SelectedBedSeat : SelectedSeat}
              alt={`Ghế ${seatNumber}`}
              className={cn("w-7 h-6 cursor-pointer", isBedSeat && "w-6 h-10")}
              onClick={() => handleSelectSeat(findByRowCol.code)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <div>
              Ghế {findByRowCol.code} giá {convertMoney(240000)}
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
            onClick={() => handleSelectSeat(findByRowCol.code)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div>
            Ghế {findByRowCol.code} giá {convertMoney(240000)}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  const handleSelectSeat = (seatNumber: string) => {
    let newSelectedSeats = [...selectedSeats];
    if (newSelectedSeats.includes(seatNumber)) {
      newSelectedSeats = newSelectedSeats.filter((s) => s !== seatNumber);
    } else {
      newSelectedSeats.push(seatNumber);
    }
    if (newSelectedSeats.length > 8) {
      toast.error("Bạn chỉ được chọn tối đa 8 ghế!");
      return;
    }
    setSelectedSeats(newSelectedSeats);
  };
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
      {progress === 50 ? (
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
                <div className="ml-2 font-bold">{convertMoney(240000)}</div>
              </div>
            </div>

            <div className="flex-1 flex justify-end gap-x-4">
              <div className="w-1/2 flex flex-col items-center">
                <div>Tầng dưới</div>
                <div className="flex flex-col bg-gray-100 min-h-40 min-w-40 px-3 py-4 rounded-2xl">
                  <div
                    className="w-full grid gap-3 mt-6"
                    style={{
                      gridTemplateColumns: `repeat(${selectedTypeBus?.numberCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {selectedTypeBus &&
                      Array.from(
                        {
                          length:
                            selectedTypeBus?.numberRows *
                            selectedTypeBus?.numberCols,
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
              {selectedTypeBus && selectedTypeBus.isFloors && (
                <div className="w-1/2 flex flex-col items-center">
                  <div>Tầng trên</div>
                  <div className="flex flex-col bg-gray-100 min-h-40 min-w-40 px-3 py-4 rounded-2xl">
                    <div
                      className="w-full grid gap-3 mt-6"
                      style={{
                        gridTemplateColumns: `repeat(${selectedTypeBus?.numberCols}, minmax(0, 1fr))`,
                      }}
                    >
                      {selectedTypeBus &&
                        selectedTypeBus?.numberColsFloor &&
                        selectedTypeBus?.numberRowsFloor &&
                        Array.from(
                          {
                            length:
                              selectedTypeBus?.numberColsFloor *
                              selectedTypeBus?.numberRowsFloor,
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
                  {selectedSeats.join(", ")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <div className="text-base text-primary">
                Tổng cộng:{" "}
                <span className="font-semibold text-lg text-secondary">
                  {convertMoney(selectedSeats.length * 240000)}
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
                  onChange={(e) => setInputPickUp(e.target.value)}
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
                {[1, 2, 3].map((item) => (
                  <div
                    onClick={() => setSelectPickUp(item.toString())}
                    className="py-3 px-5 flex flex-col border-b border-gray-300 cursor-pointer text-base"
                  >
                    <div className="flex items-center gap-x-2">
                      <RadioGroupItem
                        checked={selectPickUp === item.toString()}
                        value={item.toString()}
                        id={`option-${item}`}
                      />
                      <div className="text-primary font-semibold">22:00</div>
                    </div>
                    <div className="text-primary font-semibold ml-6">
                      Văn phòng Hồ Chí Minh
                    </div>
                    <div className="text-sm text-gray-500 ml-6">
                      79 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh
                    </div>
                  </div>
                ))}
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
                {[1, 2, 3].map((item) => (
                  <div
                    onClick={() => setSelectDropOff(item.toString())}
                    className="py-3 px-5 flex flex-col border-b border-gray-300 cursor-pointer text-base"
                  >
                    <div className="flex items-center gap-x-2">
                      <RadioGroupItem
                        checked={selectDropOff === item.toString()}
                        value={item.toString()}
                        id={`option-${item}`}
                      />
                      <div className="text-primary font-semibold">22:00</div>
                    </div>
                    <div className="text-primary font-semibold ml-6">
                      Văn phòng Hồ Chí Minh
                    </div>
                    <div className="text-sm text-gray-500 ml-6">
                      79 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh
                    </div>
                  </div>
                ))}
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
              onClick={() => navigate('/information-checkout')}
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
