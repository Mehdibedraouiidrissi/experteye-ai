
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
        className="rounded-full h-16 w-16 shadow-lg bg-[#8257e6] hover:bg-[#7046c7] text-white"
        onClick={() => navigate("/chatdemo")}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ChatButton;
