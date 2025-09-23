import Container from "./container";
import LogoMini from "@/assets/logo_mini.png";
import LogoFull from "@/assets/logo_full.png";

export default function Footer() {
  return (
    <footer style={{ boxShadow: "0 -4px 6px -1px rgba(117, 111, 111, 0.1)" }}>
      <Container>
        <div className="w-full h-full pt-5">
          <div className="flex flex-col md:flex-row mt-6 gap-14 px-6 md:px-0">
            <div className="flex flex-col flex-1 gap-6">
              <div className="flex gap-2 items-center">
                <img className="w-12 h-10" src={LogoMini} alt="Logo Mini" />
                <img className="h-12" src={LogoFull} alt="Logo Full" />
              </div>
              <p className="text-xs sm:text-base">
                Nền tảng bán vé xe Bus Journey là dịch vụ giúp người dùng dễ
                dàng tìm và đặt mua vé xe khách.
              </p>
              <div className="flex gap-5 mt-2 items-center">
                <a style={{ width: 24, height: 24 }} href="https://www.facebook.com/thebusjourney">
                  <img src="https://cdn.simpleicons.org/zalo/0000ff" alt="Zalo Logo" />
                </a>
                <a style={{ width: 24, height: 24 }} href="https://www.tiktok.com/@thebusjourney">
                  <img src="https://cdn.simpleicons.org/tiktok/000000" alt="TikTok Logo" />
                </a>
                <a style={{ width: 24, height: 24 }} href="https://www.instagram.com/thebusjourney/">
                  <img src="https://cdn.simpleicons.org/instagram/ff3300" alt="Instagram Logo" />
                </a>
                <a style={{ width: 24, height: 24 }} href="https://www.facebook.com/thebusjourney">
                  <img src="https://cdn.simpleicons.org/facebook/0000ff" alt="Facebook Logo" />
                </a>
              </div>
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <div className="text-2xl font-bold text-primary">
                Thông tin liên hệ
              </div>
              <div className="flex flex-col">
                <div className="text-xs sm:text-base">
                  <strong>Địa chỉ:</strong> Trụ sở The Bus Journey 999 Hùng
                  Vương, Phường 11, Quận Tân Phú, TP. Hồ Chí Minh
                </div>
                <div className="text-xs sm:text-base">
                  <strong>Hotline:</strong> 0332333005
                </div>
                <div className="text-xs sm:text-base">
                  <strong>Email:</strong> thebusjourney71@gmail.com
                </div>
                <div className="text-xs sm:text-base">
                  <strong>Website:</strong>{" "}
                  <a href="/">https://the-bus-journey.vercel.app/</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 gap-1">
              <div className="text-2xl font-bold text-primary">
                Chính sách và điều khoản
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-start hover:font-bold cursor-pointer">Chính sách bảo mật</div>
                <div className="flex justify-start hover:font-bold cursor-pointer">Điều khoản dịch vụ</div>
                <div className="flex justify-start hover:font-bold cursor-pointer">Chính sách hoàn tiền</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="flex justify-center items-center h-10 mt-10 bg-primary text-sm font-bold text-white">
        © 2025 | Bản quyền thuộc về BUS JOURNEY.
      </div>
    </footer>
  );
}
