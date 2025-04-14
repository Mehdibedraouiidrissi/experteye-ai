
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThinkingProcess from "./ThinkingProcess";
import SourceReferences from "./SourceReferences";

export type MessageType = "user" | "assistant";

interface SourceReference {
  id: string;
  title: string;
  page?: number;
  context?: string;
  relevance?: number;
}

interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp: Date;
  sources?: SourceReference[];
  thinking?: string;
  isLatest?: boolean;
  onRegenerate?: () => void;
}

const ChatMessage = ({
  type,
  content,
  timestamp,
  sources,
  thinking,
  isLatest = false,
  onRegenerate
}: ChatMessageProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const isBot = type === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "group flex w-full items-start gap-4 py-4",
      isBot ? "bg-muted/40" : ""
    )}>
      <Avatar className={cn(
        "mt-1 h-8 w-8 rounded-md",
        isBot ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
      )}>
        <div className="flex h-full w-full items-center justify-center">
          {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>
      </Avatar>

      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm font-medium">
              {isBot ? "ExpertEye" : "You"}
            </p>
            <span className="text-xs text-muted-foreground ml-2">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {isBot && isLatest && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  toast({ title: "Helpful feedback received", description: "Thank you for your feedback!" });
                }}
              >
                <ThumbsUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  toast({ title: "Feedback received", description: "We'll work to improve our responses." });
                }}
              >
                <ThumbsDown size={14} />
              </Button>
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onRegenerate}
                >
                  <RotateCcw size={14} />
                </Button>
              )}
            </div>
          )}
        </div>

        {thinking && isBot && <ThinkingProcess thinking={thinking} />}

        <div className="mt-1 whitespace-pre-wrap">
          {content}
        </div>

        {isBot && sources && sources.length > 0 && (
          <SourceReferences sources={sources} />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
