import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Users,
  Star,
  ShieldCheck,
  Phone,
  HandCoins,
  TrendingUp,
  Globe,
  Clock,
  HeartHandshake,
  Wallet,
  Gift,
  Send,
} from "lucide-react";
import { z } from "zod";
import { partnerSchema } from "@/schemas";
import { useRef } from "react";
import ContactImage from "@/assets/partner.png";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type PartnerForm = z.infer<typeof partnerSchema>;

export default function BecomePartnerPage() {
  const form = useForm<PartnerForm>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      fullName: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    },
  });
  const divRef = useRef<HTMLDivElement | null>(null);
  const divRef1 = useRef<HTMLDivElement | null>(null);

  const handleScrollToForm = () => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = (data: PartnerForm) => {
    console.log("Form submitted: ", data);
    // TODO: gửi API cho admin
  };

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Section 1: Hero Banner */}
      <section className="h-screen w-full snap-start flex items-center justify-center relative bg-gradient-to-br from-blue-500 via-indigo-700 to-purple-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 border border-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center text-white z-10">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Building2 className="w-20 h-20 mx-auto mb-8 text-blue-200" />
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Trở thành đối tác
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-blue-100">
              của BusJourney
            </h2>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed text-blue-100">
              Cùng chúng tôi mở rộng mạng lưới vận tải, mang lại trải nghiệm hành khách tốt nhất. 
              <span className="block mt-2 font-semibold text-white">Kết nối • Hợp tác • Thành công</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={() => divRef1.current?.scrollIntoView({ behavior: "smooth" })}
                size="lg"
                className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full shadow-xl transform transition-all duration-300 hover:scale-105"
              >
                Khám phá ngay
              </Button>
              <Button
                onClick={handleScrollToForm}
                size="lg"
                variant="outline"
                className="border-white text-white hover:text-white px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 transform transition-all duration-300 hover:scale-105"
              >
                Đăng ký đối tác
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Section 2: Why Partner */}
      <section ref={divRef1} className="h-screen w-full snap-start flex items-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Tại sao hợp tác với
              <span className="text-blue-800 block mt-2">BusJourney?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Building2 className="w-6 h-6 text-primary" />,
                title: "Mạng lưới khách hàng rộng khắp",
                desc: "BusJourney đã có hàng trăm nghìn người dùng hoạt động hàng ngày. Hợp tác với chúng tôi giúp doanh nghiệp tiếp cận ngay một tập khách hàng lớn, không cần đầu tư thêm vào quảng cáo.",
              },
              {
                icon: <Users className="w-6 h-6 text-primary" />,
                title: "Quản lý chuyến đi chuyên nghiệp",
                desc: "Hệ thống quản lý vé, chuyến đi, ghế ngồi và doanh thu trực tuyến. Giảm thiểu sai sót, tiết kiệm thời gian cho nhân viên và tăng trải nghiệm khách hàng.",
              },
              {
                icon: <Star className="w-6 h-6 text-primary" />,
                title: "Thương hiệu uy tín",
                desc: "Hợp tác cùng BusJourney giúp doanh nghiệp nâng cao uy tín nhờ vào nền tảng minh bạch, dịch vụ chất lượng và chính sách hỗ trợ đối tác toàn diện.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-primary" />,
                title: "Hệ thống an toàn, minh bạch",
                desc: "Mọi giao dịch, dữ liệu vé, và doanh thu đều minh bạch. Đối tác được báo cáo chi tiết, rõ ràng giúp dễ dàng kiểm soát hoạt động kinh doanh.",
              },
              {
                icon: <Phone className="w-6 h-6 text-primary" />,
                title: "Đội ngũ hỗ trợ 24/7",
                desc: "Chúng tôi có đội ngũ chăm sóc đối tác sẵn sàng hỗ trợ bất cứ lúc nào, đảm bảo doanh nghiệp của bạn luôn hoạt động suôn sẻ.",
              },
              {
                icon: <HandCoins className="w-6 h-6 text-primary" />,
                title: "Chia sẻ lợi nhuận công bằng",
                desc: "BusJourney cam kết chính sách chia sẻ lợi nhuận minh bạch, đối tác nhận đúng giá trị công sức bỏ ra, cùng nhau phát triển bền vững.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="group bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                <CardHeader className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <CardTitle className="text-base font-bold text-center text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 px-6 leading-relaxed">
                  {item.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Benefits */}
      <section className="h-screen w-full snap-start flex items-center bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              5 Lợi ích 
              <span className="text-blue-800 block mt-2">khi hợp tác cùng chúng tôi</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị thiết thực mà BusJourney mang lại cho đối tác
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <TrendingUp className="w-10 h-10 text-blue-500" />,
              title: "Tăng trưởng doanh thu",
              desc: "Nhờ nền tảng trực tuyến và lượng khách hàng lớn, doanh thu được gia tăng ổn định và bền vững.",
            },
            {
              icon: <Globe className="w-10 h-10 text-red-500" />,
              title: "Mở rộng thị trường",
              desc: "Tiếp cận khách hàng ở nhiều tỉnh thành khác nhau mà không cần đầu tư thêm nhiều chi phí marketing.",
            },
            {
              icon: <Clock className="w-10 h-10 text-yellow-500" />,
              title: "Tiết kiệm thời gian quản lý",
              desc: "Hệ thống tự động hóa việc đặt vé, quản lý chuyến, báo cáo doanh thu giúp tiết kiệm tối đa nguồn lực.",
            },
            {
              icon: <HeartHandshake className="w-10 h-10 text-green-500" />,
              title: "Xây dựng thương hiệu",
              desc: "Tham gia cùng BusJourney giúp nâng cao hình ảnh thương hiệu, uy tín và sự tin cậy từ phía khách hàng.",
            },
            {
              icon: <Wallet className="w-10 h-10 text-fuchsia-500" />,
              title: "Chính sách tài chính minh bạch",
              desc: "Thanh toán nhanh chóng, minh bạch, đối soát rõ ràng giúp doanh nghiệp yên tâm hợp tác lâu dài.",
            },
            {
              icon: <Gift className="w-10 h-10 text-pink-500" />,
              title: "Ưu đãi & hỗ trợ đặc biệt",
              desc: "Đối tác nhận nhiều ưu đãi từ các chương trình khuyến mãi chung, đồng thời được đội ngũ BusJourney hỗ trợ tận tình.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex flex-col items-center space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200"
            >
              <div className="p-3 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-800 text-center group-hover:text-blue-800 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Section 4: Steps */}
      <section className="h-screen w-full snap-start flex items-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-28 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Đăng ký mở bán theo 
              <span className="text-blue-400 block mt-2">4 bước đơn giản</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Quy trình đối tác minh bạch và nhanh chóng
            </p>
          </div>

          <div className="steps-container group/container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                number: 1,
                title: "Đăng ký thông tin",
                desc: "Vui lòng để lại thông tin liên hệ hoặc liên hệ trực tiếp hotline của BusJourney để được tư vấn hỗ trợ.",
              },
              {
                number: 2,
                title: "Tư vấn",
                desc: "BusJourney sẽ liên hệ xác minh và tư vấn nhanh chóng. Giải đáp mọi thắc mắc về tệp khách hàng mục tiêu và kỳ vọng hợp tác.",
              },
              {
                number: 3,
                title: "Ký hợp đồng",
                desc: "Sau khi tư vấn thành công, hai bên sẽ tiến hành ký hợp đồng hợp tác minh bạch, rõ ràng.",
              },
              {
                number: 4,
                title: "Mở bán tại BusJourney",
                desc: "Xe khách sẽ được hiển thị trên BusJourney.com. Chúng tôi đồng hành cùng nhà xe, hỗ trợ suốt quá trình để đảm bảo doanh thu và thương hiệu.",
              },
            ].map((step) => (
              <Card
                key={step.number}
                className="step-card bg-white rounded-2xl p-8 flex flex-col items-center text-center shadow-xl border-0 cursor-pointer relative overflow-hidden"
              >
                <div className="step-number w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl mb-6 transition-all duration-500 hover:from-blue-700 hover:to-indigo-700 relative z-10">
                  {step.number}
                </div>
                
                <CardContent className="step-content flex flex-col items-center gap-4 p-0 transition-all duration-300 relative z-10">
                  <h3 className="font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm hover:text-gray-800 transition-colors duration-300">
                    {step.desc}
                  </p>
                </CardContent>
                
                {/* Decorative elements */}
                <div className="step-decorative absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-30"></div>
                <div className="step-decorative absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30"></div>
                <div className="step-decorative absolute top-1/2 right-2 w-1 h-1 bg-blue-300 rounded-full opacity-40"></div>
                
                {/* Progress indicator */}
                {step.number < 4 && (
                  <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent opacity-50"></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Contact Form */}
      <section ref={divRef} className="min-h-screen w-full snap-start flex items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Đăng ký {" "}<span className="text-blue-800 inline mt-2">trở thành đối tác</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Để lại thông tin và chúng tôi sẽ liên hệ tư vấn trong thời gian sớm nhất
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Bên trái: hình ảnh */}
            <div className="hidden lg:flex justify-center animate-in fade-in slide-in-from-left-8 duration-1000">
              <img
                src={ContactImage}
                alt="Hỗ trợ khách hàng"
                className="rounded-3xl shadow-2xl object-cover w-full max-w-md transform transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Bên phải: Form */}
            <Card className="shadow-2xl rounded-3xl border-0 bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-right-8 duration-1000">
              <CardContent>
              <h3 className="text-2xl font-bold text-blue-800 mb-8 text-center">
                Thông tin liên hệ
              </h3>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Họ tên */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Họ và tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập họ và tên của bạn"
                            className="text-lg py-3 border-gray-300 focus:border-primary focus:ring-0 outline-0 focus:ring-primary focus:border-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Tên công ty
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên công ty của bạn"
                            className="text-lg py-3 border-gray-300 focus:border-primary focus:ring-0 outline-0 focus:ring-primary focus:border-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="text-lg py-3 border-gray-300 focus:border-primary focus:ring-0 outline-0 focus:ring-primary focus:border-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Số điện thoại */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Nhập số điện thoại của bạn"
                            className="text-lg py-3 border-gray-300 focus:border-primary focus:ring-0 outline-0 focus:ring-primary focus:border-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Nội dung */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Nội dung bạn đang thắc mắc
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập nội dung..."
                            draggable={false}
                            rows={10}
                            className="text-lg py-3 min-h-[120px] border-gray-300 focus:border-primary focus:ring-0 outline-0 focus:ring-primary focus:border-none resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={!form.formState.isValid}
                    type="submit"
                    className="w-full rounded-xl text-lg py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Send className="mr-2" />
                    Gửi thông tin đăng ký
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
