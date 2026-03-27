import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 p-6 lg:p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
