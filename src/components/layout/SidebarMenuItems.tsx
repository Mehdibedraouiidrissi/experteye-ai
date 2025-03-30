
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  Settings,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
          isCollapsed && "sr-only"
        )}>
          {!isCollapsed && "Navigation"}
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            {item.icon}
            {!isCollapsed && <span className="ml-3">{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
