
import { TokenManager } from './tokenManager';
import { ConnectionManager } from './connectionManager';
import { RequestHandler } from './requestHandler';

/**
 * Main API service that coordinates token management, 
 * connection checking, and request handling
 */
export class ApiService {
  /**
   * Sets the authentication token
   */
  static setToken(token: string | null) {
    TokenManager.setToken(token);
  }
  
  /**
   * Gets the authentication token
   */
  static getToken(): string | null {
    return TokenManager.getToken();
  }

  /**
   * Checks if backend is available
   */
  static async checkBackendConnection(): Promise<boolean> {
    return ConnectionManager.checkBackendConnection();
  }
  
  /**
   * Gets status of backend connectivity
   */
  static isBackendAvailable(): boolean {
    return ConnectionManager.isBackendAvailable();
  }
  
  /**
   * Makes an authenticated request to the API
   */
  static async request<T>(
    endpoint: string,
    method: string = "GET",
    data: any = null,
    isFormData: boolean = false
  ): Promise<T> {
    return RequestHandler.request<T>(endpoint, method, data, isFormData);
  }
  
  /**
   * Clears all browser storage
   */
  static clearStorage() {
    TokenManager.clearStorage();
  }
}
