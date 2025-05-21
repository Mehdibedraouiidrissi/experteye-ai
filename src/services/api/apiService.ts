
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
    
    console.log(`API Request: ${method} ${url}`);
    
    // Generate a unique timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    const headers: HeadersInit = {
      // Add cache control headers to prevent caching
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    };
    
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
      cache: "no-store",
      mode: "cors",
    };
    
    if (data) {
      if (isFormData || (typeof data === 'string' && endpoint === "/auth/token")) {
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }
    
    try {
      console.log(`Making API request to: ${url}?_t=${timestamp} with method: ${method}`);
      
      // Add timestamp parameter to URL to prevent caching
      const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${timestamp}`;
      
      const response = await fetch(cacheBustUrl, options);
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || `Error: ${response.status}`;
          console.error("API error response:", errorData);
        } catch {
          if (endpoint === "/auth/token" && response.status === 401) {
            errorMessage = "Username or password invalid";
          } else {
            errorMessage = `Request failed with status: ${response.status}`;
          }
        }
        
        const error = {
          status: response.status,
          message: errorMessage,
        };
        throw error;
      }
      
      // Check if response is empty
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const jsonData = await response.json();
        console.log("Received API response:", jsonData);
        return jsonData;
      }
      
      console.log("Received empty or non-JSON response");
      return {} as T;
    } catch (error) {
      console.error(`API request failed to ${url}:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          status: 0,
          message: `Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${API_BASE_URL}.`
        };
      }
      
      throw error;
    }
  }
  
  static clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });
    this.token = null;
  }
}
