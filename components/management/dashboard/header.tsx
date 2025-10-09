import { ModeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = () => {
  return (
    <div className="flex items-center gap-2 border-b p-2">
      <SidebarTrigger />
      <ModeToggle />
    </div>
  );
};

export default DashboardHeader;
