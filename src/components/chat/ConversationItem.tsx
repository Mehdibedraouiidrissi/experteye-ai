
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Conversation } from "./types/ConversationType";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ConversationItemProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(conversation.title);
  };

  const saveEdit = () => {
    if (editTitle.trim()) {
      onRename(conversation.id, editTitle);
      setIsEditing(false);
      toast({
        title: "Conversation renamed",
        description: "The conversation has been renamed successfully.",
      });
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-md p-3 transition-colors hover:bg-accent cursor-pointer",
        isActive && "bg-accent"
      )}
      onClick={() => onSelect(conversation.id)}
    >
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
            className="h-7 py-1"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveEdit();
              } else if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              saveEdit();
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="mr-2 line-clamp-1 flex-1 font-medium">
              {conversation.title}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conversation.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {conversation.lastMessage}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {conversation.date.toLocaleDateString()}
          </p>
        </>
      )}
    </div>
  );
};

export default ConversationItem;
