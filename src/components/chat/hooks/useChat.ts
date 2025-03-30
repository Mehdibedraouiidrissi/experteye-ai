
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "../types";

export interface UseChatReturn {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  showThinking: boolean;
  setShowThinking: (value: boolean) => void;
  handleSendMessage: () => Promise<void>;
  handleRegenerate: () => void;
  clearConversation: () => void;
  getRelevantDocuments: (query: string) => Promise<string[]>;
}

/**
 * Custom hook for managing chat messages and interactions
 * with advanced AI assistant features
 */
export const useChat = (): UseChatReturn => {
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

  // Function to simulate document retrieval
  const getRelevantDocuments = useCallback(async (query: string): Promise<string[]> => {
    // In a real application, this would connect to your RAG system
    // This is a simulation for now
    return [
      "Annual Financial Report 2023",
      "Strategic Planning 2024-2025",
      "Regional Market Analysis",
      "Quarterly Performance Review"
    ];
  }, []);

  const generateAnswer = useCallback(async (userQuery: string): Promise<{content: string, thinking: string, sources: any[]}> => {
    // In a real application, this would use your backend AI service
    // This is a simulation for now
    
    // Simulate thinking process with more sophisticated steps
    const thinking = `1. Analyzing query: "${userQuery}"
2. Searching document collection for relevant information
3. Found 3 relevant document chunks
4. Extracting key information from each chunk
5. Identifying patterns and relationships between information points
6. Synthesizing information from chunks
7. Generating comprehensive response
8. Validating response against source documents`;

    // Simulate different response patterns based on query content
    let content = '';
    const sources = [];
    
    if (userQuery.toLowerCase().includes('financial') || userQuery.toLowerCase().includes('report')) {
      content = `Based on my analysis of your financial documents, I can report the following:

The Annual Financial Report from 2023 indicates a 12% growth in revenue compared to the previous year, with the technology division showing the strongest performance at 18% growth.

The strategic planning document also mentions these figures and provides additional context about market conditions that contributed to this growth, including expanded operations in the APAC region.

Would you like me to provide a more detailed breakdown of the quarterly performance?`;
      
      sources.push(
        { id: "doc1", title: "Annual Financial Report 2023", page: 42 },
        { id: "doc2", title: "Strategic Planning 2024-2025" },
        { id: "doc3", title: "Quarterly Performance Review", page: 15 },
      );
    } else if (userQuery.toLowerCase().includes('strategy') || userQuery.toLowerCase().includes('planning')) {
      content = `I've analyzed the strategic planning documents and found the following key points:

1. The company plans to expand into 3 new markets in the next fiscal year
2. R&D budget is being increased by 15% with focus on AI and sustainable technologies
3. The 5-year vision includes becoming carbon neutral by 2028
4. There's a planned restructuring of the sales department to better align with regional market needs

The strategic goals appear well-aligned with the market analysis report, which identifies growing demand in the sectors you're targeting.`;
      
      sources.push(
        { id: "doc2", title: "Strategic Planning 2024-2025" },
        { id: "doc3", title: "Regional Market Analysis", page: 8 },
        { id: "doc4", title: "Board Meeting Minutes - Q4 2023", page: 3 },
      );
    } else {
      content = `Based on the documents I've analyzed, here's what I found regarding your query:

The information you're looking for appears in several documents. There are multiple references that might be relevant to your question across the document collection.

I can see that there are related discussions in both the quarterly reviews and strategic planning documents. The most relevant information appears on page 15 of the Regional Market Analysis, which provides context for your query.

Would you like me to focus my analysis on a particular aspect of this topic?`;
      
      sources.push(
        { id: "doc1", title: "Annual Financial Report 2023", page: 42 },
        { id: "doc2", title: "Strategic Planning 2024-2025" },
        { id: "doc3", title: "Regional Market Analysis", page: 15 },
      );
    }

    return {
      content,
      thinking,
      sources
    };
  }, []);

  const handleSendMessage = async (): Promise<void> => {
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

    try {
      // Generate answer based on user query
      const { content, thinking, sources } = await generateAnswer(input);

      // Add assistant response with generated answer
      const botReply: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: content,
        timestamp: new Date(),
        thinking: showThinking ? thinking : undefined,
        sources: sources,
      };

      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      toast({
        title: "Error generating response",
        description: "There was a problem processing your request.",
        variant: "destructive"
      });
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = (): void => {
    // Remove the last assistant message
    setMessages(prev => prev.filter((_, index) => index !== prev.length - 1));

    // Show toast notification
    toast({
      title: "Regenerating response",
      description: "Generating a new answer to your question..."
    });

    // Simulate a delay before adding a new response
    setIsLoading(true);
    
    setTimeout(async () => {
      try {
        // Find the last user message to regenerate a response for
        const lastUserMessage = [...messages].reverse().find(m => m.type === "user");
        
        if (lastUserMessage) {
          // Generate a new response with more detail
          const { content, thinking, sources } = await generateAnswer(lastUserMessage.content);
          
          // Modify the response slightly to make it look different
          const enhancedContent = content + `\n\nI've analyzed the documents more thoroughly this time and found additional nuances in the data that might be worth exploring further. Would you like me to elaborate on any specific aspect?`;
          
          const regeneratedReply: Message = {
            id: Date.now().toString(),
            type: "assistant",
            content: enhancedContent,
            timestamp: new Date(),
            thinking: showThinking ? thinking : undefined,
            sources: [
              ...sources,
              { id: "doc4", title: "Quarterly Performance Review", page: 7 },
            ],
          };

          setMessages(prev => [...prev, regeneratedReply]);
        }
      } catch (error) {
        toast({
          title: "Error regenerating response",
          description: "There was a problem processing your request.",
          variant: "destructive"
        });
        console.error("Error regenerating response:", error);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  const clearConversation = useCallback(() => {
    setMessages([{
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm ExpertEye, your document intelligence assistant. How can I help you today?",
      timestamp: new Date(),
    }]);
    
    toast({
      title: "Conversation cleared",
      description: "Starting a fresh conversation"
    });
  }, [toast]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    showThinking,
    setShowThinking,
    handleSendMessage,
    handleRegenerate,
    clearConversation,
    getRelevantDocuments
  };
};
