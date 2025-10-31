import Container from "./container";
import LogoMini from "@/assets/logo_mini.png";
import LogoFull from "@/assets/logo_full.png";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer-gradient text-white relative">
      {/* Wave Divider */}
      <div className="footer-wave"></div>

      <Container>
        <div className="pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo and Description */}
            <div className="footer-section-animate">
              <div className="footer-logo-container mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={LogoMini} alt="Logo" className="h-14 footer-logo-glow" />
                  <img src={LogoFull} alt="Bus Journey" className="h-10 footer-logo-glow rounded-lg" />
                </div>
              </div>
              <p className="footer-description">
                Nền tảng bán vé xe Bus Journey là dịch vụ giúp người dùng dễ
                dàng tìm và đặt mua vé xe khách trực tuyến một cách nhanh chóng,
                an toàn và tiện lợi.
              </p>
              
              {/* Social Media Icons */}
              <div className="footer-social-container">
                <a
                  href="https://www.zalo.com/thebusjourney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Zalo"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@thebusjourney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/thebusjourney/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/thebusjourney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@yourchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="footer-section-animate">
              <h3 className="footer-section-title">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="footer-contact-item">
                  <MapPin className="footer-contact-icon" />
                  <div>
                    <div className="font-medium text-white mb-1">Địa chỉ</div>
                    <div>Trụ sở The Bus Journey 999 Hùng Vương, Phường 11, Quận Tân Phú, TP. Hồ Chí Minh</div>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <Phone className="footer-contact-icon" />
                  <div>
                    <div className="font-medium text-white mb-1">Hotline</div>
                    <div>0332333005</div>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <Mail className="footer-contact-icon" />
                  <div>
                    <div className="font-medium text-white mb-1">Email</div>
                    <div>thebusjourney71@gmail.com</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Policy Links */}
            <div className="footer-section-animate">
              <h3 className="footer-section-title">Chính sách và điều khoản</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="footer-link">
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Điều khoản dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Chính sách hoàn tiền
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Hướng dẫn thanh toán
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Quy định vận chuyển
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="footer-section-animate">
              <h3 className="footer-section-title">Hỗ trợ khách hàng</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="footer-link">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Hướng dẫn đặt vé
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Tra cứu vé
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Liên hệ hỗ trợ
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Đối tác nhà xe
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p className="footer-copyright-text">
            © 2025 | Bản quyền thuộc về BUS JOURNEY. Thiết kế bởi Bus Journey Team.
          </p>
        </div>
      </Container>
    </footer>
  );
}
