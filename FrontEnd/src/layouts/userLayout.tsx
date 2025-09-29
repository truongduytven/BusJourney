
import { Outlet } from "react-router-dom";
import Header from "../components/layout/header";
import Footer from "@/components/layout/footer";

export default function UserLayout() {
  const pathname = window.location.pathname;
  return (
    <div className="h-screen relative max-w-screen overflow-x-hidden">
      <Header />
      <div className="flex min-h-[70%] pt-10">
        <Outlet />
      </div>
      {pathname !== "/information-checkout" && pathname !== "/method-checkout" && <Footer />}
    </div>
  );
}
