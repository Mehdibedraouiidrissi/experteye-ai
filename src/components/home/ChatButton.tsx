
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const ChatButton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed bottom-6 right-6">
      <Button 
        size="lg" 
        className="rounded-full h-16 w-16 shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        onClick={() => navigate("/chat")}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ChatButton;
