
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b py-2 px-4 flex justify-between items-center">
            <div 
              className="logo-container cursor-pointer" 
              onClick={() => navigate("/")}
            >
              <div className="logo-img flex items-center justify-center">
                <img 
                  src="/lovable-uploads/2c36dba7-9c21-44c0-9d59-c51c67614466.png" 
                  alt="ExpertEye Logo" 
                  className="h-8 w-8"
                />
              </div>
              <h1 className="text-xl font-bold text-primary hidden md:block">
                ExpertEye AI Assistant
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-primary/10 text-foreground rounded-full" 
                onClick={() => navigate("/settings")}
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="hidden md:inline">Admin User</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
