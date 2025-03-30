
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "./types";

const useChatMessages = () => {
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
  const { toast } = useToast();

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

  return {
    messages,
    input,
    setInput,
    isLoading,
    showThinking,
    setShowThinking,
    handleSendMessage,
    handleRegenerate
  };
};

export default useChatMessages;
