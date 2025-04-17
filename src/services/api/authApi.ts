
import { ApiService } from "./apiService";

export const AuthApi = {
  async login(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    try {
      console.log("Attempting login with:", { username });
      const response = await ApiService.request<{ access_token: string, token_type: string }>(
        "/auth/token",
        "POST",
        formData.toString(),
        true
      );
      
      console.log("Login successful, setting token");
      ApiService.setToken(response.access_token);
      
      // Ensure we redirect properly after login
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  async register(username: string, email: string, password: string) {
    try {
      console.log("Attempting to register user:", { username, email });
      return await ApiService.request(
        "/auth/register",
        "POST",
        { username, email, password }
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      // Enhance the error message if it's related to the API being unreachable
      if (error.status === 0) {
        error.message = "Unable to connect to the backend server. Please ensure the backend service is running and try again. If the issue persists, check that the backend is running on port 5000.";
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
