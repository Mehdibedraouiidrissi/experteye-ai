
import { ApiService } from "./apiService";

export const ChatApi = {
  async createChat() {
    return await ApiService.request("/chat", "POST");
  },
  
  async listChats() {
    return await ApiService.request("/chat", "GET");
  },
  
  async getChat(id: string) {
    return await ApiService.request(`/chat/${id}`, "GET");
  },
  
  async sendMessage(chatId: string, message: string) {
    return await ApiService.request(
      `/chat/${chatId}/messages`,
      "POST",
      { message }
    );
  }
};
