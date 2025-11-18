import VoucherTicket from "@/components/common/voucherTicket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import RatingSection from "./ratingSection";
import PolicySection from "./policySection";
import ImageSection from "./imageSection";
import { BadgeCheck } from "lucide-react";
import Loading from "@/components/ui/loading";
import { formatTime } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { 
  fetchTripCoupons, 
  fetchTripPoints, 
  fetchTripRatings, 
  fetchTripPolicies, 
  fetchTripImages, 
  fetchTripExtensions 
} from "@/redux/thunks/tripDetailThunks";

interface DetailSectionProps {
  tripId: string;
}

export default function DetailSection({ tripId }: DetailSectionProps) {
  const dispatch = useAppDispatch();
  const { cache, status } = useAppSelector((state) => state.tripDeatails);
  
  const [activeTab, setActiveTab] = useState<string>("discount");
  const [sortType, setSortType] = useState<string>("mặc định");
  const [filterRate, setFilterRate] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const tripCache = cache[tripId];
  const tripStatus = status[tripId] || {
    coupons: "idle",
    points: "idle",
    rating: "idle",
    policies: "idle",
    images: "idle",
    extensions: "idle",
    all: "idle",
  };

  const onSelect = (star: number) => {
    let newFilterRate = [...filterRate];
    if (newFilterRate.includes(star)) {
      newFilterRate = newFilterRate.filter((s) => s !== star);
    } else {
      newFilterRate.push(star);
    }
    setFilterRate(newFilterRate);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Load ratings with filters
  const loadRatings = () => {
    let filterType: 'all' | 'withComment' | 'withImage' = 'all';
    if (sortType === 'có nhận xét') {
      filterType = 'withComment';
    } else if (sortType === 'có hình ảnh') {
      filterType = 'withImage';
    }

    dispatch(fetchTripRatings({
      tripId,
      page: currentPage,
      pageSize: 5,
      filterType,
      starRatings: filterRate
    }));
  };

  // Load initial tab data when component mounts
  useEffect(() => {
    // Load discount tab (default tab) on mount if not already loaded
    if (!tripCache?.loadedTabs?.coupons && tripStatus.coupons === "idle") {
      dispatch(fetchTripCoupons(tripId));
    }
  }, [tripId, dispatch]);

  // Load data when tab changes
  useEffect(() => {
    if (!tripCache?.loadedTabs) return;

    switch (activeTab) {
      case "discount":
        if (!tripCache.loadedTabs.coupons && tripStatus.coupons === "idle") {
          dispatch(fetchTripCoupons(tripId));
        }
        break;
      case "location":
        if (!tripCache.loadedTabs.points && tripStatus.points === "idle") {
          dispatch(fetchTripPoints(tripId));
        }
        break;
      case "rating":
        if (!tripCache.loadedTabs.rating && tripStatus.rating === "idle") {
          dispatch(fetchTripRatings({ tripId, page: 1, pageSize: 5, filterType: 'all', starRatings: [] }));
        }
        break;
      case "policy":
        if (!tripCache.loadedTabs.policies && tripStatus.policies === "idle") {
          dispatch(fetchTripPolicies(tripId));
        }
        break;
      case "images":
        if (!tripCache.loadedTabs.images && tripStatus.images === "idle") {
          dispatch(fetchTripImages(tripId));
        }
        break;
      case "utilities":
        if (!tripCache.loadedTabs.extensions && tripStatus.extensions === "idle") {
          dispatch(fetchTripExtensions(tripId));
        }
        break;
    }
  }, [activeTab, tripId, tripCache?.loadedTabs, tripStatus, dispatch]);

  // Reload ratings when filters or pagination changes
  useEffect(() => {
    if (activeTab === "rating" && tripCache?.loadedTabs?.rating) {
      loadRatings();
    }
  }, [sortType, filterRate, currentPage]);

  const getTabStatus = (tab: string): "idle" | "loading" | "succeeded" | "failed" => {
    switch (tab) {
      case "discount": return tripStatus.coupons;
      case "location": return tripStatus.points;
      case "rating": return tripStatus.rating;
      case "policy": return tripStatus.policies;
      case "images": return tripStatus.images;
      case "utilities": return tripStatus.extensions;
      default: return "idle";
    }
  };

  const renderTabContent = () => {
    const currentStatus = getTabStatus(activeTab);
    
    if (currentStatus === "loading") {
      return (
        <div className="w-full flex flex-col justify-center items-center h-96">
          <Loading />
          <div className="text-gray-500">Đang tải...</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mt-10 border-t border-gray-400 pt-4 text-sm text-gray-400">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4 ">
          <TabsTrigger value="discount">Giảm giá</TabsTrigger>
          <TabsTrigger value="location">Điểm đón/trả</TabsTrigger>
          <TabsTrigger value="rating">Đánh giá</TabsTrigger>
          <TabsTrigger value="policy">Chính sách</TabsTrigger>
          <TabsTrigger value="images">Hình ảnh</TabsTrigger>
          <TabsTrigger value="utilities">Tiện ích</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discount" className="min-h-96">
          {tripStatus.coupons === "loading" ? (
            renderTabContent()
          ) : (
            <div className="w-full flex justify-center">
              {tripCache?.coupons && tripCache.coupons.length > 0 ? (
                <div className="w-4/5 flex justify-center">
                  <div className="grid grid-cols-2 items-center">
                    {tripCache.coupons.map((item) => (
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
          )}
        </TabsContent>
        
        <TabsContent value="location" className="min-h-96">
          {tripStatus.points === "loading" ? (
            renderTabContent()
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-4/5 flex flex-col gap-y-4">
                <div className="text-secondary font-semibold text-lg">
                  Lưu ý
                </div>
                <div className="text-justify text-base text-gray-500">
                  Các mốc thời gian đón, trả bên dưới là thời gian dự kiến. Lịch
                  này có thể thay đổi tùy tình hình thực tế.
                </div>
                <div className="flex justify-center font-semibold text-primary text-lg mt-4">
                  <div className="flex-1 flex flex-col">
                    <div>Điểm đón khách</div>
                    {tripCache?.points?.startPoint.map((point) => (
                      <div key={point.id} className="flex font-normal mt-6">
                        <b className="mr-2">{formatTime(point.time)} •</b>{point.locationName}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div>Điểm trả</div>
                    {tripCache?.points?.endPoint.map((point) => (
                      <div key={point.id} className="flex font-normal mt-6">
                        <b className="mr-2">{formatTime(point.time)} •</b>{point.locationName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rating" className="min-h-96">
          {tripStatus.rating === "loading" ? (
            renderTabContent()
          ) : (
            <RatingSection
              data={tripCache?.rating}
              sortType={sortType}
              filterRate={filterRate}
              onSelect={onSelect}
              setSortType={setSortType}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>
        
        <TabsContent value="policy" className="min-h-96">
          {tripStatus.policies === "loading" ? (
            renderTabContent()
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-[70%] flex flex-col gap-y-4">
                <PolicySection 
                  cancellationRules={tripCache?.policies?.cancellationRules} 
                  companyPolicies={tripCache?.policies?.companyPolicies} 
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="images" className="min-h-96">
          {tripStatus.images === "loading" ? (
            renderTabContent()
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-[70%] flex flex-col gap-y-4">
                <ImageSection listImage={tripCache?.images} />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="utilities" className="min-h-96">
          {tripStatus.extensions === "loading" ? (
            renderTabContent()
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-[70%] grid grid-cols-3 gap-y-10 mt-4">
                {tripCache?.extensions?.map((extension, index) => (
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
