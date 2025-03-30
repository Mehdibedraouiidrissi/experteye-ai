
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ExampleQuestions from "./ExampleQuestions";
import ChatInput from "./ChatInput";
import LoadingIndicator from "./LoadingIndicator";
import { useChat } from "./hooks/useChat";

const ChatInterface = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    showThinking,
    setShowThinking,
    handleSendMessage,
    handleRegenerate
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
