
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  MessageSquarePlus,
  Search,
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
};

interface ConversationListProps {
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  activeConversation?: string;
}

const ConversationList = ({
  onNewChat,
  onSelectChat,
  activeConversation,
}: ConversationListProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Annual Report Analysis",
      lastMessage: "What are the key financial metrics from the annual report?",
      date: new Date(2023, 5, 15),
    },
    {
      id: "2",
      title: "Contract Review",
      lastMessage: "Summarize the main points from the vendor contract.",
      date: new Date(2023, 5, 14),
    },
    {
      id: "3",
      title: "Research Papers",
      lastMessage: "What are the key findings from the research papers?",
      date: new Date(2023, 5, 10),
    },
    {
      id: "4",
      title: "Market Analysis",
      lastMessage: "What trends are emerging in the Q2 market analysis?",
      date: new Date(2023, 5, 5),
    },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleDelete = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    toast({
      title: "Conversation deleted",
      description: "The conversation has been deleted successfully.",
    });
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, title: editTitle } : conv
        )
      );
      setEditingId(null);
      toast({
        title: "Conversation renamed",
        description: "The conversation has been renamed successfully.",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Conversations</CardTitle>
        <CardDescription>
          Your recent document-related conversations
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <Button onClick={onNewChat} className="w-full">
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {filteredConversations.length > 0 ? (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative rounded-md p-3 transition-colors hover:bg-accent cursor-pointer",
                    activeConversation === conversation.id && "bg-accent"
                  )}
                  onClick={() => onSelectChat(conversation.id)}
                >
                  {editingId === conversation.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        className="h-7 py-1"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(conversation.id);
                          } else if (e.key === "Escape") {
                            setEditingId(null);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(conversation.id);
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
                                handleEdit(conversation);
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
                                handleDelete(conversation.id);
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
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-center">
                {searchQuery ? "No matching conversations found" : "No conversations yet"}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
