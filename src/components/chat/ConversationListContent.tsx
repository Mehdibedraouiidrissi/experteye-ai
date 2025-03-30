
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationItem from "./ConversationItem";
import { Conversation } from "./types/ConversationType";

interface ConversationListContentProps {
  conversations: Conversation[];
  activeConversation?: string;
  onSelectChat: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, title: string) => void;
  searchQuery: string;
}

const ConversationListContent = ({
  conversations,
  activeConversation,
  onSelectChat,
  onDeleteConversation,
  onRenameConversation,
  searchQuery,
}: ConversationListContentProps) => {
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollArea className="h-full p-4">
      {filteredConversations.length > 0 ? (
        <div className="space-y-3">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversation === conversation.id}
              onSelect={onSelectChat}
              onDelete={onDeleteConversation}
              onRename={onRenameConversation}
            />
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
  );
};

export default ConversationListContent;
