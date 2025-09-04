import { SidebarProvider } from "~/components/ui/sidebar";
import AdminPageAuthCheck from "~/features/auth/AdminPageAuthCheck";
import Navbar from "~/features/navbar/components/navbar";
import NavbarAdminContent from "~/features/navbar/components/navbar-admin-content";
import AppSidebar from "~/features/sidebar/components/app-sidebar";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}
const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  return (
    <AdminPageAuthCheck>
      <SidebarProvider className="w-full">
        <AppSidebar />
        <div className="flex w-full flex-col">
          <Navbar>
            <NavbarAdminContent />
          </Navbar>
          <div className="flex w-full items-center justify-center lg:pl-6 xl:pl-8">
            <div className="container flex-col">{children}</div>
          </div>
        </div>
      </SidebarProvider>
    </AdminPageAuthCheck>
  );
};

export default AdminDashboardLayout;
