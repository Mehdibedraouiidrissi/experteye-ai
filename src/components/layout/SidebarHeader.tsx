
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
        <BookOpen className="h-7 w-7 text-expertEye-600" />
        {!isCollapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-expertEye-600 to-expertEye-800 bg-clip-text text-transparent">
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
