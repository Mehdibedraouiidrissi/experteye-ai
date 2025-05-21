
import { ApiService } from "./apiService";

export const DocumentsApi = {
  async uploadDocument(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    
    return await ApiService.request(
      "/documents/upload",
      "POST",
      formData,
      true
    );
  },
  
  async listDocuments() {
    return await ApiService.request("/documents", "GET");
  },
  
  async getDocument(id: string) {
    return await ApiService.request(`/documents/${id}`, "GET");
  },
  
  async deleteDocument(id: string) {
    return await ApiService.request(`/documents/${id}`, "DELETE");
  }
};
