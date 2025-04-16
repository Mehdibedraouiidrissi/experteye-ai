import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000/api";

export interface ApiError {
  status: number;
  message: string;
}

export class ApiService {
  private static token: string | null = null;
  
  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }
  
  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }
  
  static async request<T>(
    endpoint: string,
    method: string = "GET",
    data: any = null,
    isFormData: boolean = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (!isFormData && data) {
      headers["Content-Type"] = "application/json";
    }
    
    const options: RequestInit = {
      method,
      headers,
      credentials: "include",
    };
    
    if (data) {
      if (isFormData || (typeof data === 'string' && endpoint === "/auth/token")) {
        options.body = data;
        if (endpoint === "/auth/token") {
          headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
      } else {
        options.body = JSON.stringify(data);
      }
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || `Error: ${response.status}`;
        } catch {
          // For auth failures, provide a more user-friendly message
          if (endpoint === "/auth/token" && response.status === 401) {
            errorMessage = "Username or password invalid";
          } else if (endpoint === "/auth/register") {
            errorMessage = "Registration failed - server may be unavailable";
          } else {
            errorMessage = `Request failed with status: ${response.status}`;
          }
        }
        
        const error: ApiError = {
          status: response.status,
          message: errorMessage,
        };
        throw error;
      }
      
      // Check if response is empty
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error (e.g., server not reachable)
        const networkError: ApiError = {
          status: 0,
          message: "Unable to connect to the server. Please check if the backend is running."
        };
        throw networkError;
      }
      console.error("API request failed:", error);
      throw error;
    }
  }
}

export const AuthApi = {
  async login(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    const response = await ApiService.request<{ access_token: string, token_type: string }>(
      "/auth/token",
      "POST",
      formData.toString(),
      false
    );
    
    ApiService.setToken(response.access_token);
    return response;
  },
  
  async register(username: string, email: string, password: string) {
    try {
      return await ApiService.request(
        "/auth/register",
        "POST",
        { username, email, password }
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      // Enhance the error message if it's related to the API being unreachable
      if (error.status === 0) {
        error.message = "Unable to connect to the backend server. Please ensure the backend service is running.";
      }
      throw error;
    }
  },
  
  async getUserProfile() {
    return await ApiService.request("/auth/users/me", "GET");
  },
  
  logout() {
    ApiService.setToken(null);
    window.location.href = "/login";
  }
};

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

export const useApiErrorHandler = () => {
  const { toast } = useToast();
  
  const handleError = (error: any) => {
    if (error && typeof error === 'object' && 'message' in error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    // Handle authentication errors
    if (error && error.status === 401) {
      AuthApi.logout();
      window.location.href = "/login";
    }
  };
  
  return { handleError };
};
