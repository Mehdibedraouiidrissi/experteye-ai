
const API_BASE_URL = import.meta.env.PROD 
  ? "/api" 
  : "http://localhost:5000/api"; 

export class ApiService {
  private static token: string | null = null;
  private static backendAvailable: boolean = true;
  private static connectionCheckInProgress: boolean = false;
  private static lastConnectionCheck: number = 0;
  private static connectionCheckInterval: number = 2000; // 2 seconds
  
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

  static async checkBackendConnection(): Promise<boolean> {
    // Don't check too frequently to avoid overwhelming the server
    const now = Date.now();
    if (this.connectionCheckInProgress || (now - this.lastConnectionCheck < this.connectionCheckInterval)) {
      console.log("Connection check skipped: too soon or already in progress");
      return this.backendAvailable;
    }
    
    this.connectionCheckInProgress = true;
    this.lastConnectionCheck = now;
    console.log("Checking backend connection to:", API_BASE_URL);
    
    try {
      const timestamp = new Date().getTime();
      // Use a simpler request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      console.log(`Sending healthcheck request to ${API_BASE_URL}/healthcheck?_t=${timestamp}`);
      
      const response = await fetch(`${API_BASE_URL}/healthcheck?_t=${timestamp}`, {
        method: 'GET',
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        },
        mode: "cors",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      this.backendAvailable = response.ok;
      console.log(`Backend server connection check: ${this.backendAvailable ? 'available' : 'unavailable'}, status: ${response.status}`);
      
      if (response.ok) {
        try {
          const data = await response.json();
          console.log("Healthcheck response:", data);
        } catch (e) {
          console.log("Healthcheck response was not JSON:", e);
        }
      }
      
      this.connectionCheckInProgress = false;
      return this.backendAvailable;
    } catch (error) {
      console.error("Backend server connection check failed:", error);
      this.backendAvailable = false;
      this.connectionCheckInProgress = false;
      return false;
    }
  }
  
  static isBackendAvailable(): boolean {
    return this.backendAvailable;
  }
  
  static async request<T>(
    endpoint: string,
    method: string = "GET",
    data: any = null,
    isFormData: boolean = false
  ): Promise<T> {
    try {
      // First check backend connection if we haven't confirmed it's available
      if (!this.backendAvailable) {
        console.log("Backend not available, checking connection before request");
        const isAvailable = await this.checkBackendConnection();
        if (!isAvailable) {
          throw {
            status: 0,
            message: `Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${API_BASE_URL}.`
          };
        }
      }
      
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
      
      console.log(`Making API request to: ${url}?_t=${timestamp} with method: ${method}`);
      
      // Add timestamp parameter to URL to prevent caching
      const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${timestamp}`;
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      options.signal = controller.signal;
      
      const response = await fetch(cacheBustUrl, options);
      
      clearTimeout(timeoutId);
      
      console.log(`Response status: ${response.status}`);
      
      // If this is an authentication request and it's successful, mark backend as available
      if (endpoint === "/auth/token" && response.ok) {
        this.backendAvailable = true;
      }
      
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
      console.error(`API request failed:`, error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.backendAvailable = false;
        throw {
          status: 0,
          message: `Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${API_BASE_URL}.`
        };
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        this.backendAvailable = false;
        throw {
          status: 0,
          message: `Request timed out. Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${API_BASE_URL}.`
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
