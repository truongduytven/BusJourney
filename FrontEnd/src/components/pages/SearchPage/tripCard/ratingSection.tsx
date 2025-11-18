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
import type { IListRating } from "@/types/trip";
import { formatDate, formatTime } from "@/utils";

interface RatingSectionProps {
  data: IListRating | undefined;
  sortType: string;
  filterRate: number[];
  onSelect: (star: number) => void;
  setSortType: (item: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function RatingSection(
    { sortType, filterRate, onSelect, setSortType, data, currentPage, onPageChange }: RatingSectionProps
) {
  const totalPages = data?.pagination?.totalPages || 1;
  
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[70%] flex flex-col gap-y-4 text-primary">
        <div className="flex justify-between items-center text-lg font-bold">
          <div>Đánh giá</div>
          <div className="flex items-center text-xl">
            {Number(data && data.average).toFixed(1)} <Star className="ml-1 text-yellow-200" fill="yellow" />
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
            Tất cả ({data && data.totalReviews})
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
            Có nhận xét ({data && data.countHaveDescription})
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
            Có hình ảnh ({data && data.countHaveImage})
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
                ({data && data.totalReviews})
                <ChevronDown size={14} className="ml-1" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-y-3 w-fit border-gray-300">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterRate.includes(5)}
                  id="option-one"
                  onCheckedChange={() => onSelect(5)}
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
                  checked={filterRate.includes(4)}
                  id="option-two"
                  onCheckedChange={() => onSelect(4)}
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
                  checked={filterRate.includes(3)}
                  id="option-three"
                  onCheckedChange={() => onSelect(3)}
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
                  checked={filterRate.includes(2)}
                  id="option-four"
                  onCheckedChange={() => onSelect(2)}
                />
                <Label className="font-normal text-base" htmlFor="option-four">
                  2 sao
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={filterRate.includes(1)}
                  id="option-five"
                  onCheckedChange={() => onSelect(1)}
                />
                <Label className="font-normal text-base" htmlFor="option-five">
                  1 sao
                  <Star className="text-yellow-300" fill="yellow" size={14} />
                </Label>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-y-4">
          {data && data.list.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-y-3 border-b py-4 border-gray-200"
            >
              <div className="flex items-center">
                <img
                  src={item.account.avatar || "https://i.pravatar.cc/150?img=3"}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="font-semibold text-primary ml-3">
                    {item.account.name}
                  </div>
                  <div className="flex text-sm text-gray-400 ml-3 gap-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= item.rating ? "text-yellow-300" : ""}
                        fill={star <= item.rating ? "yellow" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex text-green-600 items-center ml-2 font-semibold">
                  <BadgeCheck size={20} className="mr-1" color="white" fill="green"/> Đã đi • {formatTime(item.createAt)} - {formatDate(item.createAt)}
                </div>
              </div>
              <p>
                {item.commenttext}
              </p>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVQx9TnYE1O_EKVE57oOsApvWq2hC5LzBWMQ&s"
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <div>Loại xe: {data.typebus}</div>
                <div>Tuyến đường: {data.route}</div>
              </div>
            </div>
          ))}
        </div>
        {data && data.pagination && data.pagination.totalItems > 0 && <Pagination className="w-full mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationNext 
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>}
      </div>
    </div>
  );
}
