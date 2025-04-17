
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AuthApi } from "@/services/api";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You are being logged out of your account."
    });
    
    // Use AuthApi logout to properly clear tokens and redirect
    AuthApi.logout();
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
