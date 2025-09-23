import { cn } from "@/lib/utils";
import Divider from "@/components/ui/diviver";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BadgeCheck, ChevronDown, Star } from "lucide-react";

interface RatingSectionProps {
  sortType?: string | null;
  filterRate?: string[] | null;
  onSelect?: (item: string) => void;
  setSortType: (item: string | null) => void;
}

export default function RatingSection(
    { sortType, filterRate, onSelect, setSortType }: RatingSectionProps
) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[70%] flex flex-col gap-y-4 text-primary">
        <div className="flex justify-between items-center text-lg font-bold">
          <div>Đánh giá</div>
          <div className="flex items-center text-xl">
            4.5 <Star className="ml-1 text-yellow-200" fill="yellow" />
          </div>
        </div>
        <Divider />
        <div className="flex justify-around gap-x-4 items-center text-lg font-bold">
          <div
            onClick={() => setSortType("mặc định")}
            className={cn(
              "w-1/4 text-sm py-2 bg-primary rounded-lg text-white flex justify-center cursor-pointer",
              {
                "border border-gray-300 bg-white text-primary":
                  sortType !== "mặc định",
              }
            )}
          >
            Tất cả (600)
          </div>
          <div
            onClick={() => setSortType("có nhận xét")}
            className={cn(
              "w-1/4 text-sm py-2 bg-primary rounded-lg text-white flex justify-center cursor-pointer",
              {
                "border border-gray-300 bg-white text-primary":
                  sortType !== "có nhận xét",
              }
            )}
          >
            Có nhận xét (200)
          </div>
          <div
            onClick={() => setSortType("có hình ảnh")}
            className={cn(
              "w-1/4 text-sm py-2 bg-primary rounded-lg text-white flex justify-center cursor-pointer",
              {
                "border border-gray-300 bg-white text-primary":
                  sortType !== "có hình ảnh",
              }
            )}
          >
            Có hình ảnh (200)
          </div>
          <Popover>
            <PopoverTrigger className="w-1/4">
              <div className="w-full text-sm py-2 bg-primary rounded-lg text-white flex justify-center items-center">
                Sao{" "}
                <Star
                  className="mx-1 text-yellow-300"
                  fill="yellow"
                  size={14}
                />{" "}
                (200)
                <ChevronDown size={14} className="ml-1" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-y-3 w-fit border-gray-300">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterRate?.includes("5 sao")}
                  id="option-one"
                  onCheckedChange={() => onSelect?.("5 sao")}
                />
                <Label className="font-normal text-base" htmlFor="option-one">
                  5 sao{" "}
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterRate?.includes("4 sao")}
                  id="option-two"
                  onCheckedChange={() => onSelect?.("4 sao")}
                />
                <Label className="font-normal text-base" htmlFor="option-two">
                  4 sao
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterRate?.includes("3 sao")}
                  id="option-three"
                  onCheckedChange={() => onSelect?.("3 sao")}
                />
                <Label className="font-normal text-base" htmlFor="option-three">
                  3 sao
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterRate?.includes("2 sao")}
                  id="option-two"
                  onCheckedChange={() => onSelect?.("2 sao")}
                />
                <Label className="font-normal text-base" htmlFor="option-two">
                  2 sao
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterRate?.includes("1 sao")}
                  id="option-three"
                  onCheckedChange={() => onSelect?.("1 sao")}
                />
                <Label className="font-normal text-base" htmlFor="option-three">
                  1 sao
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                </Label>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex flex-col gap-y-3 border-b py-4 border-gray-200"
            >
              <div className="flex items-center">
                <img
                  src="https://i.pravatar.cc/150?img=20"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="font-semibold text-primary ml-3">
                    Nguyễn Văn A
                  </div>
                  <div className="flex text-sm text-gray-400 ml-3 gap-x-1">
                    <Star size={14} className="text-yellow-300" fill="yellow" />
                    <Star size={14} className="text-yellow-300" fill="yellow" />
                    <Star size={14} className="text-yellow-300" fill="yellow" />
                    <Star size={14} />
                    <Star size={14} />
                  </div>
                </div>
                <div className="flex text-green-500 items-center ml-2 font-semibold">
                  <BadgeCheck size={14} className="mr-1" /> Đã đi • 17/09/2024
                </div>
              </div>
              <p>
                Máy lạnh của xe chảy nước rất nhiều, ghế ướt không thể ngồi
                được. Nhà xe chỉ liên hệ để hỏi thăm khi nhắn tin phàn nàn về
                dịch vụ chứ không có phương án khắc phục. Trải nghiệm đi xe cực
                kì tệ
              </p>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVQx9TnYE1O_EKVE57oOsApvWq2hC5LzBWMQ&s"
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <div>Loại xe: Ghế ngồi limousine</div>
                <div>Tuyến đường: Hồ Chí Minh - Mũi Né</div>
              </div>
            </div>
          ))}
        </div>
        <Pagination className="w-full mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
