
export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
}

export interface ConversationListProps {
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  activeConversation?: string;
}
