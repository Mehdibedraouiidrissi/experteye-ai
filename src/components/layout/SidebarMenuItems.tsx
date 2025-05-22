
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  Settings,
  PlusCircle,
  UserCircle2,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface SidebarMenuItemsProps {
  isCollapsed: boolean;
}

export function SidebarMenuItems({ isCollapsed }: SidebarMenuItemsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is admin
    const username = localStorage.getItem("username");
    setIsAdmin(username === "admin");
  }, []);
  
  const menuItems: MenuItem[] = [
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
      icon: <Settings className="h-5 w-5" />,
      adminOnly: true
    },
    {
      name: "Account",
      path: "/account",
      icon: <UserCircle2 className="h-5 w-5" />,
      adminOnly: false
    }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 pb-3">
        <Button 
          variant="outline"
          className="w-full flex items-center justify-start gap-2 border-dashed"
          onClick={() => window.location.href = "/chat"}
        >
          <PlusCircle className="h-5 w-5" />
          {!isCollapsed && <span>New Chat</span>}
        </Button>
      </div>
      <div className="space-y-1 px-2">
        <p className={cn(
          "text-xs font-medium text-muted-foreground px-3 py-2",
          isCollapsed && "opacity-0"
        )}>
          {!isCollapsed && "Navigation"}
        </p>
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            {item.icon}
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
