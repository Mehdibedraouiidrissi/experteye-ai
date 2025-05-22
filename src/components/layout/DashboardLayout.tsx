
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import Logo from "@/components/shared/Logo";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("User");
  
  useEffect(() => {
    // Get the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b py-2 px-4 flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-primary/10 text-foreground rounded-full" 
                onClick={() => navigate("/settings")}
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="hidden md:inline">{username}</span>
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
