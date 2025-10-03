
import { Outlet } from "react-router-dom";
import Header from "../components/layout/header";
import Footer from "@/components/layout/footer";

export default function UserLayout() {
  const pathname = window.location.pathname;
  const isFooterHidden = ["/information-checkout", "/method-checkout", "/become-partner"].includes(pathname);
  return (
    <div className="h-screen relative max-w-screen overflow-x-hidden">
      <Header />
      <div className="flex min-h-[70%]">
        <Outlet />
      </div>
      {!isFooterHidden && <Footer />}
    </div>
  );
}
