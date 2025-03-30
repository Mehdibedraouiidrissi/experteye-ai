
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarMenuItemsProps {
  isCollapsed: boolean;
}

export function SidebarMenuItems({ isCollapsed }: SidebarMenuItemsProps) {
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
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  return (
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
  );
}
