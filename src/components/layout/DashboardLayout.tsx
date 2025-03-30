
import { ReactNode, useState } from "react";
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
            <h1 className="text-xl font-bold hidden md:block">ExpertEye Document Intelligence</h1>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button 
                variant="ghost" 
                className="flex items-center gap-2" 
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
