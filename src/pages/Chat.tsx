
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatInterface from "@/components/chat/ChatInterface";
import ConversationList from "@/components/chat/ConversationList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const Chat = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeConversation, setActiveConversation] = useState<string | undefined>(undefined);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    document.title = "ExpertEye - Chat";
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile]);
  
  const handleNewChat = () => {
    setActiveConversation(undefined);
  };
  
  const handleSelectChat = (id: string) => {
    setActiveConversation(id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };
  
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-6 relative">
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="absolute top-0 left-0 z-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div
          className={cn(
            "h-full w-80 flex-shrink-0 transition-all duration-300 ease-in-out",
            isMobile && "absolute top-0 bottom-0 left-0 z-10 bg-background",
            isMobile && !showSidebar && "-translate-x-full opacity-0"
          )}
        >
          <ConversationList
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            activeConversation={activeConversation}
          />
        </div>
        
        <div className={cn(
          "flex-1 h-full overflow-hidden relative bg-card rounded-md border",
          isMobile && showSidebar && "opacity-50"
        )}>
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
