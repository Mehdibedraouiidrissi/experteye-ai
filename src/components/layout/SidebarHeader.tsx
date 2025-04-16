
import { BookOpen } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-7 w-7 text-primary" />
        {!isCollapsed && (
          <span className="text-xl font-bold text-primary logo-text">
            ExpertEye
          </span>
        )}
      </div>
      <SidebarTrigger 
        className="h-8 w-8" 
        onClick={onToggleCollapse} 
      />
    </div>
  );
}
