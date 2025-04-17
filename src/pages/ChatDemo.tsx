
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/layout/ModeToggle";
import Logo from "@/components/shared/Logo";

const ChatDemo = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am ExpertEye AI Assistant. How can I help you with market analysis or pricing benchmarks today?' }
  ]);
  const [input, setInput] = useState('');

  // Demo responses for the chatbot
  const demoResponses = [
    "Based on our latest market analysis, similar products in this sector are priced between $450-550.",
    "Our data mining shows that competitors have decreased their prices by 8% in Q1. Would you like to see the detailed report?",
    "According to our mystery shopping results, the average discount offered in your industry is currently 12% for new customers.",
    "I've analyzed the Total Cost of Ownership for your product line. The 5-year TCO is approximately 2.3x the initial purchase price.",
    "The benchmark data indicates your pricing is competitive, but there's room for optimization in the enterprise tier."
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    }, 1000);
    
    setInput('');
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
        </div>
      </main>
      
      <footer className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market analysis, pricing benchmarks, TCO..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="rounded-full"
          />
          <Button size="icon" onClick={handleSend} className="rounded-full">
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
