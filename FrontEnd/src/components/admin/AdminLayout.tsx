import AdminSidebar from "@/components/layout/slidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1">
        <main className="mx-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
