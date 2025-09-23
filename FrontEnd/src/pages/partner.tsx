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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
    })
  const formRef = useRef<HTMLDivElement | null>(null); // ref cho form

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = (data: PartnerForm) => {
    console.log("Form submitted: ", data);
    // TODO: gửi API cho admin
  };

  return (
    <div className="w-full flex flex-col">
      {/* Banner */}
      <div className="relative w-full h-[60vh] bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-center">
        <div className="text-white space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Trở thành đối tác của BusJourney
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Cùng chúng tôi mở rộng mạng lưới vận tải, mang lại trải nghiệm hành
            khách tốt hơn. Kết nối - Hợp tác - Thành công.
          </p>
          <Button
            onClick={handleScrollToForm}
            size="lg"
            variant="secondary"
            className="font-semibold"
          >
            Đăng ký ngay
          </Button>
        </div>
      </div>

      {/* Giới thiệu */}
      <div className="max-w-6xl mx-auto pt-40 pb-4 px-6 space-y-10 text-center">
        <h2 className="text-3xl font-bold text-primary text-center mb-10">
          Tại sao nên hợp tác với BusJourney?
        </h2>
        <p className="text-lg text-gray-600">
          Với hệ thống đặt vé thông minh, mạng lưới khách hàng rộng khắp và nền
          tảng thanh toán an toàn, BusJourney giúp bạn gia tăng doanh thu, tiết
          kiệm chi phí quản lý và nâng cao thương hiệu.
        </p>
      </div>

      {/* Quyền lợi */}
      <div className="bg-gray-50 pt-10 pb-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Building2 className="w-10 h-10 text-primary" />,
                title: "Mạng lưới khách hàng rộng khắp",
                desc: "BusJourney đã có hàng trăm nghìn người dùng hoạt động hàng ngày. Hợp tác với chúng tôi giúp doanh nghiệp tiếp cận ngay một tập khách hàng lớn, không cần đầu tư thêm vào quảng cáo.",
              },
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "Quản lý chuyến đi chuyên nghiệp",
                desc: "Hệ thống quản lý vé, chuyến đi, ghế ngồi và doanh thu trực tuyến. Giảm thiểu sai sót, tiết kiệm thời gian cho nhân viên và tăng trải nghiệm khách hàng.",
              },
              {
                icon: <Star className="w-10 h-10 text-primary" />,
                title: "Thương hiệu uy tín",
                desc: "Hợp tác cùng BusJourney giúp doanh nghiệp nâng cao uy tín nhờ vào nền tảng minh bạch, dịch vụ chất lượng và chính sách hỗ trợ đối tác toàn diện.",
              },
              {
                icon: <ShieldCheck className="w-10 h-10 text-primary" />,
                title: "Hệ thống an toàn, minh bạch",
                desc: "Mọi giao dịch, dữ liệu vé, và doanh thu đều minh bạch. Đối tác được báo cáo chi tiết, rõ ràng giúp dễ dàng kiểm soát hoạt động kinh doanh.",
              },
              {
                icon: <Phone className="w-10 h-10 text-primary" />,
                title: "Đội ngũ hỗ trợ 24/7",
                desc: "Chúng tôi có đội ngũ chăm sóc đối tác sẵn sàng hỗ trợ bất cứ lúc nào, đảm bảo doanh nghiệp của bạn luôn hoạt động suôn sẻ.",
              },
              {
                icon: <HandCoins className="w-10 h-10 text-primary" />,
                title: "Chia sẻ lợi nhuận công bằng",
                desc: "BusJourney cam kết chính sách chia sẻ lợi nhuận minh bạch, đối tác nhận đúng giá trị công sức bỏ ra, cùng nhau phát triển bền vững.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="shadow-md border-gray-300 hover:shadow-xl transition-transform hover:scale-105"
              >
                <CardHeader className="flex flex-col items-center space-y-3">
                  {item.icon}
                  <CardTitle className="text-lg text-center">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                  {item.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Lợi ích */}
      <div className="max-w-6xl mx-auto pt-20 pb-40 px-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-10">
          5 Lợi ích khi hợp tác cùng chúng tôi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
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
              className="flex flex-col items-center space-y-3 bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              {item.icon}
              <p className="font-semibold text-primary">{item.title}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-gray-800 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-20 text-center">
            Đăng ký mở bán theo 4 bước đơn giản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
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
                className="rounded-xl p-6 flex flex-col items-center text-center shadow-md bg-white text-gray-800"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
                  {step.number}
                </div>
                <CardContent className="flex flex-col items-center gap-2">
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form liên hệ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto mt-20 mb-40">
        {/* Bên trái: hình ảnh */}
        <div className="hidden md:flex justify-center">
          <img
            src={ContactImage}
            alt="Hỗ trợ khách hàng"
            className="rounded-xl shadow-lg object-cover w-5/6"
          />
        </div>

        {/* Bên phải: Form */}
        <Card className="shadow-xl rounded-2xl border-none">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-primary mb-6 text-center">
              Đăng ký ngay cho chúng tôi
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
                  className="w-full rounded-xl text-lg py-6 text-white"
                >
                  Gửi ngay <Send     />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
