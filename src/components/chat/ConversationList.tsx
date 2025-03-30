
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import NewChatButton from "./NewChatButton";
import SearchBox from "./SearchBox";
import ConversationListContent from "./ConversationListContent";
import { Conversation, ConversationListProps } from "./types/ConversationType";

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

  const handleDelete = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    toast({
      title: "Conversation deleted",
      description: "The conversation has been deleted successfully.",
    });
  };

  const handleRename = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, title: newTitle } : conv
      )
    );
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">Conversations</CardTitle>
        <CardDescription>
          Your recent document-related conversations
        </CardDescription>
        <NewChatButton onClick={onNewChat} />
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ConversationListContent
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectChat={onSelectChat}
          onDeleteConversation={handleDelete}
          onRenameConversation={handleRename}
          searchQuery={searchQuery}
        />
      </CardContent>
    </Card>
  );
};

export default ConversationList;
