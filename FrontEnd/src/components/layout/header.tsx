import LogoFull from "../../assets/logo_full.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Container from "./container";
import { AlignRight, ClipboardPen, LogIn } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { key: "1", label: "Tra cứu vé", navigateName: "/search-ticket" },
  { key: "2", label: "Trở thành đối tác", navigateName: "/become-partner" },
];

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-screen shadow-md fixed top-0 z-50 bg-popover">
      <Container>
        <div className="flex justify-between md:justify-center items-center">
          <div className="hidden md:flex flex-1">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="text-primary border-b-3 border-white font-semibold px-4 cursor-pointer pt-6 pb-5 hover:border-secondary hover:text-secondary"
                onClick={() => navigate(item.navigateName)}
              >
                {item.label}
              </div>
            ))}
          </div>
          <Link to="/" className="px-5 py-2 md:flex-1 flex justify-center">
            <img src={LogoFull} alt="Logo" className="h-10 md:h-14 w-auto" />
          </Link>
          <div className="hidden md:flex items-center justify-end px-5 flex-1">
            <div className="flex gap-4 ml-10">
              <Button
                onClick={() => navigate("/sign?type=signin")}
                className="text-white bg-secondary hover:bg-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                size="lg"
              >
                <LogIn /> Đăng nhập
              </Button>
              <Button
                onClick={() => navigate("/sign?type=signup")}
                className="text-secondary bg-transparent border border-secondary hover:bg-transparent hover:text-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                size="lg"
              >
                <ClipboardPen /> Đăng ký
              </Button>
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="mr-10 text-white md:hidden" size="icon">
                <AlignRight />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-white">
              <div className="flex flex-col w-full py-10">
                {navItems.map((item) => (
                  <SheetClose>
                    <div
                      key={item.key}
                      className="text-primary border-b-3 border-white font-semibold px-4 cursor-pointer pt-6 pb-5 hover:border-secondary hover:text-secondary"
                      onClick={() => navigate(item.navigateName)}
                    >
                      {item.label}
                    </div>
                  </SheetClose>
                ))}
                <SheetClose>
                  <div className="flex flex-col gap-4 px-6 mt-8">
                    <Button
                      onClick={() => navigate("/sign?type=signin")}
                      className="text-white bg-secondary hover:bg-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                      size="lg"
                    >
                      <LogIn /> Đăng nhập
                    </Button>
                    <Button
                      onClick={() => navigate("/sign?type=signup")}
                      className="text-secondary bg-transparent border border-secondary hover:bg-transparent hover:text-secondary cursor-pointer rounded-xl transition-transform duration-300 hover:scale-105"
                      size="lg"
                    >
                      <ClipboardPen /> Đăng ký
                    </Button>
                  </div>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
