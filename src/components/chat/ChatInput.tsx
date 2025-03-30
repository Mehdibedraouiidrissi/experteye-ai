
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: () => void;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  showThinking: boolean;
  setShowThinking: (value: boolean) => void;
}

const ChatInput = ({
  onSendMessage,
  input,
  setInput,
  isLoading,
  showThinking,
  setShowThinking
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
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
          onClick={onSendMessage}
          disabled={!input.trim() || isLoading}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
