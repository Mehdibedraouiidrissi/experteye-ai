
import React, { useState, useEffect, useRef } from 'react';
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
  
  // Track used responses to avoid repetition
  const usedResponsesRef = useRef<Set<string>>(new Set());
  
  // Demo responses for the chatbot
  const demoResponses = [
    "Based on my analysis of market trends, similar products in your sector are typically priced between $450-550. The upper quartile reaches $600 for premium offerings.",
    "Our data mining shows that competitors have decreased their prices by 8% in Q1. Would you like to see the detailed report with quarterly breakdowns?",
    "According to our mystery shopping results, the average discount offered in your industry is currently 12% for new customers, with loyalty programs offering an additional 5-7%.",
    "I've analyzed the Total Cost of Ownership for your product line. The 5-year TCO is approximately 2.3x the initial purchase price, which is competitive for your market segment.",
    "The benchmark data indicates your pricing is well-positioned, but there's room for optimization in the enterprise tier where competitors are charging 15-20% more for similar features.",
    "Market analysis suggests that bundle pricing could increase your average order value by 22% based on customer purchasing patterns in similar industries.",
    "Your pricing strategy appears to be in the mid-market range. Premium competitors are leveraging value-based pricing with success, showing 30% higher margins.",
    "Based on competitive intelligence, three major players in your space have introduced subscription models in the past quarter with promising early adoption rates.",
    "Regional pricing analysis shows your products could be priced 5-10% higher in the Northeast and West Coast markets without significant impact on conversion rates.",
    "Customer feedback data indicates price sensitivity is lower than industry average for your target demographic, suggesting room for strategic price increases.",
    "In the full version, I can provide detailed competitive positioning maps showing exactly where your offerings stand relative to market leaders in both price and feature dimensions."
  ];

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

  // Function to get a unique response that hasn't been used yet
  const getUniqueResponse = (userInput: string): string => {
    // Try to tailor response based on user input
    let relevantResponses = demoResponses;
    
    const inputLower = userInput.toLowerCase();
    
    // Filter for more contextually relevant responses
    if (inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('expensive')) {
      relevantResponses = demoResponses.filter(r => 
        r.toLowerCase().includes('price') || 
        r.toLowerCase().includes('cost') || 
        r.toLowerCase().includes('discount') ||
        r.toLowerCase().includes('$')
      );
    } else if (inputLower.includes('market') || inputLower.includes('competitor') || inputLower.includes('industry')) {
      relevantResponses = demoResponses.filter(r => 
        r.toLowerCase().includes('market') || 
        r.toLowerCase().includes('competitor') || 
        r.toLowerCase().includes('industry')
      );
    }
    
    // If no relevant responses or all have been used, reset tracking
    if (relevantResponses.length === 0 || 
        relevantResponses.every(r => usedResponsesRef.current.has(r))) {
      if (usedResponsesRef.current.size >= demoResponses.length / 2) {
        usedResponsesRef.current.clear();
      }
      relevantResponses = demoResponses;
    }
    
    // Filter out previously used responses if possible
    const unusedResponses = relevantResponses.filter(r => !usedResponsesRef.current.has(r));
    
    // If all relevant responses have been used, use any response
    const availableResponses = unusedResponses.length > 0 ? unusedResponses : relevantResponses;
    
    // Choose a random response from available options
    const randomIndex = Math.floor(Math.random() * availableResponses.length);
    const selectedResponse = availableResponses[randomIndex];
    
    // Mark this response as used
    usedResponsesRef.current.add(selectedResponse);
    
    return selectedResponse;
  };

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
        // Fallback to demo mode with improved response selection
        setTimeout(() => {
          const uniqueResponse = getUniqueResponse(input);
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: uniqueResponse
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
        const fallbackResponse = "I apologize, but I'm having trouble connecting to the analysis database. This demo version has limited functionality. Please try again later or sign up for the full experience.";
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: fallbackResponse
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
