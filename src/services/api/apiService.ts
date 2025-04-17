import { ApiError } from "./types";

// Ensure correct API URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? "/api" 
  : "http://localhost:5000/api"; 

export class ApiService {
  private static token: string | null = null;
  
  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
      console.log("Auth token set successfully");
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
    
    // For login, ensure we use the right content type
    if (endpoint === "/auth/token" && method === "POST") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else if (!isFormData && data && typeof data !== 'string') {
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
      } else {
        options.body = JSON.stringify(data);
      }
    }
    
    try {
      console.log(`Attempting API request to: ${url} with method: ${method}`);
      console.log("Request options:", JSON.stringify({
        method,
        headers,
        hasBody: !!options.body
      }, null, 2));
      
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
      console.error(`API request failed to ${url}:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError: ApiError = {
          status: 0,
          message: `Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${API_BASE_URL}. Try running './start-dev.sh' script from the project root.`
        };
        throw networkError;
      }
      
      throw error;
    }
  }
}
