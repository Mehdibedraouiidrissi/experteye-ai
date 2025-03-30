
import { MessageType } from "./ChatMessage";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  sources?: Array<{ id: string; title: string; page?: number; }>;
  thinking?: string;
}
