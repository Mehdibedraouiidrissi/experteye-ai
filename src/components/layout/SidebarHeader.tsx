
import { BookOpen } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Logo from "@/components/shared/Logo";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <Logo showText={!isCollapsed} />
      <SidebarTrigger 
        className="h-8 w-8" 
        onClick={onToggleCollapse} 
      />
    </div>
  );
}
