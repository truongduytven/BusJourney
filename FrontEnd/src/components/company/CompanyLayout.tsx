import CompanySidebar from "@/components/layout/companySlidebar";
import { Outlet } from "react-router-dom";

const CompanyLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <CompanySidebar />
      <div className="flex-1">
        <main className="mx-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
