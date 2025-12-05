import DashboardHeader from "@/components/management/dashboard/header";
import DashboardSidebar from "@/components/management/dashboard/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { verifySession } from "@/lib/actions/session";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await verifySession();
  const user = session.user;
  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset className="flex flex-col h-screen">
        <DashboardHeader />
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">{children}</ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
