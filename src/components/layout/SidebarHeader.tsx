
import { BookOpen } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between p-4">
      <div 
        className="logo-container cursor-pointer"
        onClick={() => navigate("/")}
      >
        <BookOpen className="h-7 w-7 text-primary logo-image" />
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
