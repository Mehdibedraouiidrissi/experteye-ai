
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatInterface from "@/components/chat/ChatInterface";
import ConversationList from "@/components/chat/ConversationList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
    if (isMobile) {
      setShowSidebar(false);
    }
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
      <div className="flex h-[calc(100vh-8rem)] gap-0 relative">
        {/* Mobile sidebar toggle button */}
        {isMobile && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="absolute top-0 left-0 z-20 m-2 bg-background"
          >
            {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        )}
        
        {/* Conversation sidebar */}
        <div
          className={cn(
            "h-full border-r flex-shrink-0 transition-smooth bg-background",
            isMobile ? "absolute top-0 bottom-0 left-0 z-10 w-full sm:w-80" : "w-80",
            isMobile && !showSidebar && "-translate-x-full"
          )}
        >
          <ConversationList
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            activeConversation={activeConversation}
          />
        </div>
        
        {/* Chat interface */}
        <div className={cn(
          "flex-1 h-full overflow-hidden relative bg-background transition-smooth",
          isMobile && showSidebar ? "opacity-30 pointer-events-none" : "opacity-100"
        )}>
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
