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
    <div className="flex-col justify-center items-center mb-20 pt-10 overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative">
        <img
          src={Banner}
          className="w-screen h-auto object-cover mt-4 md:mt-0"
        />
        <div className="absolute hidden z-10 w-full top-0 left-0 h-full md:flex flex-col lg:flex-row justify-center px-4 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 w-full md:w-3/4">
            <div className="text-white space-y-6 animate-fade-in-up">
              <Button className="bg-yellow-500 h-auto text-primary font-medium hover:bg-yellow-600 rounded-full px-6 py-3 flex items-center gap-2 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl animate-bounce-slow">
                <span className="animate-pulse">🚌</span> Xem chuyến xe nổi bật
              </Button>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight text-primary animate-slide-in-left">
                Hành Trình Thoải Mái
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                  Giá Vé Hợp Lý
                </span>
              </h1>
              <p className="text-lg max-w-xl text-primary animate-fade-in-delayed">
                Kết nối hàng trăm tuyến xe khách trải dài khắp cả nước. Dễ dàng
                tìm kiếm chuyến đi phù hợp, chọn ghế yêu thích và thanh toán an
                toàn chỉ trong vài phút. Trải nghiệm hành trình thoải mái với
                mức giá minh bạch và dịch vụ chăm sóc khách hàng tận tâm.
              </p>
            </div>
            <div className="flex flex-col gap-4 items-end">
              {[BannerSub1, BannerSub2, BannerSub3].map((banner, index) => (
                <img
                  key={index}
                  src={banner}
                  className="rounded-xl border-4 border-yellow-400 w-40 md:w-64 object-cover aspect-16/9 hover:scale-110 hover:rotate-2 transition-all duration-500 hover:-translate-x-10 hover:shadow-2xl cursor-pointer animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  alt="ảnh xe khách"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-80 md:top-auto left-0 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2 flex justify-center w-screen z-20 animate-slide-up">
          <SearchForm />
        </div>
      </div>

      <Container className="mt-72 md:mt-0">
        {/* Featured Routes Section */}
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto justify-center text-center">
            <div className="flex flex-col items-center mt-72 mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-white via-secondary/30 to-secondary/50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-shimmer bg-[length:200%_100%]">
                ✨ Tuyến đường nổi bật
              </div>
              <h2 className="text-2xl font-bold text-primary px-2 md:px-0 hover:scale-105 transition-transform duration-300">
                Những tuyến đường{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  nổi bật
                </span>{" "}
                trong tháng
              </h2>
              <p className="text-lg text-center text-primary px-10 opacity-80 hover:opacity-100 transition-opacity duration-300">
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
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full sm:basis-1/2 lg:basis-1/3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <FeaturedTripCard />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="cursor-pointer text-gray-500 border-gray-500 hover:scale-110 hover:bg-gray-100 transition-all duration-300" />
              <CarouselPrevious className="cursor-pointer text-gray-500 border-gray-500 hover:scale-110 hover:bg-gray-100 transition-all duration-300" />
            </Carousel>
          </div>
        </FadeInSection>

        <div className="flex justify-end my-24">
          <img
            src={CarDrive1}
            className="hidden md:block object-cover h-30 -mr-90 animate-drive-in"
          />
        </div>

        {/* Voucher Section */}
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 animate-shimmer bg-[length:200%_100%]">
                🎁 Voucher hấp dẫn
              </div>
              <h2 className="text-2xl font-bold text-primary px-2 md:px-0">
                Những voucher ưu đãi{" "}
                <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  hấp dẫn
                </span>{" "}
                đang chờ bạn
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14 opacity-80">
                Đừng bỏ lỡ cơ hội săn voucher giảm giá cực hot! Tiết kiệm nhiều
                hơn cho mỗi hành trình với các voucher ưu đãi hấp dẫn. Chọn ngay
                mã giảm giá phù hợp và tận hưởng chuyến đi thoải mái với chi phí
                tối ưu.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up hover:animate-pulse-slow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VoucherTicket />
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        <div className="flex justify-start my-24">
          <img
            src={CarDrive2}
            className="hidden md:block object-cover h-30 -ml-90 -scale-x-90 scale-90 animate-drive-in-reverse"
          />
        </div>

        {/* Reviews Section */}
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 animate-shimmer bg-[length:200%_100%]">
                ⭐ Đánh giá từ khách hàng
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Những đánh giá từ{" "}
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  khách hàng
                </span>{" "}
                đã trải nghiệm dịch vụ
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14 opacity-80">
                Lắng nghe những chia sẻ thực tế từ khách hàng đã đồng hành cùng
                chúng tôi. Mỗi đánh giá là một trải nghiệm chân thật, giúp bạn
                an tâm hơn khi lựa chọn chuyến đi.
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
              <CarouselNext className="cursor-pointer text-gray-500 border-gray-500 hover:scale-110 hover:bg-gray-100 transition-all duration-300" />
              <CarouselPrevious className="cursor-pointer text-gray-500 border-gray-500 hover:scale-110 hover:bg-gray-100 transition-all duration-300" />
            </Carousel>
          </div>
        </FadeInSection>

        <div className="flex justify-end my-24">
          <img
            src={CarDrive3}
            className="hidden md:block object-cover h-30 -mr-90 animate-drive-in"
          />
        </div>

        {/* Features Section */}
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-orange-100 via-yellow-100 to-red-100 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 animate-shimmer bg-[length:200%_100%]">
                🎯 Chúng tôi có gì?
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Những điểm{" "}
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  nổi bật
                </span>{" "}
                khi đặt vé tại BusJourney
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14 opacity-80">
                Chúng tôi mang đến cho bạn sự tiện lợi, an toàn và minh bạch
                trong từng chuyến đi.
              </p>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 md:gap-y-0 justify-around px-10 md:px-auto">
              {[
                {
                  icon: Bus,
                  color: "#0F19FD",
                  title: "Nhiều hãng xe chất lượng",
                  desc: "30+ tuyến đường trên nhiều tỉnh thành, đa dạng, nhiều sự lựa chọn",
                  gradient: "from-blue-500/10 to-blue-600/20",
                },
                {
                  icon: TicketCheck,
                  color: "#DC3510",
                  title: "Đặt vé dễ dàng",
                  desc: "Đặt vé chỉ với 60s. Chọn xe yêu thích cực nhanh và thuận tiện.",
                  gradient: "from-red-500/10 to-red-600/20",
                },
                {
                  icon: CircleCheckBig,
                  color: "#24D007",
                  title: "Đảm bảo có vé",
                  desc: "Hoàn ngay 150% nếu không có vé, mang đến hành trình trọn vẹn.",
                  gradient: "from-green-500/10 to-green-600/20",
                },
                {
                  icon: TicketPercent,
                  color: "#FB37FF",
                  title: "Nhiều ưu đãi hấp dẫn",
                  desc: "Chọn ưu đãi phù hợp giúp chuyến đi của bạn trở nên thú vị hơn.",
                  gradient: "from-pink-500/10 to-purple-600/20",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`rounded-xl flex items-center w-full h-32 space-x-2 p-2 shadow-md hover:shadow-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm hover:scale-110 hover:-translate-y-5 transform transition-all duration-300 cursor-pointer group animate-fade-in-up border border-gray-100`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <feature.icon
                    color={feature.color}
                    className="w-1/4 h-1/3 group-hover:scale-125 transition-transform duration-300"
                  />
                  <div className="flex flex-col">
                    <span className="text-center font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </span>
                    <span className="text-center text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                      {feature.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>

        <div className="flex justify-start my-24">
          <img
            src={CarDrive4}
            className="hidden md:block object-cover h-30 -ml-90 -scale-x-100 animate-drive-in-reverse"
          />
        </div>

        {/* Contact Form Section */}
        <FadeInSection>
          <div className="flex flex-col items-center w-screen md:w-auto text-center">
            <div className="flex flex-col items-center mb-10 gap-5">
              <div className="px-10 py-4 text-lg font-semibold text-primary bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 animate-shimmer bg-[length:200%_100%]">
                💬 Bạn còn thắc mắc?
              </div>
              <h2 className="text-2xl font-bold text-primary">
                Mọi thắc mắc của bạn sẽ được{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  giải đáp
                </span>{" "}
                nhanh chóng
              </h2>
              <p className="text-base md:text-lg text-center text-primary px-4 md:px-14 opacity-80">
                Quý khách còn thắc mắc? Vui lòng gửi câu hỏi trực tiếp qua biểu
                mẫu bên dưới hoặc trao đổi nhanh với trợ lý ảo ở góc màn hình.
              </p>
            </div>
            <div className="animate-fade-in-up">
              <QuestionForm />
            </div>
          </div>
        </FadeInSection>
      </Container>
    </div>
  );
}
