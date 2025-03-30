
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage, { MessageType } from "./ChatMessage";
import { SendHorizontal, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  sources?: Array<{ id: string; title: string; page?: number; }>;
  thinking?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm ExpertEye, your document intelligence assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const exampleQuestions = [
    "What's the key information in the annual report?",
    "Summarize the financial data from Q2 2023",
    "Find all mentions of compliance requirements",
    "Extract the main conclusions from the research paper"
  ];

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Sample thinking process
      const thinking = `1. Analyzing query: "${input}"
2. Searching document collection for relevant information
3. Found 3 relevant document chunks
4. Synthesizing information from chunks
5. Generating comprehensive response`;

      // Sample response with source attribution
      const botReply: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: `Based on the documents I've analyzed, here's what I found regarding your query:

The information you're looking for appears in several documents. The Annual Financial Report from 2023 indicates a 12% growth in revenue compared to the previous year, with the technology division showing the strongest performance at 18% growth.

The strategic planning document also mentions these figures and provides additional context about market conditions that contributed to this growth, including expanded operations in the APAC region.`,
        timestamp: new Date(),
        thinking: showThinking ? thinking : undefined,
        sources: [
          { id: "doc1", title: "Annual Financial Report 2023", page: 42 },
          { id: "doc2", title: "Strategic Planning 2024-2025" },
          { id: "doc3", title: "Regional Market Analysis", page: 15 },
        ],
      };

      setMessages(prev => [...prev, botReply]);
      setIsLoading(false);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  const handleRegenerate = () => {
    // Remove the last assistant message
    setMessages(prev => prev.filter((_, index) => index !== prev.length - 1));

    // Show toast notification
    toast({
      title: "Regenerating response",
      description: "Generating a new answer to your question..."
    });

    // Simulate a delay before adding a new response
    setIsLoading(true);
    setTimeout(() => {
      const thinking = `1. Re-analyzing query with different approach
2. Searching document collection with expanded parameters
3. Found 4 relevant document chunks
4. Synthesizing information with different emphasis
5. Generating revised comprehensive response`;

      const regeneratedReply: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: `I've taken another look at your query and found additional information:

According to the latest financial reports, there was indeed a 12% overall growth in revenue for 2023, but I can provide more detail. The technology division led with 18% growth, followed by services at 14% and products at 8%.

The strategic planning document highlights that this growth outpaced industry averages by approximately 3.5 percentage points, largely due to the expansion into the APAC region which contributed 4.2% of the overall growth.

The quarterly breakdown shows stronger performance in Q2 and Q3, with growth rates of 14.5% and 16.2% respectively.`,
        timestamp: new Date(),
        thinking: showThinking ? thinking : undefined,
        sources: [
          { id: "doc1", title: "Annual Financial Report 2023", page: 42 },
          { id: "doc2", title: "Strategic Planning 2024-2025" },
          { id: "doc3", title: "Regional Market Analysis", page: 15 },
          { id: "doc4", title: "Quarterly Performance Review", page: 7 },
        ],
      };

      setMessages(prev => [...prev, regeneratedReply]);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="pb-4 px-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              content={message.content}
              timestamp={message.timestamp}
              sources={message.sources}
              thinking={message.thinking}
              isLatest={index === messages.length - 1 && message.type === "assistant"}
              onRegenerate={index === messages.length - 1 && message.type === "assistant" ? handleRegenerate : undefined}
            />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Generating response...</span>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      {messages.length === 1 && !isLoading && (
        <div className="px-4 py-4 flex flex-wrap gap-2 justify-center">
          {exampleQuestions.map((question) => (
            <Button
              key={question}
              variant="outline"
              className="text-sm"
              onClick={() => handleExampleClick(question)}
            >
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              {question}
            </Button>
          ))}
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center justify-end pb-3">
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-thinking" className="text-sm cursor-pointer">
              Show thinking process
            </Label>
            <Switch
              id="show-thinking"
              checked={showThinking}
              onCheckedChange={setShowThinking}
            />
          </div>
        </div>

        <div className="relative">
          <Input
            placeholder="Ask about your documents..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pr-16 py-6 text-base"
            disabled={isLoading}
            autoFocus
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
