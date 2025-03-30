
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ExampleQuestions from "./ExampleQuestions";
import ChatInput from "./ChatInput";
import LoadingIndicator from "./LoadingIndicator";
import { useChat } from "./hooks/useChat";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const ChatInterface = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    showThinking,
    setShowThinking,
    handleSendMessage,
    handleRegenerate,
    clearConversation
  } = useChat();
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

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

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {messages.length > 1 && (
        <div className="flex justify-end px-2 md:px-4 pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs flex items-center gap-1 text-muted-foreground"
            onClick={clearConversation}
          >
            <Trash2 className="h-3 w-3" />
            Clear conversation
          </Button>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className="pb-4 px-2 md:px-4">
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
          {isLoading && <LoadingIndicator />}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      {messages.length === 1 && !isLoading && (
        <ExampleQuestions 
          questions={exampleQuestions} 
          onQuestionClick={handleExampleClick} 
        />
      )}

      <ChatInput
        onSendMessage={handleSendMessage}
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        showThinking={showThinking}
        setShowThinking={setShowThinking}
      />
    </div>
  );
};

export default ChatInterface;
