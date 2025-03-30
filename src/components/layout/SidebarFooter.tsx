
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate("/login");
  };

  return (
    <div className="p-4">
      <Separator className="mb-4" />
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center border-dashed"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        {!isCollapsed && <span className="ml-2">Logout</span>}
      </Button>
    </div>
  );
}
