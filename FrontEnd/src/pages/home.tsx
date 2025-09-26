import Banner from "@/assets/banner.png";
import SearchForm from "@/components/forms/searchForm";
import { Button } from "@/components/ui/button";
import BannerSub1 from "@/assets/banner_sub_1.png";
import BannerSub2 from "@/assets/banner_sub_2.png";
import BannerSub3 from "@/assets/banner_sub_3.png";
import CarDrive1 from "@/assets/icon_car_drive_1.png";
import CarDrive2 from "@/assets/icon_car_drive_2.png";
import CarDrive3 from "@/assets/icon_car_drive_3.png";
import CarDrive4 from "@/assets/icon_car_drive_4.png";
import Container from "@/components/layout/container";
import FeaturedTripCard from "@/components/common/feartureTripCard";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VoucherTicket from "@/components/common/voucherTicket";
import RatingCard from "@/components/common/ratingCard";
import { Bus, CircleCheckBig, TicketCheck, TicketPercent } from "lucide-react";
import QuestionForm from "@/components/forms/questionForm";
import FadeInSection from "@/components/common/faeInSection";

export default function Home() {

  return (
    <div className="flex-col justify-center items-center mb-20">
      <div className="relative">
        <img
          src={Banner}
          className="w-screen h-auto object-cover mt-4 md:mt-0"
        />
        <div className="absolute hidden z-10 w-full top-0 left-0 h-full md:flex flex-col lg:flex-row justify-center px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 w-full md:w-3/4">
            <div className="text-white space-y-6">
              <Button className="bg-yellow-500 h-auto text-primary font-medium hover:bg-yellow-500 rounded-full px-6 py-3 flex items-center gap-2 transform hover:scale-105 transition duration-300">
                🚌 Xem chuyến xe nổi bật
              </Button>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-primary">
                Hành Trình Thoải Mái
                <br /> Giá Vé Hợp Lý
              </h1>
              <p className="text-lg max-w-xl text-primary ">
                Kết nối hàng trăm tuyến xe khách trải dài khắp cả nước. Dễ dàng
                tìm kiếm chuyến đi phù hợp, chọn ghế yêu thích và thanh toán an
                toàn chỉ trong vài phút. Trải nghiệm hành trình thoải mái với
                mức giá minh bạch và dịch vụ chăm sóc khách hàng tận tâm.
              </p>
            </div>
            <div className="flex flex-col gap-4 items-end">
              <img
                src={BannerSub1}
                className="rounded-xl border-4 border-yellow-400 w-40 md:w-64 object-cover aspect-16/9 hover:scale-110 transition-transform duration-300 hover:-translate-x-10"
                alt="ảnh xe khách"
              />
              <img
                src={BannerSub2}
                className="rounded-xl border-4 border-yellow-400 w-40 md:w-64 object-cover aspect-16/9 hover:scale-110 transition-transform duration-300 hover:-translate-x-10"
                alt="ảnh xe khách"
              />
              <img
                src={BannerSub3}
                className="rounded-xl border-4 border-yellow-400 w-40 md:w-64 object-cover aspect-16/9 hover:scale-110 transition-transform duration-300 hover:-translate-x-10"
                alt="ảnh xe khách"
              />
            </div>
          </div>
        </div>
        <div className="absolute top-80 md:top-auto left-0 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 flex justify-center w-screen z-20">
          <SearchForm />
        </div>
      </div>
      <Container className="mt-72 md:mt-0">
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto justify-center text-center">
            <div className="flex flex-col items-center mt-72 mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-white to-secondary/50 rounded-full">
                Tuyến đường nổi bật
              </div>
              <h2 className="text-2xl font-bold text-primary px-2 md:px-0">
                Những tuyến đường nổi bật trong tháng
              </h2>
              <p className="text-lg text-center text-primary px-10">
                Khám phá những tuyến đường được yêu thích nhất! Từ các tuyến xe
                đường dài tiện nghi đến các chuyến ngắn ngày thuận tiện, chúng
                tôi chọn lọc những tuyến đường nổi bật để bạn dễ dàng lựa chọn.
                Đặt vé nhanh chóng, trải nghiệm hành trình an toàn và thoải mái.
              </p>
            </div>
            <Carousel
              className="w-2/3 md:w-5/6"
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 5000 })]}
            >
              <CarouselContent className="py-3">
                <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <FeaturedTripCard />
                </CarouselItem>
                <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <FeaturedTripCard />
                </CarouselItem>
                <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <FeaturedTripCard />
                </CarouselItem>
                <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <FeaturedTripCard />
                </CarouselItem>
                <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <FeaturedTripCard />
                </CarouselItem>
              </CarouselContent>
              <CarouselNext className="cursor-pointer text-gray-500 border-gray-500" />
              <CarouselPrevious className="cursor-pointer text-gray-500 border-gray-500" />
            </Carousel>
          </div>
        </FadeInSection>
        <div className="flex justify-end my-24">
          <img
            src={CarDrive1}
            className="hidden md:block object-cover h-30 -mr-90"
          />
        </div>
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-white to-secondary/50 rounded-full">
                Voucher hấp dẫn
              </div>
              <h2 className="text-2xl font-bold text-primary px-2 md:px-0">
                Những voucher ưu đãi hấp dẫn đang chờ bạn
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14">
                Đừng bỏ lỡ cơ hội săn voucher giảm giá cực hot! Tiết kiệm nhiều
                hơn cho mỗi hành trình với các voucher ưu đãi hấp dẫn. Chọn ngay
                mã giảm giá phù hợp và tận hưởng chuyến đi thoải mái với chi phí
                tối ưu.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <VoucherTicket key={index} />
              ))}
            </div>
          </div>
        </FadeInSection>
        <div className="flex justify-start my-24">
          <img
            src={CarDrive2}
            className="hidden md:block object-cover h-30 -ml-90 -scale-x-90 scale-90"
          />
        </div>
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-white to-secondary/50 rounded-full">
                Đánh giá từ khách hàng
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Những đánh giá từ khách hàng đã trải nghiệm dịch vụ
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14">
                Lắng nghe những chia sẻ thực tế từ khách hàng đã đồng hành cùng
                chúng tôi. Mỗi đánh giá là một trải nghiệm chân thật, giúp bạn
                an tâm hơn khi lựa chọn chuyến đi. Hãy khám phá cảm nhận và đánh
                giá chân thực từ những hành khách đã tin tưởng lựa chọn.
              </p>
            </div>
            <Carousel
              className="w-2/3 md:w-5/6"
              opts={{ loop: true }}
              plugins={[Autoplay({ delay: 3000 })]}
            >
              <CarouselContent className="py-3">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <RatingCard />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="cursor-pointer text-gray-500 border-gray-500" />
              <CarouselPrevious className="cursor-pointer text-gray-500 border-gray-500" />
            </Carousel>
          </div>
        </FadeInSection>
        <div className="flex justify-end my-24">
          <img
            src={CarDrive3}
            className="hidden md:block object-cover h-30 -mr-90"
          />
        </div>
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-white to-secondary/50 rounded-full">
                Chúng tôi có gì?
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Những điểm nổi bật khi đặt vé tại BusJourney
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14">
                Chúng tôi mang đến cho bạn sự tiện lợi, an toàn và minh bạch
                trong từng chuyến đi. Với hệ thống đặt vé trực tuyến hiện đại,
                đa dạng tuyến xe, dịch vụ chăm sóc khách hàng tận tâm và nhiều
                ưu đãi hấp dẫn, hành trình của bạn sẽ luôn thoải mái và đáng tin
                cậy.
              </p>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 md:gap-y-0 justify-around px-10 md:px-auto">
              <div className="rounded-md flex items-center w-full h-32 space-x-2 p-2 shadow-md hover:scale-105 hover:-translate-y-3 transform scale-100 transition duration-200">
                <Bus color="#0F19FD" className="w-1/4 h-1/3" />
                <div className="flex flex-col">
                  <span className="text-center font-bold">
                    Nhiều hãng xe chất lượng
                  </span>
                  <span className="text-center text-sm">
                    30+ tuyến đường trên nhiều tỉnh thành, đa dạng, nhiều sự lựa
                    chọn
                  </span>
                </div>
              </div>
              <div className="rounded-md flex items-center w-full h-32 space-x-2 p-2 shadow-md hover:scale-105 hover:-translate-y-3 transform scale-100 transition duration-200">
                <TicketCheck color="#DC3510" className="w-1/4 h-1/3" />
                <div className="flex flex-col">
                  <span className="text-center font-bold">Đặt vé dễ dàng</span>
                  <span className="text-center text-sm">
                    Đặt vé chỉ với 60s. Chọn xe yêu thích cực nhanh và thuận
                    tiện.
                  </span>
                </div>
              </div>
              <div className="rounded-md flex items-center w-full h-32 space-x-2 p-2 shadow-md hover:scale-105 hover:-translate-y-3 transform scale-100 transition duration-200">
                <CircleCheckBig color="#24D007" className="w-1/4 h-1/3" />
                <div className="flex flex-col">
                  <span className="text-center font-bold">Đảm bảo có vé</span>
                  <span className="text-center text-sm">
                    Hoàn ngay 150% nếu không có vé, mang đến hành trình trọn
                    vẹn.
                  </span>
                </div>
              </div>
              <div className="rounded-md flex items-center w-full h-32 space-x-2 p-2 shadow-md hover:scale-105 hover:-translate-y-3 transform scale-100 transition duration-200">
                <TicketPercent color="#FB37FF" className="w-1/4 h-1/3" />
                <div className="flex flex-col">
                  <span className="text-center font-bold">
                    Nhiều ưu đãi hấp dẫn
                  </span>
                  <span className="text-center text-sm">
                    Chọn ưu đãi phù hợp giúp chuyến đi của bạn trở nên thú vị
                    hơn.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
        <div className="flex justify-start my-24">
          <img
            src={CarDrive4}
            className="hidden md:block object-cover h-30 -ml-90 -scale-x-100"
          />
        </div>
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-white to-secondary/50 rounded-full">
                Bạn còn thắc mắc?
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Mọi thắc mắc của bạn sẽ được giải đáp nhanh chóng
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14">
                Quý khách còn thắc mắc? Vui lòng gửi câu hỏi trực tiếp qua biểu
                mẫu bên dưới hoặc trao đổi nhanh với trợ lý ảo ở góc màn hình.
                Chúng tôi luôn sẵn sàng hỗ trợ kịp thời để hành trình của quý
                khách được thuận lợi và an toàn.
              </p>
            </div>
            <QuestionForm />
          </div>
        </FadeInSection>
      </Container>
    </div>
  );
}
