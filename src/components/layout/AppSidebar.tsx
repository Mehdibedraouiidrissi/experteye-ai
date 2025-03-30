
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  Settings, 
  LogOut,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate("/login");
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: "Chat", 
      path: "/chat", 
      icon: <MessageSquare className="h-5 w-5" /> 
    },
    { 
      name: "Documents", 
      path: "/documents", 
      icon: <FolderOpen className="h-5 w-5" /> 
    },
    { 
      name: "Settings", 
      path: "/settings", 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  return (
    <Sidebar
      defaultCollapsed={false}
      collapsible
      onCollapseChange={setIsCollapsed}
    >
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Eye className="h-7 w-7 text-expertEye-600" />
          {!isCollapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-expertEye-600 to-expertEye-800 bg-clip-text text-transparent">
              ExpertEye
            </span>
          )}
        </div>
        <SidebarTrigger className="h-8 w-8" />
      </SidebarHeader>
      <SidebarContent className="py-2">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center border-dashed"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
