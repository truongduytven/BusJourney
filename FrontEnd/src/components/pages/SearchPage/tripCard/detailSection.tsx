import VoucherTicket from "@/components/common/voucherTicket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import RatingSection from "./ratingSection";
import PolicySection from "./policySection";
import ImageSection from "./imageSection";
import { BadgeCheck } from "lucide-react";
import type { TripDetail } from "@/types/trip";
import Loading from "@/components/ui/loading";
import { formatTime } from "@/utils";

interface DetailSectionProps {
  data: TripDetail | undefined;
  status: string;
}

export default function DetailSection({ data, status }: DetailSectionProps) {
  const [sortType, setSortType] = useState<string | null>("mặc định");
  const [filterRate, setFilterRate] = useState<string[] | null>(null);
  const onSelect = (item: string) => {
    let newDataFilter = filterRate ? [...filterRate] : [];
    if (newDataFilter.includes(item)) {
      newDataFilter = newDataFilter.filter((i) => i !== item);
    } else {
      newDataFilter.push(item);
    }
    setFilterRate(newDataFilter);
  };
  return (
    <div className="mt-10 border-t border-gray-400 pt-4 text-sm text-gray-400">
      {status === "loading" ? (
        <div className="w-full flex flex-col justify-center items-center h-96">
          <Loading />
          <div className="text-gray-500">Đang tải chi tiết...</div>
        </div>
      ) : (
        <Tabs defaultValue="discount" className="w-full">
          <TabsList className="w-full mb-4 ">
            <TabsTrigger value="discount">Giảm giá</TabsTrigger>
            <TabsTrigger value="location">Điểm đón/trả</TabsTrigger>
            <TabsTrigger value="rating">Đánh giá</TabsTrigger>
            <TabsTrigger value="policy">Chính sách</TabsTrigger>
            <TabsTrigger value="images">Hình ảnh</TabsTrigger>
            <TabsTrigger value="utilities">Tiện ích</TabsTrigger>
          </TabsList>
          <TabsContent value="discount" className="min-h-96">
            <div className="w-full flex justify-center">
              {data && data.coupons.length > 0 ? (
                <div className="w-4/5 flex justify-center">
                  <div className="grid grid-cols-2 items-center">
                    {data?.coupons.map((item) => (
                      <div key={item.id} className="flex justify-center ">
                        <VoucherTicket
                          data={item}
                          className="w-full justify-center scale-80 hover:scale-90"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center text-xl font-bold">
                  Chưa có mã giảm giá
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="location" className="min-h-96">
            <div className="w-full flex justify-center">
              <div className="w-4/5 flex flex-col gap-y-4">
                <div className="text-secondary font-semibold text-lg">
                  Lưu ý
                </div>
                <div className="text-justify text-base text-gray-500">
                  Các mốc thời gian đón, trả bên dưới là thời gian dự kiến. Lịch
                  này có thể thay đổi tùy tình hình thưc tế.
                </div>
                <div className="flex justify-center font-semibold text-primary text-lg mt-4">
                  <div className="flex-1 flex flex-col">
                    <div>Điểm đón khách</div>
                    {data?.points.startPoint.map((point) => (
                      <div className="flex font-normal mt-6">
                        <b className="mr-2">{formatTime(point.time)} •</b>{point.locationName}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div>Điểm trả</div>
                    {data?.points.endPoint.map((point) => (
                      <div className="flex font-normal mt-6">
                        <b className="mr-2">{formatTime(point.time)} •</b>{point.locationName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="rating" className="min-h-96">
            <RatingSection
              data={data?.rating}
              sortType={sortType}
              filterRate={filterRate}
              onSelect={onSelect}
              setSortType={setSortType}
            />
          </TabsContent>
          <TabsContent value="policy" className="min-h-96">
            <div className="w-full flex justify-center">
              <div className="w-[70%] flex flex-col gap-y-4">
                <PolicySection cancellationRules={data?.cancellationRules} companyPolicies={data?.companyPolicies} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="images" className="min-h-96">
            <div className="w-full flex justify-center">
              <div className="w-[70%] flex flex-col gap-y-4">
                <ImageSection listImage={data?.images} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="utilities" className="min-h-96">
            <div className="w-full flex justify-center">
              <div className="w-[70%] grid grid-cols-3 gap-y-10 mt-4">
                {data?.extensions.map((extension, index) => (
                  <div className="flex items-center" key={index}>
                    <div className="w-10 h-10 bg-gray-200 rounded-xl">
                      <BadgeCheck size={24} className="m-2 text-green-500" />
                    </div>
                    <div className="ml-4 text-primary font-semibold">
                      {extension}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
