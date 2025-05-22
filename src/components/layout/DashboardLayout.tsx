
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { UserCircle2, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import Logo from "@/components/shared/Logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import AdminSettings from "@/components/settings/AdminSettings";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Get the real username from localStorage
  const username = localStorage.getItem("username") || "User";
  const isAdmin = username === "admin";
  
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
                onClick={() => isAdmin ? setSettingsOpen(true) : {}}
              >
                <UserCircle2 className="h-5 w-5" />
                <span className="hidden md:inline">{username}</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
          
          {isAdmin && (
            <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SheetContent className="sm:max-w-md">
                <SheetHeader className="mb-5">
                  <SheetTitle className="text-left flex justify-between items-center">
                    Admin Account Settings
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>
                <AdminSettings />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
