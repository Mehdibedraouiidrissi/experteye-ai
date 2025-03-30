
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton = ({ onClick }: NewChatButtonProps) => {
  return (
    <div className="flex gap-2 mt-2">
      <Button onClick={onClick} className="w-full">
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};

export default NewChatButton;
