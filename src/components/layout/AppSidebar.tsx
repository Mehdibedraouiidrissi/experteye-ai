
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { SidebarHeader as CustomSidebarHeader } from "./SidebarHeader";
import { SidebarFooter as CustomSidebarFooter } from "./SidebarFooter";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible={isMobile ? "offcanvas" : "icon"} 
      className="bg-sidebar border-r border-sidebar-border"
    >
      <SidebarHeader>
        <CustomSidebarHeader 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse} 
        />
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarMenuItems isCollapsed={isCollapsed} />
      </SidebarContent>
      <SidebarFooter>
        <CustomSidebarFooter isCollapsed={isCollapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}
