
import { TokenManager } from './tokenManager';
import { ConnectionManager } from './connectionManager';

/**
 * Handles API requests with authentication, retries, and error handling
 */
export class RequestHandler {
  /**
   * Makes an authenticated request to the API
   */
  static async request<T>(
    endpoint: string,
    method: string = "GET",
    data: any = null,
    isFormData: boolean = false
  ): Promise<T> {
    try {
      // First check backend connection if we haven't confirmed it's available
      if (!ConnectionManager.isBackendAvailable()) {
        console.log("Backend not available, checking connection before request");
        const isAvailable = await ConnectionManager.checkBackendConnection();
        if (!isAvailable) {
          throw {
            status: 0,
            message: `Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${ConnectionManager.getApiBaseUrl()}.`
          };
        }
      }
      
      const url = `${ConnectionManager.getApiBaseUrl()}${endpoint}`;
      const token = TokenManager.getToken();
      
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
        ConnectionManager.setBackendAvailable(true);
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
        ConnectionManager.setBackendAvailable(false);
        throw {
          status: 0,
          message: `Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${ConnectionManager.getApiBaseUrl()}.`
        };
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        ConnectionManager.setBackendAvailable(false);
        throw {
          status: 0,
          message: `Request timed out. Unable to connect to the backend server. Please ensure the backend service is running and accessible at ${ConnectionManager.getApiBaseUrl()}.`
        };
      }
      
      throw error;
    }
  }
}
