
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/layout/ModeToggle";
import Logo from "@/components/shared/Logo";
import { useToast } from "@/hooks/use-toast";
import { ChatApi } from "@/services/api";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Define interface for the chat API response
interface ChatSessionResponse {
  chat_id: string;
}

interface ChatMessageResponse {
  response: string;
  user_message_id?: string;
  assistant_message_id?: string;
  context?: string[];
}

const ChatDemo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am ExpertEye AI Assistant. How can I help you with market analysis or pricing benchmarks today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  // Create a new chat session when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await ChatApi.createChat() as ChatSessionResponse;
        if (response && response.chat_id) {
          setChatId(response.chat_id);
          console.log("Chat session created:", response.chat_id);
        }
      } catch (error) {
        console.error("Failed to create chat session:", error);
        // Fallback to demo mode if API fails
      }
    };
    
    initializeChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);
    
    try {
      if (chatId) {
        // If we have a chatId, use the API
        const response = await ChatApi.sendMessage(chatId, input) as ChatMessageResponse;
        if (response && response.response) {
          setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        // Fallback to demo mode - use one consistent response instead of random
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I'm currently in demo mode. In the full version, I can provide personalized market analysis and pricing insights based on your specific industry data. Would you like to learn more about our full AI assistant capabilities?" 
          }]);
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Communication Error",
        description: "Failed to get response from the assistant. Using demo mode.",
        variant: "destructive"
      });
      
      // Fallback message on error
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I apologize, but I'm having trouble connecting to the analysis database. This demo version has limited functionality. Please try again later or sign up for the full experience." 
        }]);
      }, 500);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo />
        </div>
        <ModeToggle />
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <Card key={index} className={`p-4 ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'} max-w-[80%] rounded-2xl ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
              {msg.content}
            </Card>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="p-4 bg-muted max-w-[80%] rounded-2xl rounded-tl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "200ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "400ms" }}></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market analysis, pricing benchmarks, TCO..."
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            className="rounded-full"
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            onClick={handleSend} 
            className="rounded-full"
            disabled={isLoading}
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-w-3xl mx-auto mt-4 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/login")} className="gap-2">
            Go to Full AI Assistant
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatDemo;
