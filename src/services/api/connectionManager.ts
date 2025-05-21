
/**
 * Utilities for checking backend API connection status
 */
export class ConnectionManager {
  private static backendAvailable: boolean = true;
  private static connectionCheckInProgress: boolean = false;
  private static lastConnectionCheck: number = 0;
  private static connectionCheckInterval: number = 2000; // 2 seconds
  private static API_BASE_URL = import.meta.env.PROD 
    ? "/api" 
    : "http://localhost:5000/api";
  
  /**
   * Gets the API base URL for requests
   */
  static getApiBaseUrl(): string {
    return this.API_BASE_URL;
  }
  
  /**
   * Checks if the backend is available
   */
  static isBackendAvailable(): boolean {
    return this.backendAvailable;
  }

  /**
   * Sets the backend availability status
   */
  static setBackendAvailable(available: boolean): void {
    this.backendAvailable = available;
  }
  
  /**
   * Checks connection to the backend API server
   */
  static async checkBackendConnection(): Promise<boolean> {
    // Don't check too frequently to avoid overwhelming the server
    const now = Date.now();
    if (this.connectionCheckInProgress || (now - this.lastConnectionCheck < this.connectionCheckInterval)) {
      console.log("Connection check skipped: too soon or already in progress");
      return this.backendAvailable;
    }
    
    this.connectionCheckInProgress = true;
    this.lastConnectionCheck = now;
    console.log("Checking backend connection to:", this.API_BASE_URL);
    
    try {
      const timestamp = new Date().getTime();
      // Use a simpler request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      console.log(`Sending healthcheck request to ${this.API_BASE_URL}/healthcheck?_t=${timestamp}`);
      
      const response = await fetch(`${this.API_BASE_URL}/healthcheck?_t=${timestamp}`, {
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
}
